'use strict';

// ─────────────────────────────────────────────────────────────
//  SHIRT ALIGN v4
//  - Detección de cuello de remera por análisis de columna central
//  - Detección de cara con face-api.js (68 landmarks)
//  - Alineación cuello-persona con cuello-remera
// ─────────────────────────────────────────────────────────────

const ShirtAlign = (() => {

    const W = 1650, H = 2310;
    const MODELS_URL = '/frontend/assets/face-models';
    let _ready = false;
    let _loading = false;

    async function ensureLoaded() {
        if (_ready) return true;
        if (_loading) {
            while (_loading) await new Promise(r => setTimeout(r, 50));
            return _ready;
        }
        if (typeof faceapi === 'undefined') {
            console.error('[ShirtAlign] face-api.js no cargado');
            return false;
        }
        _loading = true;
        try {
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL),
                faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODELS_URL),
            ]);
            _ready = true;
            console.log('[ShirtAlign] ✓ Modelos cargados');
        } catch (err) {
            console.error('[ShirtAlign] Error cargando modelos:', err);
        }
        _loading = false;
        return _ready;
    }

    // Precarga en background
    ensureLoaded();

    // ── 1. Detectar cuello de la remera ──────────────────────────
    // Estrategia robusta:
    // a) Escanear la columna central del PNG buscando el patrón:
    //    [transparente] → [opaco=hombro/cuello] → [transparente=abertura cuello] → [opaco=cuerpo]
    //    El punto donde vuelve a ser opaco después de la abertura = fondo del cuello
    // b) Si no hay abertura clara, usar el primer pixel opaco en zona central alta
    function detectShirtNeckY(shirtImg) {
        const oc = document.createElement('canvas');
        oc.width  = W;
        oc.height = H;
        oc.getContext('2d').drawImage(shirtImg, 0, 0, W, H);
        const data = oc.getContext('2d').getImageData(0, 0, W, H).data;

        // Muestrear múltiples columnas en la zona central para robustez
        const cols = [
            Math.floor(W * 0.42),
            Math.floor(W * 0.46),
            Math.floor(W * 0.50),
            Math.floor(W * 0.54),
            Math.floor(W * 0.58),
        ];

        // Para cada fila: promedio de alpha en las columnas centrales
        function avgAlpha(y) {
            let sum = 0;
            for (const x of cols) sum += data[(y * W + x) * 4 + 3];
            return sum / cols.length;
        }

        // Zona lateral (hombros): 15-30% y 70-85% del ancho
        const leftCols  = Array.from({length: 20}, (_, i) => Math.floor(W * 0.15) + i * 5);
        const rightCols = Array.from({length: 20}, (_, i) => Math.floor(W * 0.70) + i * 5);

        function shoulderAlpha(y) {
            let sum = 0;
            for (const x of [...leftCols, ...rightCols]) sum += data[(y * W + x) * 4 + 3];
            return sum / (leftCols.length + rightCols.length);
        }

        // Paso 1: encontrar la primera fila donde los hombros aparecen
        let shoulderY = null;
        for (let y = 0; y < H * 0.5; y++) {
            if (shoulderAlpha(y) > 40) { shoulderY = y; break; }
        }

        if (shoulderY === null) {
            // Fallback total: primer pixel opaco en zona central
            for (let y = 0; y < H * 0.6; y++) {
                if (avgAlpha(y) > 30) {
                    console.log('[ShirtAlign] Fallback cuello Y=' + y);
                    return y;
                }
            }
            return null;
        }

        console.log('[ShirtAlign] Hombros en Y=' + shoulderY);

        // Paso 2: desde los hombros, buscar la abertura del cuello
        // (zona donde el centro se vuelve transparente)
        let neckOpenY = null;
        for (let y = shoulderY; y < shoulderY + H * 0.15; y++) {
            if (avgAlpha(y) < 20) { neckOpenY = y; break; }
        }

        if (neckOpenY === null) {
            // No hay abertura clara (remera cerrada o imagen rara)
            // Usar shoulderY + offset estimado
            const est = shoulderY + Math.floor(H * 0.04);
            console.log('[ShirtAlign] Sin abertura, cuello estimado Y=' + est);
            return est;
        }

        console.log('[ShirtAlign] Abertura cuello en Y=' + neckOpenY);

        // Paso 3: desde la abertura, buscar dónde el centro vuelve a ser opaco
        // Ese es el fondo del cuello (donde empieza la tela del torso)
        for (let y = neckOpenY; y < H * 0.7; y++) {
            if (avgAlpha(y) > 40) {
                console.log('[ShirtAlign] ✓ Fondo cuello remera Y=' + y);
                return y;
            }
        }

        // Si nunca volvió a ser opaco, usar neckOpenY como referencia
        console.log('[ShirtAlign] Fondo cuello no encontrado, usando abertura Y=' + neckOpenY);
        return neckOpenY;
    }

    // ── 2. Detectar cara con face-api.js ─────────────────────────
    async function detectFaceData(photoImg) {
        const ok = await ensureLoaded();
        if (!ok) return null;

        const tc  = document.createElement('canvas');
        tc.width  = photoImg.naturalWidth  || photoImg.width;
        tc.height = photoImg.naturalHeight || photoImg.height;
        tc.getContext('2d').drawImage(photoImg, 0, 0);

        console.log('[ShirtAlign] Detectando cara en ' + tc.width + 'x' + tc.height);

        const options = new faceapi.TinyFaceDetectorOptions({
            inputSize: 512,
            scoreThreshold: 0.35,
        });

        const result = await faceapi
            .detectSingleFace(tc, options)
            .withFaceLandmarks(true);

        if (!result) {
            console.warn('[ShirtAlign] No se detectó cara');
            return null;
        }

        const box = result.detection.box;
        const pts = result.landmarks.positions;

        // Puntos 6-10: mandíbula inferior central (los más bajos de la cara)
        const jawBottom = pts.slice(6, 11);
        const avgJawY   = jawBottom.reduce((s, p) => s + p.y, 0) / jawBottom.length;

        // Cuello = mandíbula inferior + 12% de la altura del bounding box
        // (ajustado para ser más conservador — no bajar demasiado)
        const neckY   = avgJawY + box.height * 0.12;

        // Centro horizontal: promedio de los 17 puntos del contorno mandíbula
        const centerX = pts.slice(0, 17).reduce((s, p) => s + p.x, 0) / 17;

        console.log('[ShirtAlign] Cara h=' + Math.round(box.height) +
            ' jawY=' + Math.round(avgJawY) +
            ' neckY=' + Math.round(neckY) +
            ' centerX=' + Math.round(centerX));

        return { faceHeight: box.height, neckY, centerX };
    }

    // ── 3. Calcular y aplicar alineación ─────────────────────────
    async function align(photoImg, shirtImg, state, onUpdate) {
        if (!photoImg || !shirtImg) return;
        console.log('[ShirtAlign] Iniciando alineación...');

        const shirtNeckY = detectShirtNeckY(shirtImg);
        if (shirtNeckY === null) return;

        const face = await detectFaceData(photoImg);
        if (!face) return;

        const photoW = photoImg.naturalWidth || photoImg.width;

        // Escala: cara ocupa ~22% del alto del canvas
        // (ajustable — más % = más zoom)
        const targetFaceRatio = 0.22;
        const newPhotoScale   = Math.min(Math.max((H * targetFaceRatio / face.faceHeight) * 40, 40), 500);
        const sc              = newPhotoScale / 40;

        // Y: cuello persona → cuello remera
        // photoY + face.neckY * sc = shirtNeckY
        const newPhotoY = shirtNeckY - face.neckY * sc;

        // X: centrar cara horizontalmente en el canvas
        // La foto se dibuja en x = (W - pw)/2 + photoX
        // Queremos que face.centerX * sc quede en W/2
        const pw        = photoW * sc;
        const newPhotoX = (W / 2) - (W - pw) / 2 - face.centerX * sc;

        state.photoScale = newPhotoScale;
        state.photoY     = newPhotoY;
        state.photoX     = newPhotoX;
        state.shirtY     = 0;

        _sync('sScale', 'vScale', newPhotoScale, '%');
        _sync('sY',     'vY',     newPhotoY,     '');
        _sync('sX',     'vX',     newPhotoX,     '');
        _sync('sShirtY','vShirtY', 0,            '');

        onUpdate('draw');

        console.log('[ShirtAlign] ✓ scale=' + Math.round(newPhotoScale) +
            ' Y=' + Math.round(newPhotoY) + ' X=' + Math.round(newPhotoX));
    }

    function _sync(sliderId, valId, value, suffix) {
        const sl = document.getElementById(sliderId);
        const vl = document.getElementById(valId);
        const v  = Math.round(value);
        if (sl) sl.value       = v;
        if (vl) vl.textContent = v + (suffix || '');
    }

    return { align, detectShirtNeckY };
})();
