'use strict';

// ─────────────────────────────────────────────────────────────
//  SHIRT ALIGN v5
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

    ensureLoaded();

    // ── 1. Detectar cuello de la remera ──────────────────────────
    // Dibuja el shirtImg en canvas propio con alpha=true
    // Genera un perfil de alpha promedio por fila en zona central
    // Busca el primer máximo local (hombros/tela) seguido de un mínimo
    // (abertura del cuello) seguido de otro máximo (torso) → ese 2do máximo = cuello
    function detectShirtNeckY(shirtImg) {
        // Canvas EXPLÍCITAMENTE con alpha habilitado
        const oc  = document.createElement('canvas');
        oc.width  = W;
        oc.height = H;
        const octx = oc.getContext('2d', { alpha: true, willReadFrequently: true });
        octx.clearRect(0, 0, W, H);
        octx.drawImage(shirtImg, 0, 0, W, H);

        const imgData = octx.getImageData(0, 0, W, H);
        const data    = imgData.data;

        // Columnas a muestrear (zona central 40-60%)
        const xSamples = [];
        for (let pct = 0.40; pct <= 0.60; pct += 0.02)
            xSamples.push(Math.floor(W * pct));

        // Promedio de alpha por fila
        const alphaProfile = new Float32Array(H);
        for (let y = 0; y < H; y++) {
            let sum = 0;
            for (const x of xSamples) sum += data[(y * W + x) * 4 + 3];
            alphaProfile[y] = sum / xSamples.length;
        }

        // Suavizar el perfil (ventana 5px) para evitar ruido
        const smoothed = new Float32Array(H);
        const win = 5;
        for (let y = 0; y < H; y++) {
            let s = 0, cnt = 0;
            for (let k = -win; k <= win; k++) {
                const yk = y + k;
                if (yk >= 0 && yk < H) { s += alphaProfile[yk]; cnt++; }
            }
            smoothed[y] = s / cnt;
        }

        // Debug: loguear el perfil cada 50px para entender la forma
        for (let y = 0; y < H * 0.6; y += 50)
            console.log('[ShirtAlign] profile Y=' + y + ' alpha=' + Math.round(smoothed[y]));

        // Buscar patrón: subida (hombros) → bajada (abertura cuello) → subida (torso)
        // Primero: encontrar dónde empieza la primera zona opaca (alpha > 30)
        let firstOpaqueY = null;
        for (let y = 0; y < H * 0.6; y++) {
            if (smoothed[y] > 30) { firstOpaqueY = y; break; }
        }
        if (firstOpaqueY === null) {
            console.warn('[ShirtAlign] Remera completamente transparente en zona central');
            return null;
        }
        console.log('[ShirtAlign] Primera zona opaca Y=' + firstOpaqueY);

        // Desde firstOpaqueY, buscar el mínimo local (abertura del cuello)
        // Un mínimo local = cuando alpha baja < 50 después de haber sido > 80
        let wasOpaque = false;
        let valleyStart = null;
        for (let y = firstOpaqueY; y < H * 0.65; y++) {
            if (smoothed[y] > 80) wasOpaque = true;
            if (wasOpaque && smoothed[y] < 50 && valleyStart === null) {
                valleyStart = y;
            }
            // Una vez en el valle, buscar cuándo sube de nuevo (= fondo del cuello)
            if (valleyStart !== null && smoothed[y] > 60 && y > valleyStart + 3) {
                console.log('[ShirtAlign] ✓ Fondo cuello Y=' + y +
                    ' (valle desde Y=' + valleyStart + ')');
                return y;
            }
        }

        // Si no encontró valle → remera sin cuello visible (polo cerrado, etc.)
        // Usar firstOpaqueY + offset empírico del 8% del canvas
        const fallback = firstOpaqueY + Math.floor(H * 0.08);
        console.log('[ShirtAlign] Sin valle, fallback cuello Y=' + fallback);
        return fallback;
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

        // Puntos 6-10: mandíbula inferior central
        const jawBottom = pts.slice(6, 11);
        const avgJawY   = jawBottom.reduce((s, p) => s + p.y, 0) / jawBottom.length;

        // Cuello = mandíbula inferior + 10% de la altura del bbox
        const neckY   = avgJawY + box.height * 0.10;
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

        // Escala: cara ocupa ~24% del alto del canvas
        const newPhotoScale = Math.min(Math.max((H * 0.24 / face.faceHeight) * 40, 40), 500);
        const sc            = newPhotoScale / 40;

        // Y: cuello persona → cuello remera
        const newPhotoY = shirtNeckY - face.neckY * sc;

        // X: centrar cara horizontalmente
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
