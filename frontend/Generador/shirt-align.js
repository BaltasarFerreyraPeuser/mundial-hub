'use strict';

// ─────────────────────────────────────────────────────────────
//  SHIRT ALIGN — alineación automática remera ↔ cuello persona
//  Solo activo en edition-2026 cuando showShirt = true
//  Requiere Chrome (usa FaceDetector API nativa)
// ─────────────────────────────────────────────────────────────

const ShirtAlign = (() => {

    const W = 1650, H = 2310;

    // ── 1. Detectar cuello de la remera ──────────────────────────
    // Escanea el PNG de la remera (con alpha) y encuentra el punto
    // más alto con pixels no-transparentes en la zona central (30-70% X)
    // Devuelve Y en coordenadas del canvas (0..H)
    function detectShirtNeckY(shirtImg) {
        const oc = document.createElement('canvas');
        oc.width  = W;
        oc.height = H;
        const ox = oc.getContext('2d');
        ox.drawImage(shirtImg, 0, 0, W, H);

        const data = ox.getImageData(0, 0, W, H).data;
        const xMin = Math.floor(W * 0.30);
        const xMax = Math.floor(W * 0.70);

        // Buscar fila más alta con al menos 10px opacos en la zona central
        for (let y = 0; y < H; y++) {
            let opaqueCount = 0;
            for (let x = xMin; x < xMax; x++) {
                const a = data[(y * W + x) * 4 + 3];
                if (a > 30) opaqueCount++;
            }
            if (opaqueCount >= 10) return y;
        }
        return null;
    }

    // ── 2. Detectar cuello de la persona via FaceDetector ────────
    // Devuelve Promise<{neckY, faceH, faceCenterX}> en coords de la foto original
    async function detectPersonNeck(photoImg) {
        if (!('FaceDetector' in window)) {
            console.warn('[ShirtAlign] FaceDetector no disponible en este browser');
            return null;
        }

        const detector = new FaceDetector({ fastMode: true, maxDetectedFaces: 1 });

        // Dibujamos la foto en un canvas temporal para pasárselo al detector
        const tc = document.createElement('canvas');
        tc.width  = photoImg.width;
        tc.height = photoImg.height;
        const tx  = tc.getContext('2d');
        tx.drawImage(photoImg, 0, 0);

        let faces;
        try {
            faces = await detector.detect(tc);
        } catch (e) {
            console.warn('[ShirtAlign] Error en FaceDetector:', e);
            return null;
        }

        if (!faces || faces.length === 0) {
            console.warn('[ShirtAlign] No se detectó ninguna cara');
            return null;
        }

        const face = faces[0].boundingBox;
        // El cuello está aproximadamente 1.3x la altura de la cara hacia abajo
        // desde la parte inferior de la cara detectada
        const neckY       = face.top + face.height * 1.35;
        const faceCenterX = face.left + face.width / 2;
        const faceH       = face.height;

        return { neckY, faceH, faceCenterX, faceTop: face.top };
    }

    // ── 3. Calcular y aplicar el ajuste ──────────────────────────
    // Modifica state.photoScale, state.photoY, state.photoX y state.shirtY
    async function align(photoImg, shirtImg, state, onUpdate) {
        if (!photoImg || !shirtImg) return;

        // a) Detectar cuello de la remera en coords del canvas
        const shirtNeckY = detectShirtNeckY(shirtImg);
        if (shirtNeckY === null) {
            console.warn('[ShirtAlign] No se pudo detectar el cuello de la remera');
            return;
        }

        // b) Detectar cara/cuello de la persona en coords de la foto
        const person = await detectPersonNeck(photoImg);
        if (!person) return;

        // c) Calcular escala óptima
        // Queremos que la cara ocupe ~25% de la altura del canvas
        // para que la persona y la remera queden bien proporcionadas
        const targetFaceH   = H * 0.22;
        const scaleFromFace = targetFaceH / person.faceH;

        // La escala en el draw() es: photoScale / 40
        // Entonces: photoScale = scaleFromFace * 40
        const newPhotoScale = Math.min(Math.max(scaleFromFace * 40, 40), 300);
        const actualScale   = newPhotoScale / 40;

        // d) Calcular posición Y de la foto para que el cuello de la persona
        //    coincida con el cuello de la remera (shirtNeckY)
        //    En el draw(): photo se dibuja en y = state.photoY
        //    La posición del cuello de la persona en el canvas es:
        //    photoY + person.neckY * actualScale
        //    Queremos que eso sea igual a shirtNeckY + state.shirtY
        //    → photoY = shirtNeckY + shirtY - person.neckY * actualScale
        const scaledNeckY  = person.neckY * actualScale;
        const newPhotoY    = shirtNeckY - scaledNeckY;

        // e) Centrar horizontalmente la cara respecto al canvas
        const scaledFaceCX = person.faceCenterX * actualScale;
        const newPhotoX    = (W / 2) - scaledFaceCX;

        // f) Aplicar — shirtY se resetea a 0 (la remera en posición base)
        state.photoScale = newPhotoScale;
        state.photoY     = newPhotoY;
        state.photoX     = newPhotoX;
        state.shirtY     = 0;

        // Actualizar sliders de la UI si existen
        _syncSlider('sScale', 'vScale', newPhotoScale, '%');
        _syncSlider('sY',     'vY',     newPhotoY,     '');
        _syncSlider('sX',     'vX',     newPhotoX,     '');

        onUpdate('draw');

        console.log('[ShirtAlign] ✓ Alineado:', {
            shirtNeckY,
            personNeckY: person.neckY,
            scale: actualScale.toFixed(2),
            photoY: Math.round(newPhotoY),
            photoX: Math.round(newPhotoX),
        });
    }

    function _syncSlider(sliderId, valId, value, suffix) {
        const sl = document.getElementById(sliderId);
        const vl = document.getElementById(valId);
        if (sl) sl.value = Math.round(value);
        if (vl) vl.textContent = Math.round(value) + (suffix || '');
    }

    // ── 4. API pública ───────────────────────────────────────────
    return { align, detectShirtNeckY };
})();


// ─────────────────────────────────────────────────────────────
//  PATCH de editor.js — intercepta la carga de foto y
//  ejecuta el align automáticamente si la edición es 2026
//  y showShirt está activado
// ─────────────────────────────────────────────────────────────
(function patchPhotoLoader() {
    function tryPatch() {
        const input = document.getElementById('photoInputDirect');
        if (!input || typeof activeEdition === 'undefined') {
            setTimeout(tryPatch, 100);
            return;
        }

        // Agregamos un listener adicional (no reemplazamos el original)
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Solo actuar en edition-2026 con remera activa
            if (activeEdition.id !== 'edition-2026') return;
            if (!state.showShirt) return;
            if (!imgs['shirt']) return;

            // Esperar a que la foto esté cargada (el handler original la carga)
            // Damos un pequeño delay para que photo quede asignado
            await new Promise(r => setTimeout(r, 200));

            if (!photo) return;

            await ShirtAlign.align(photo, imgs['shirt'], state, onUpdate);
        });

        console.log('[ShirtAlign] ✓ Patch aplicado al photo loader');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryPatch);
    } else {
        tryPatch();
    }
})();
