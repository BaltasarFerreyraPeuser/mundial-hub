'use strict';

// ─────────────────────────────────────────────────────────────
//  SHIRT ALIGN v2 — face-api.js + landmarks
//  Detecta 68 puntos faciales, usa la mandíbula inferior
//  para calcular el cuello con precisión
//  CDN: face-api.js cargado desde jsDelivr
// ─────────────────────────────────────────────────────────────

const ShirtAlign = (() => {

    const W = 1650, H = 2310;
    const MODELS_URL = '/frontend/assets/face-models';
    let _ready = false;
    let _loading = false;

    // ── 1. Cargar modelos (lazy, solo la primera vez) ─────────
    async function ensureLoaded() {
        if (_ready) return true;
        if (_loading) {
            // Esperar a que termine la carga en curso
            while (_loading) await new Promise(r => setTimeout(r, 50));
            return _ready;
        }

        if (typeof faceapi === 'undefined') {
            console.error('[ShirtAlign] face-api.js no está cargado. Agregá el script en index.html');
            return false;
        }

        _loading = true;
        console.log('[ShirtAlign] Cargando modelos...');

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

    // Precarga en background cuando el script se inicializa
    ensureLoaded();

    // ── 2. Detectar cuello de la remera ──────────────────────
    // Escanea el PNG (fondo transparente) y encuentra la fila
    // más alta con pixels opacos en la zona central (35-65% X)
    function detectShirtNeckY(shirtImg) {
        const oc = document.createElement('canvas');
        oc.width  = W;
        oc.height = H;
        oc.getContext('2d').drawImage(shirtImg, 0, 0, W, H);

        const data = oc.getContext('2d').getImageData(0, 0, W, H).data;
        const xMin = Math.floor(W * 0.35);
        const xMax = Math.floor(W * 0.65);

        for (let y = 0; y < H; y++) {
            let count = 0;
            for (let x = xMin; x < xMax; x++) {
                if (data[(y * W + x) * 4 + 3] > 40) count++;
            }
            if (count >= 8) {
                console.log('[ShirtAlign] Cuello remera en Y=' + y);
                return y;
            }
        }
        console.warn('[ShirtAlign] No se detectó cuello en la remera');
        return null;
    }

    // ── 3. Detectar cara y landmarks con face-api.js ─────────
    async function detectFaceData(photoImg) {
        const ok = await ensureLoaded();
        if (!ok) return null;

        // Canvas temporal con la foto original
        const tc  = document.createElement('canvas');
        tc.width  = photoImg.naturalWidth  || photoImg.width;
        tc.height = photoImg.naturalHeight || photoImg.height;
        tc.getContext('2d').drawImage(photoImg, 0, 0);

        console.log('[ShirtAlign] Detectando cara en ' + tc.width + 'x' + tc.height + '...');

        const options = new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.4,
        });

        const result = await faceapi
            .detectSingleFace(tc, options)
            .withFaceLandmarks(true); // true = usa el modelo tiny

        if (!result) {
            console.warn('[ShirtAlign] No se detectó ninguna cara');
            return null;
        }

        const box       = result.detection.box;
        const landmarks = result.landmarks.positions; // array de 68 {x, y}

        // Landmarks útiles:
        // 0-16  = contorno mandíbula (0=izq, 8=mentón, 16=der)
        // 17-21 = ceja izquierda
        // 27    = puente nariz
        // Cuello = promedio de los puntos de mandíbula bajos (4-12)
        //          más un offset hacia abajo
        const jawPoints = landmarks.slice(4, 13); // puntos 4 a 12
        const avgJawY   = jawPoints.reduce((s, p) => s + p.y, 0) / jawPoints.length;
        const jawHeight = box.height * 0.18; // offset cuello ≈ 18% altura cara

        const neckY     = avgJawY + jawHeight;
        const centerX   = landmarks.slice(0, 17)
                            .reduce((s, p) => s + p.x, 0) / 17; // centro mandíbula

        console.log('[ShirtAlign] Cara: box.h=' + Math.round(box.height) +
            ' jawAvgY=' + Math.round(avgJawY) +
            ' neckY=' + Math.round(neckY));

        return {
            faceHeight: box.height,
            faceTop:    box.top,
            neckY,
            centerX,
        };
    }

    // ── 4. Calcular y aplicar el ajuste ──────────────────────
    async function align(photoImg, shirtImg, state, onUpdate) {
        if (!photoImg || !shirtImg) return;

        console.log('[ShirtAlign] Iniciando alineación...');

        // a) Cuello de la remera en coords del canvas (0..H)
        const shirtNeckY = detectShirtNeckY(shirtImg);
        if (shirtNeckY === null) return;

        // b) Cara y cuello de la persona en coords de la foto original
        const face = await detectFaceData(photoImg);
        if (!face) return;

        const photoW = photoImg.naturalWidth  || photoImg.width;
        const photoH = photoImg.naturalHeight || photoImg.height;

        // c) Escala: cara ocupa ~24% del alto del canvas
        const targetFaceH   = H * 0.24;
        const scaleFromFace = targetFaceH / face.faceHeight;
        // En draw(): sc = photoScale / 40
        const newPhotoScale = Math.min(Math.max(scaleFromFace * 40, 40), 500);
        const actualScale   = newPhotoScale / 40;

        // d) Posición Y:
        //    En el canvas, el cuello de la persona queda en:
        //    photoY + face.neckY * actualScale = shirtNeckY
        //    → photoY = shirtNeckY - face.neckY * actualScale
        const newPhotoY = shirtNeckY - face.neckY * actualScale;

        // e) Centrado horizontal
        //    En draw(): x_canvas = (W - pw)/2 + photoX + face.centerX * actualScale
        //    Queremos que centerX de la cara quede en W/2
        //    (W - pw)/2 + photoX + face.centerX * actualScale = W/2
        //    photoX = W/2 - (W - pw)/2 - face.centerX * actualScale
        const pw      = photoW * actualScale;
        const newPhotoX = (W / 2) - (W - pw) / 2 - face.centerX * actualScale;

        // f) Aplicar
        state.photoScale = newPhotoScale;
        state.photoY     = newPhotoY;
        state.photoX     = newPhotoX;
        state.shirtY     = 0;

        // g) Sincronizar sliders UI
        _sync('sScale', 'vScale', newPhotoScale, '%');
        _sync('sY',     'vY',     newPhotoY,     '');
        _sync('sX',     'vX',     newPhotoX,     '');
        _sync('sShirtY','vShirtY', 0,            '');

        onUpdate('draw');

        console.log('[ShirtAlign] ✓ Aplicado — scale=' + Math.round(newPhotoScale) +
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
