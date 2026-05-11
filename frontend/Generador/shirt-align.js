'use strict';

// ─────────────────────────────────────────────────────────────
//  SHIRT ALIGN v8
//
//  Estrategia unificada:
//  · La CABEZA siempre ancla en Y=85 del canvas (target_y0).
//  · La cara se escala para que ocupe el 31.8% del canvas (≈735px),
//    lo que hace que la persona completa encaje en Y=85..1860.
//  · La cara se centra horizontalmente en X=825 (W/2).
//  · Si hay remera visible, se calcula shirtY para que el cuello
//    de la remera coincida exactamente con el cuello de la persona.
// ─────────────────────────────────────────────────────────────

const ShirtAlign = (() => {

    const W = 1650, H = 2310;

    // Target: la persona encaja en esta zona del canvas
    const TARGET_Y_TOP = 85;    // top de la cabeza
    const TARGET_FACE_PCT = 0.318; // cara = 31.8% del alto del canvas (≈735px)

    const MODELS_URL = '/frontend/assets/face-models';
    let _ready   = false;
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
    //
    // "Pixel de remera" = luminosidad > 25 (distingue fondo negro opaco de tela).
    // Zona ANCHA  (20-80%): detecta el inicio de los hombros.
    // Zona ESTRECHA (44-56%): detecta el fondo del agujero del cuello.
    // Devuelve el centro entre collar_top y neck_bottom.
    //
    function detectShirtNeckY(shirtImg) {
        const oc   = document.createElement('canvas');
        oc.width   = W;
        oc.height  = H;
        const octx = oc.getContext('2d', { alpha: true, willReadFrequently: true });
        octx.clearRect(0, 0, W, H);
        octx.drawImage(shirtImg, 0, 0, W, H);

        const { data } = octx.getImageData(0, 0, W, H);

        function isShirtPx(idx) {
            const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
            return (0.299 * r + 0.587 * g + 0.114 * b) > 25 || a > 25;
        }

        const WIN = 15;
        function buildProfile(x0f, x1f) {
            const x0 = Math.floor(W * x0f), x1 = Math.floor(W * x1f);
            const cols = x1 - x0;
            const raw = new Float32Array(H);
            for (let y = 0; y < H; y++) {
                let cnt = 0;
                for (let x = x0; x < x1; x++) if (isShirtPx((y * W + x) * 4)) cnt++;
                raw[y] = cnt / cols;
            }
            const sm = new Float32Array(H);
            for (let y = 0; y < H; y++) {
                let s = 0, n = 0;
                for (let k = -WIN; k <= WIN; k++) {
                    const yk = y + k;
                    if (yk >= 0 && yk < H) { s += raw[yk]; n++; }
                }
                sm[y] = s / n;
            }
            return sm;
        }

        const wide   = buildProfile(0.20, 0.80);
        const narrow = buildProfile(0.44, 0.56);

        let shoulderY = null;
        for (let y = 0; y < H * 0.8; y++) {
            if (wide[y] > 0.05) { shoulderY = y; break; }
        }
        if (shoulderY === null) {
            console.warn('[ShirtAlign] No se detectaron hombros');
            return null;
        }

        let collarTop  = null;
        for (let y = shoulderY; y < H * 0.75; y++) {
            if (narrow[y] > 0.03) { collarTop = y; break; }
        }

        let neckBottom = null;
        for (let y = shoulderY; y < H * 0.75; y++) {
            if (narrow[y] > 0.20) { neckBottom = y; break; }
        }

        if (neckBottom === null) {
            neckBottom = shoulderY + Math.floor(H * 0.12);
            collarTop  = neckBottom - Math.floor(H * 0.03);
        }
        collarTop = collarTop || neckBottom;

        const shirtNeckY = Math.round((collarTop + neckBottom) / 2);
        console.log('[ShirtAlign] shirtNeckY=' + shirtNeckY +
            ' (collar=' + collarTop + ' bottom=' + neckBottom + ')');
        return shirtNeckY;
    }

    // ── 2. Detectar cara ─────────────────────────────────────────
    async function detectFaceData(photoImg) {
        const ok = await ensureLoaded();
        if (!ok) return null;

        const tc  = document.createElement('canvas');
        tc.width  = photoImg.naturalWidth  || photoImg.width;
        tc.height = photoImg.naturalHeight || photoImg.height;
        tc.getContext('2d').drawImage(photoImg, 0, 0);

        console.log('[ShirtAlign] Detectando cara en ' + tc.width + 'x' + tc.height);

        const result = await faceapi
            .detectSingleFace(tc, new faceapi.TinyFaceDetectorOptions({
                inputSize: 512,
                scoreThreshold: 0.35,
            }))
            .withFaceLandmarks(true);

        if (!result) {
            console.warn('[ShirtAlign] No se detectó cara');
            return null;
        }

        const box = result.detection.box;
        const pts = result.landmarks.positions;

        // pts[8] = mentón central (el más bajo del contorno facial)
        const chinY   = pts[8].y;
        // neckY = mentón + 20% del alto del bbox
        const neckY   = chinY + box.height * 0.20;
        // centerX = promedio horizontal del contorno facial (17 puntos)
        const centerX = pts.slice(0, 17).reduce((s, p) => s + p.x, 0) / 17;

        console.log('[ShirtAlign] h=' + Math.round(box.height) +
            ' boxY=' + Math.round(box.y) +
            ' chinY=' + Math.round(chinY) +
            ' neckY=' + Math.round(neckY) +
            ' cx=' + Math.round(centerX));

        return {
            faceHeight: box.height,
            boxY:       box.y,      // Y del tope del bbox (frente)
            neckY,
            centerX,
        };
    }

    // ── 3. Calcular y aplicar alineación ─────────────────────────
    async function align(photoImg, shirtImg, state, onUpdate) {
        if (!photoImg) return;
        console.log('[ShirtAlign] Iniciando alineación...');

        const face = await detectFaceData(photoImg);
        if (!face) return;

        const photoW = photoImg.naturalWidth || photoImg.width;

        // ── Escala ────────────────────────────────────────────────
        // La cara debe ocupar TARGET_FACE_PCT del alto del canvas (≈735px)
        const faceTargetPx  = H * TARGET_FACE_PCT;
        const newPhotoScale = Math.min(
            Math.max((faceTargetPx / face.faceHeight) * 40, 20),
            500
        );
        const sc = newPhotoScale / 40;

        // ── Posición Y ────────────────────────────────────────────
        // Anclar el top del bbox de la cara en TARGET_Y_TOP (85px)
        const newPhotoY = TARGET_Y_TOP - face.boxY * sc;

        // ── Posición X ────────────────────────────────────────────
        // Centrar la cara en W/2 (825px)
        let newPhotoX = (W / 2) - face.centerX * sc;

        // Clamp X: no salir más de 200px fuera del canvas
        const renderedW = photoW * sc;
        newPhotoX = Math.max(-(renderedW - W) - 200, Math.min(200, newPhotoX));

        // ── ShirtY (solo si hay remera activa) ────────────────────
        // Calculamos dónde queda el cuello de la persona en el canvas
        // y movemos la remera para que coincida.
        let newShirtY = 0;
        if (state.showShirt && shirtImg) {
            const shirtNeckY = detectShirtNeckY(shirtImg);
            if (shirtNeckY !== null) {
                const neckInCanvas = newPhotoY + face.neckY * sc;
                newShirtY = Math.round(neckInCanvas - shirtNeckY);
                console.log('[ShirtAlign] neckInCanvas=' + Math.round(neckInCanvas) +
                    ' shirtNeckY=' + shirtNeckY +
                    ' → shirtY=' + newShirtY);
            }
        }

        state.photoScale = newPhotoScale;
        state.photoY     = newPhotoY;
        state.photoX     = newPhotoX;
        state.shirtY     = newShirtY;

        _sync('sScale', 'vScale', newPhotoScale, '%');
        _sync('sY',     'vY',     newPhotoY,     '');
        _sync('sX',     'vX',     newPhotoX,     '');
        _sync('sShirtY','vShirtY', newShirtY,    '');

        onUpdate('draw');

        console.log('[ShirtAlign] ✓ scale=' + Math.round(newPhotoScale) +
            ' Y=' + Math.round(newPhotoY) +
            ' X=' + Math.round(newPhotoX) +
            ' shirtY=' + newShirtY);
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
