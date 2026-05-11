'use strict';

// ─────────────────────────────────────────────────────────────
//  SHIRT ALIGN v6
//  Cambios vs v5:
//  · detectShirtNeckY: reemplaza detección por alpha (que falla
//    con fondos negros) por detección por luminosidad RGB.
//    Usa zona ANCHA (20-80%) para encontrar el inicio del hombro
//    y zona ESTRECHA (44-56%) para encontrar el fondo del cuello.
//  · detectFaceData: neckY offset 10% → 30% del bbox (más real).
//  · align: face target 24% → 28% del alto del canvas (cara más grande).
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
    // Funciona con imágenes de fondo NEGRO (sin alpha real) y también
    // con imágenes con canal alpha transparente.
    //
    // Estrategia:
    //   a) "Pixel de remera" = luminosidad > 25 (descarta negro puro y cuello oscuro)
    //   b) Perfil ANCHO (20–80% del ancho): encuentra el inicio de los hombros
    //   c) Perfil ESTRECHO (44–56% del ancho): el agujero del cuello es negro,
    //      así que este perfil sube recién cuando la tela tapa el agujero → fondo del cuello
    //   d) shirtNeckY = primer Y donde perfil estrecho supera el 20%
    //
    function detectShirtNeckY(shirtImg) {
        const oc    = document.createElement('canvas');
        oc.width    = W;
        oc.height   = H;
        const octx  = oc.getContext('2d', { alpha: true, willReadFrequently: true });
        octx.clearRect(0, 0, W, H);
        octx.drawImage(shirtImg, 0, 0, W, H);

        const { data } = octx.getImageData(0, 0, W, H);

        // Pixel "es remera" si luminosidad > 25 o alpha > 25
        // (cubre tanto fondos negros opacos como fondos transparentes)
        function isShirt(idx) {
            const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            return lum > 25 || a > 25;
        }

        const SMOOTH_WIN = 15;

        function buildProfile(x0frac, x1frac) {
            const x0 = Math.floor(W * x0frac);
            const x1 = Math.floor(W * x1frac);
            const cols = x1 - x0;
            const raw = new Float32Array(H);
            for (let y = 0; y < H; y++) {
                let cnt = 0;
                for (let x = x0; x < x1; x++) {
                    if (isShirt((y * W + x) * 4)) cnt++;
                }
                raw[y] = cnt / cols;
            }
            // suavizar
            const sm = new Float32Array(H);
            for (let y = 0; y < H; y++) {
                let s = 0, n = 0;
                for (let k = -SMOOTH_WIN; k <= SMOOTH_WIN; k++) {
                    const yk = y + k;
                    if (yk >= 0 && yk < H) { s += raw[yk]; n++; }
                }
                sm[y] = s / n;
            }
            return sm;
        }

        const wide   = buildProfile(0.20, 0.80);   // hombros
        const narrow = buildProfile(0.44, 0.56);   // agujero del cuello

        // a) Primer Y donde la zona ANCHA supera 5% → inicio de hombros
        let firstShoulderY = null;
        for (let y = 0; y < H * 0.8; y++) {
            if (wide[y] > 0.05) { firstShoulderY = y; break; }
        }

        if (firstShoulderY === null) {
            console.warn('[ShirtAlign] No se detectaron hombros en la remera');
            return null;
        }
        console.log('[ShirtAlign] Hombros detectados en Y=' + firstShoulderY);

        // b) Desde los hombros, buscar el fondo del cuello:
        //    primer Y donde la zona ESTRECHA supera 20% (tela tapa el agujero)
        for (let y = firstShoulderY; y < H * 0.75; y++) {
            if (narrow[y] > 0.20) {
                console.log('[ShirtAlign] ✓ Fondo cuello Y=' + y +
                    ' (narrow=' + narrow[y].toFixed(3) + ')');
                return y;
            }
        }

        // Fallback: si el cuello no tiene agujero visible (remera cerrada)
        // usar el primer hombro + 12% del canvas
        const fallback = firstShoulderY + Math.floor(H * 0.12);
        console.log('[ShirtAlign] Sin agujero de cuello, fallback Y=' + fallback);
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

        // Cuello = mandíbula + 30% de la altura del bbox
        // (era 10%, que quedaba demasiado alto — el cuello real está ~1/4 más abajo)
        const neckY   = avgJawY + box.height * 0.30;
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

        // Escala: la cara ocupa ~28% del alto del canvas
        // (era 24%, que dejaba la cara demasiado pequeña)
        const newPhotoScale = Math.min(Math.max((H * 0.28 / face.faceHeight) * 40, 40), 500);
        const sc            = newPhotoScale / 40;

        // Y: alinear cuello de la persona con el cuello de la remera
        const newPhotoY = shirtNeckY - face.neckY * sc;

        // X: centrar la CARA (no la foto) horizontalmente en el canvas
        const newPhotoX = (W / 2) - face.centerX * sc;

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
