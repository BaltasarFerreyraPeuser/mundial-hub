'use strict';

// ─────────────────────────────────────────────────────────────
//  SHIRT ALIGN — alineación automática remera ↔ cuello persona
//  Solo activo en edition-2026 cuando showShirt = true
//  Requiere Chrome con FaceDetector habilitado
//
//  Si FaceDetector no funciona, activarlo en Chrome:
//  chrome://flags → "Experimental Web Platform features" → Enable
// ─────────────────────────────────────────────────────────────

const ShirtAlign = (() => {

    const W = 1650, H = 2310;

    // ── Diagnóstico al cargar ─────────────────────────────────
    if (!('FaceDetector' in window)) {
        console.warn(
            '[ShirtAlign] FaceDetector NO disponible.\n' +
            'Activar en Chrome: chrome://flags → Experimental Web Platform features → Enable'
        );
    } else {
        console.log('[ShirtAlign] FaceDetector disponible');
    }

    // ── 1. Detectar cuello de la remera ──────────────────────
    function detectShirtNeckY(shirtImg) {
        const oc = document.createElement('canvas');
        oc.width  = W;
        oc.height = H;
        const ox  = oc.getContext('2d');
        ox.drawImage(shirtImg, 0, 0, W, H);

        const data = ox.getImageData(0, 0, W, H).data;
        const xMin = Math.floor(W * 0.30);
        const xMax = Math.floor(W * 0.70);

        for (let y = 0; y < H; y++) {
            let count = 0;
            for (let x = xMin; x < xMax; x++) {
                if (data[(y * W + x) * 4 + 3] > 30) count++;
            }
            if (count >= 10) {
                console.log('[ShirtAlign] Cuello remera Y=' + y);
                return y;
            }
        }
        console.warn('[ShirtAlign] No se encontro cuello en la remera');
        return null;
    }

    // ── 2. Detectar cara ─────────────────────────────────────
    async function detectFace(photoImg) {
        if (!('FaceDetector' in window)) return null;

        const detector = new FaceDetector({ fastMode: false, maxDetectedFaces: 1 });

        const tc  = document.createElement('canvas');
        tc.width  = photoImg.naturalWidth  || photoImg.width;
        tc.height = photoImg.naturalHeight || photoImg.height;
        tc.getContext('2d').drawImage(photoImg, 0, 0);

        console.log('[ShirtAlign] Detectando cara en ' + tc.width + 'x' + tc.height);

        let faces;
        try {
            faces = await detector.detect(tc);
        } catch (err) {
            console.error('[ShirtAlign] Error FaceDetector:', err);
            return null;
        }

        if (!faces || faces.length === 0) {
            console.warn('[ShirtAlign] Sin cara detectada');
            return null;
        }

        const face = faces[0].boundingBox;
        console.log('[ShirtAlign] Cara: top=' + Math.round(face.top) + ' h=' + Math.round(face.height));

        return {
            top:     face.top,
            left:    face.left,
            width:   face.width,
            height:  face.height,
            centerX: face.left + face.width  / 2,
            neckY:   face.top  + face.height * 1.30,
        };
    }

    // ── 3. Calcular y aplicar ─────────────────────────────────
    async function align(photoImg, shirtImg, state, onUpdate) {
        if (!photoImg || !shirtImg) return;

        console.log('[ShirtAlign] Iniciando alineacion...');

        const shirtNeckY = detectShirtNeckY(shirtImg);
        if (shirtNeckY === null) return;

        const face = await detectFace(photoImg);
        if (!face) return;

        const targetFaceH   = H * 0.22;
        const scaleFromFace = targetFaceH / face.height;
        const newPhotoScale = Math.min(Math.max(scaleFromFace * 40, 40), 400);
        const actualScale   = newPhotoScale / 40;

        const newPhotoY = shirtNeckY - face.neckY * actualScale;
        const newPhotoX = (W / 2) - face.centerX * actualScale;

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
            ' photoY=' + Math.round(newPhotoY) + ' photoX=' + Math.round(newPhotoX));
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
