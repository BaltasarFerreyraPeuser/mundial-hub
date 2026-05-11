'use strict';

// ─────────────────────────────────────────────────────────────
//  SHIRT ALIGN v7
// ─────────────────────────────────────────────────────────────

const ShirtAlign = (() => {

    const W = 1650, H = 2310;
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
    // Usa luminosidad RGB (funciona con fondos negros opacos y con alpha).
    // Zona ANCHA  (20-80%): detecta el inicio de los hombros.
    // Zona ESTRECHA (44-56%): el agujero del cuello es negro → sube
    //   recién cuando la tela lo tapa = fondo del cuello.
    // Devuelve el CENTRO del agujero del cuello (promedio collar_top y neck_bottom).
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

        // Inicio de hombros (zona ancha > 5%)
        let shoulderY = null;
        for (let y = 0; y < H * 0.8; y++) {
            if (wide[y] > 0.05) { shoulderY = y; break; }
        }
        if (shoulderY === null) {
            console.warn('[ShirtAlign] No se detectaron hombros');
            return null;
        }

        // Collar top: primer Y donde zona estrecha supera 3%
        let collarTop = null;
        for (let y = shoulderY; y < H * 0.75; y++) {
            if (narrow[y] > 0.03) { collarTop = y; break; }
        }

        // Neck bottom: primer Y donde zona estrecha supera 20% (tela tapa el agujero)
        let neckBottom = null;
        for (let y = shoulderY; y < H * 0.75; y++) {
            if (narrow[y] > 0.20) { neckBottom = y; break; }
        }

        if (neckBottom === null) {
            // Remera sin agujero visible → fallback
            neckBottom = shoulderY + Math.floor(H * 0.12);
            collarTop  = neckBottom - Math.floor(H * 0.03);
        }

        collarTop = collarTop || neckBottom;

        // Punto de alineación = centro entre collar_top y neck_bottom
        const shirtNeckY = Math.round((collarTop + neckBottom) / 2);

        console.log('[ShirtAlign] shoulderY=' + shoulderY +
            ' collarTop=' + collarTop +
            ' neckBottom=' + neckBottom +
            ' → shirtNeckY=' + shirtNeckY);

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

        // Punto 8 = mentón central (más preciso que promedio de mandíbula lateral)
        const chinY = pts[8].y;

        // Centro horizontal: promedio de los 17 puntos del contorno facial
        const centerX = pts.slice(0, 17).reduce((s, p) => s + p.x, 0) / 17;

        // neckY = mentón + 20% de la altura del bbox
        // 20% da el punto justo debajo del mentón, donde empieza el cuello real
        const neckY = chinY + box.height * 0.20;

        console.log('[ShirtAlign] Cara h=' + Math.round(box.height) +
            ' chinY=' + Math.round(chinY) +
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

        // Escala: la cara ocupa el 30% del alto del canvas
        const newPhotoScale = Math.min(
            Math.max((H * 0.30 / face.faceHeight) * 40, 30),
            500
        );
        const sc = newPhotoScale / 40;

        // Y: alinear el cuello de la persona con el cuello de la remera
        let newPhotoY = shirtNeckY - face.neckY * sc;

        // Clamp: no cortar más del 5% del canvas por arriba (para no perder la cabeza)
        const maxCutTop = H * 0.05;
        if (newPhotoY < -maxCutTop) newPhotoY = -maxCutTop;

        // X: centrar la CARA (no la foto) horizontalmente en el canvas
        let newPhotoX = (W / 2) - face.centerX * sc;

        // Clamp X: evitar desplazamientos extremos
        const renderedW = photoW * sc;
        const minX = -(renderedW - W) - W * 0.3;
        const maxX =  W * 0.3;
        newPhotoX = Math.max(minX, Math.min(maxX, newPhotoX));

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
            ' Y=' + Math.round(newPhotoY) +
            ' X=' + Math.round(newPhotoX));
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
