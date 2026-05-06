'use strict';

// ─────────────────────────────────────────────────────────────
//  SHIRT ALIGN v3
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
            console.log('[ShirtAlign] Modelos cargados');
        } catch (err) {
            console.error('[ShirtAlign] Error cargando modelos:', err);
        }
        _loading = false;
        return _ready;
    }

    ensureLoaded();

    // ── 1. Detectar cuello de la remera ──────────────────────
    // Estrategia: buscar la abertura del cuello
    // El cuello de una remera es una zona transparente en el centro
    // rodeada de tela opaca arriba (hombros) y abajo (cuerpo).
    // Algoritmo:
    //   1. Encontrar la primera fila con hombros (pixels opacos en los bordes
    //      pero transparente en el centro)
    //   2. Desde ahí bajar hasta que el centro se vuelva opaco → ese es el
    //      fondo del cuello (donde empieza la tela del cuerpo)
    function detectShirtNeckY(shirtImg) {
        const oc = document.createElement('canvas');
        oc.width  = W;
        oc.height = H;
        oc.getContext('2d').drawImage(shirtImg, 0, 0, W, H);
        const data = oc.getContext('2d').getImageData(0, 0, W, H).data;

        // Zonas para medir
        const centerXMin = Math.floor(W * 0.38);
        const centerXMax = Math.floor(W * 0.62);
        const centerW    = centerXMax - centerXMin;

        const shoulderXL = Math.floor(W * 0.15);
        const shoulderXR = Math.floor(W * 0.85);
        const shoulderW  = 80; // px a medir en cada hombro

        function centerOpacity(y) {
            let sum = 0;
            for (let x = centerXMin; x < centerXMax; x++)
                sum += data[(y * W + x) * 4 + 3];
            return sum / centerW; // promedio alpha 0-255
        }

        function shoulderOpacity(y) {
            let sum = 0;
            for (let x = shoulderXL; x < shoulderXL + shoulderW; x++)
                sum += data[(y * W + x) * 4 + 3];
            for (let x = shoulderXR - shoulderW; x < shoulderXR; x++)
                sum += data[(y * W + x) * 4 + 3];
            return sum / (shoulderW * 2);
        }

        // Paso 1: encontrar la fila donde aparecen los hombros
        // (shoulders opacos > 60, centro todavía puede ser transparente)
        let shoulderStartY = null;
        for (let y = 0; y < H * 0.6; y++) {
            if (shoulderOpacity(y) > 60) {
                shoulderStartY = y;
                break;
            }
        }

        if (shoulderStartY === null) {
            // Fallback: primer pixel opaco en zona central
            console.warn('[ShirtAlign] No se detectaron hombros, usando fallback');
            for (let y = 0; y < H; y++) {
                if (centerOpacity(y) > 30) {
                    console.log('[ShirtAlign] Fallback cuello Y=' + y);
                    return y;
                }
            }
            return null;
        }

        console.log('[ShirtAlign] Hombros detectados en Y=' + shoulderStartY);

        // Paso 2: desde shoulderStartY, bajar buscando dónde el centro
        // se vuelve opaco (= fondo del cuello / inicio del cuerpo de la remera)
        // El cuello real es ese punto.
        for (let y = shoulderStartY; y < H * 0.7; y++) {
            if (centerOpacity(y) > 60) {
                console.log('[ShirtAlign] Fondo cuello remera en Y=' + y);
                return y;
            }
        }

        // Si no encontró transición (remera sin cuello visible o modelo raro),
        // usar shoulderStartY + 15% de la altura como estimación
        const fallback = shoulderStartY + Math.floor(H * 0.05);
        console.log('[ShirtAlign] Cuello estimado (fallback) Y=' + fallback);
        return fallback;
    }

    // ── 2. Detectar cara con face-api.js ─────────────────────
    async function detectFaceData(photoImg) {
        const ok = await ensureLoaded();
        if (!ok) return null;

        const tc  = document.createElement('canvas');
        tc.width  = photoImg.naturalWidth  || photoImg.width;
        tc.height = photoImg.naturalHeight || photoImg.height;
        tc.getContext('2d').drawImage(photoImg, 0, 0);

        console.log('[ShirtAlign] Detectando cara en ' + tc.width + 'x' + tc.height);

        const options = new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.4,
        });

        const result = await faceapi
            .detectSingleFace(tc, options)
            .withFaceLandmarks(true);

        if (!result) {
            console.warn('[ShirtAlign] No se detectó cara');
            return null;
        }

        const box       = result.detection.box;
        const pts       = result.landmarks.positions;

        // Landmarks 0-16 = contorno mandíbula
        // Usamos puntos 5-11 (mandíbula inferior central) para el cuello
        const jawLow    = pts.slice(5, 12);
        const avgJawY   = jawLow.reduce((s, p) => s + p.y, 0) / jawLow.length;

        // Cuello = mandíbula baja + 15% de la altura de la cara
        const neckY     = avgJawY + box.height * 0.15;

        // Centro X de la mandíbula (más estable que el bounding box)
        const centerX   = pts.slice(0, 17).reduce((s, p) => s + p.x, 0) / 17;

        console.log('[ShirtAlign] Cara h=' + Math.round(box.height) +
            ' jawY=' + Math.round(avgJawY) +
            ' neckY=' + Math.round(neckY) +
            ' centerX=' + Math.round(centerX));

        return { faceHeight: box.height, neckY, centerX };
    }

    // ── 3. Alinear ────────────────────────────────────────────
    async function align(photoImg, shirtImg, state, onUpdate) {
        if (!photoImg || !shirtImg) return;
        console.log('[ShirtAlign] Iniciando...');

        const shirtNeckY = detectShirtNeckY(shirtImg);
        if (shirtNeckY === null) return;

        const face = await detectFaceData(photoImg);
        if (!face) return;

        const photoW = photoImg.naturalWidth  || photoImg.width;

        // Escala: cara = 24% del alto del canvas
        const newPhotoScale = Math.min(Math.max((H * 0.24 / face.faceHeight) * 40, 40), 500);
        const sc            = newPhotoScale / 40;

        // Y: cuello persona coincide con cuello remera
        const newPhotoY = shirtNeckY - face.neckY * sc;

        // X: cara centrada horizontalmente
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

        console.log('[ShirtAlign] Aplicado — scale=' + Math.round(newPhotoScale) +
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
