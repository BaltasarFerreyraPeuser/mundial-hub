const EditionExtraCard = {

    id: 'edition-extracard',
    name: 'Extra Card',
    downloadSuffix: 'extracard',

    canvasW: 2994,
    canvasH: 3960,

    flagsPath: '/frontend/assets/flags/extraflags/',
    flagsSvgPath: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/flags/4x3/',

    marcoBanderaSlots: [
        { x: 349,  y: 712,  w: 2264, h: 2246, r: 1141 },
        { x: 214,  y: 2834, w: 524,  h: 520,  r: 264  }, 
    ],
    miniflagsPath: '/frontend/assets/flags/miniflags/',

    theme: {
        '--theme-primary': '#17277f',
        '--theme-accent': '#43c4c9',
        '--theme-accent2': '#e5ff00',
        '--theme-card-top': '#17277f',
        '--theme-tab-active': '#17277f',
        '--theme-rainbow': 'linear-gradient(to right, #2651ff 0% 16.6%, #ea0001 16.6% 33.2%, #e5ff00 33.2% 49.8%, #6d00fc 49.8% 66.4%, #019afa 66.4% 83%, #00c93b 83% 100%)',
        '--theme-how-to-bg': 'linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0)), linear-gradient(135deg, #e5ff00, #019afa)',
        '--theme-bg-body': '#ffffff',
        '--theme-header-txt': '#000000',
    },

    groups: {
        A: [
            { code: 'MEX', name: 'Mexico' },
            { code: 'RSA', name: 'South Africa' },
            { code: 'KOR', name: 'Corea del Sur' },
            { code: 'CZE', name: 'Chequia' },
        ],
        B: [
            { code: 'CAN', name: 'Canada' },
            { code: 'BIH', name: 'Bosnia y Herzegovina' },
            { code: 'QAT', name: 'Qatar' },
            { code: 'SUI', name: 'Suiza' },
        ],
        C: [
            { code: 'BRA', name: 'Brasil' },
            { code: 'MAR', name: 'Marruecos' },
            { code: 'HAI', name: 'Haiti' },
            { code: 'SCO', name: 'Escocia' },
        ],
        D: [
            { code: 'USA', name: 'Estados Unidos' },
            { code: 'PAR', name: 'Paraguay' },
            { code: 'AUS', name: 'Australia' },
            { code: 'TUR', name: 'Turkey' },
        ],
        E: [
            { code: 'GER', name: 'Alemania' },
            { code: 'CUW', name: 'Curazao' },
            { code: 'CIV', name: 'Costa de Marfil' },
            { code: 'ECU', name: 'Ecuador' },
        ],
        F: [
            { code: 'NED', name: 'Netherlands' },
            { code: 'JPN', name: 'Japan' },
            { code: 'SWE', name: 'Suecia' },
            { code: 'TUN', name: 'Tunisia' },
        ],
        G: [
            { code: 'BEL', name: 'Belgium' },
            { code: 'EGY', name: 'Egipto' },
            { code: 'IRI', name: 'Iran' },
            { code: 'NZL', name: 'Nueva Zelanda' },
        ],
        H: [
            { code: 'ESP', name: 'Spain' },
            { code: 'CPV', name: 'Cabo Verde' },
            { code: 'KSA', name: 'Arabia Saudita' },
            { code: 'URU', name: 'Uruguay' },
        ],
        I: [
            { code: 'FRA', name: 'Francia' },
            { code: 'SEN', name: 'Senegal' },
            { code: 'IRQ', name: 'Irak' },
            { code: 'NOR', name: 'Noruega' },
        ],
        J: [
            { code: 'ARG', name: 'Argentina' },
            { code: 'ALG', name: 'Argelia' },
            { code: 'AUT', name: 'Austria' },
            { code: 'JOR', name: 'Jordania' },
        ],
        K: [
            { code: 'POR', name: 'Portugal' },
            { code: 'COD', name: 'DR Congo' },
            { code: 'UZB', name: 'Uzbekistan' },
            { code: 'COL', name: 'Colombia' },
        ],
        L: [
            { code: 'ENG', name: 'Inglaterra' },
            { code: 'CRO', name: 'Croacia' },
            { code: 'GHA', name: 'Ghana' },
            { code: 'PAN', name: 'Panama' },
        ],
        Extra: [
            { code: 'VEN', name: 'Venezuela' },
            { code: 'IRL', name: 'Irlanda' },
            { code: 'ITA', name: 'Italia' },
            { code: 'POL', name: 'Polonia' },
            { code: 'CHI', name: 'Chile' },
            { code: 'BOL', name: 'Bolivia'},
        ],
    },

    defaultState: {
        photoScale: 110,
        photoY: 1200,
        photoX: 0,
        rareza: 'com',
        name: 'YOUR NAME',
        code: 'ARG',
        // Personalización de bandera
        customFlag:         false,
        customFlagImg:      null,
        customFlagColor:    '#1a3fa3',
        customFlagImgScale: 100,
        customFlagImgX:     0,
        customFlagImgY:     0,
    },

    rareza: {
        com: { label: 'Común', layerId: 'bg-comun', fallback: '#7c4177', rectColor: '#7c4177' },
        bro: { label: 'Bronze', layerId: 'bg-bronce', fallback: '#b87b4c', rectColor: '#b87b4c' },
        pla: { label: 'Silver', layerId: 'bg-plata', fallback: '#aaaaaa', rectColor: '#aaaaaa' },
        oro: { label: 'Gold', layerId: 'bg-oro', fallback: '#c5a214', rectColor: '#c5a214' },
    },

    layerFiles: [
        { id: 'bg-comun', src: '/frontend/assets/extracard/fondovioleta.png' },
        { id: 'bg-bronce', src: '/frontend/assets/extracard/fondobronce.png' },
        { id: 'bg-plata', src: '/frontend/assets/extracard/fondoplata.png' },
        { id: 'bg-oro', src: '/frontend/assets/extracard/fondoro.png' },
        { id: 'extra', src: '/frontend/assets/extracard/extrasticker.png' },
        { id: 'fifa', src: '/frontend/assets/svg/fifa2.svg' },
        { id: 'tapadera', src: '/frontend/assets/tapadera2.webp' },
        { id: 'marcobandera', src: '/frontend/assets/svg/marcoextra.svg' },
        { id: 'rectangulo', src: '/frontend/assets/extracard/rectangulo.png' },
        { id: 'marco', src: '/frontend/assets/extracard/marco.png' },
    ],

    buildTints(_imgs, _state) {
        return {};
    },

    draw(ctx, state, imgs, _tints, photo, flagImg, options = {}) {
        const forExport = !!options.forExport;
        const W = 2994, H = 3960;

        ctx.clearRect(0, 0, W, H);
        ctx.save();

        const currentRareza = this.rareza[state.rareza] || this.rareza['com'];
        const bgLayerId = currentRareza.layerId;

        if (imgs[bgLayerId]) {
            ctx.drawImage(imgs[bgLayerId], 0, 0, W, H);
        } else {
            ctx.fillStyle = currentRareza.fallback;
            ctx.fillRect(0, 0, W, H);
        }

        if (flagImg && this.marcoBanderaSlots && !state.customFlag) {
            this.marcoBanderaSlots.forEach(slot => {
                const { x, y, w, h, r } = slot;
                const fw = flagImg.naturalWidth  || flagImg.width  || w;
                const fh = flagImg.naturalHeight || flagImg.height || h;
                const x2 = x + w, y2 = y + h;
                let dw, dh, dx, dy;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x2, y);
                ctx.lineTo(x2, y2 - r);
                ctx.arcTo(x2, y2, x2 - r, y2, r);
                ctx.lineTo(x + r, y2);
                ctx.arcTo(x, y2, x, y2 - r, r);
                ctx.lineTo(x, y + r);
                ctx.arcTo(x, y, x + r, y, r);
                ctx.closePath();
                ctx.clip();

                if (state.code === 'BRA') {
                    // contain + fondo verde para que el rombo entre completo
                    const scale = Math.min(w / fw, h / fh);
                    dw = fw * scale; dh = fh * scale;
                    dx = x + (w - dw) / 2; dy = y + (h - dh) / 2;
                    ctx.fillStyle = '#009C3B';
                    ctx.fillRect(x, y, w, h);
                } else {
                    // comportamiento original: escala por altura
                    const scale = h / fh;
                    dw = fw * scale; dh = h;
                    dx = x + (w - dw) / 2; dy = y;
                }
                ctx.drawImage(flagImg, dx, dy, dw, dh);
                ctx.restore();
            });
        }

        if (state.customFlag && this.marcoBanderaSlots) {
            // El slot de referencia es el grande (índice 0) para los sliders
            const refSlot = this.marcoBanderaSlots[0];

            this.marcoBanderaSlots.forEach(slot => {
                const { x, y, w, h, r } = slot;
                const x2 = x + w, y2 = y + h;

                // Factor de escala de este slot relativo al slot grande
                const slotRatio = Math.min(w / refSlot.w, h / refSlot.h);

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.lineTo(x2, y);
                ctx.lineTo(x2, y2 - r);
                ctx.arcTo(x2, y2, x2 - r, y2, r);
                ctx.lineTo(x + r, y2);
                ctx.arcTo(x, y2, x, y2 - r, r);
                ctx.lineTo(x, y + r);
                ctx.arcTo(x, y, x + r, y, r);
                ctx.closePath();
                ctx.clip();

                // Fondo de color sólido
                ctx.fillStyle = state.customFlagColor || '#1a3fa3';
                ctx.fillRect(x, y, w, h);

                // Imagen escalada proporcionalmente al tamaño de este slot
                if (state.customFlagImg) {
                    const sc = (state.customFlagImgScale || 100) / 100 * slotRatio;
                    const iw = state.customFlagImg.width  * sc;
                    const ih = state.customFlagImg.height * sc;
                    const ix = x + (w - iw) / 2 + (state.customFlagImgX || 0) * slotRatio;
                    const iy = y + (h - ih) / 2 + (state.customFlagImgY || 0) * slotRatio;
                    ctx.drawImage(state.customFlagImg, ix, iy, iw, ih);
                }
                ctx.restore();
            });
        }
        if (imgs['marcobandera']) ctx.drawImage(imgs['marcobandera'], 0, 0, W, H);
        if (photo) {
            const sc = state.photoScale / 20;
            const pw = photo.width * sc;
            const ph = photo.height * sc;
            const px = (W - pw) / 2 + state.photoX;
            const py = state.photoY;

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(0, 0, W, H, 20);
            ctx.clip();

            const outlineSize = 22;
            const offsets = [
                [-1, 0], [1, 0], [0, -1], [0, 1],
                [-1, -1], [1, -1], [-1, 1], [1, 1],
            ];

            const tmpC = document.createElement('canvas');
            tmpC.width = W; tmpC.height = H;
            const tmpX = tmpC.getContext('2d');

            offsets.forEach(([ox, oy]) => {
                tmpX.drawImage(photo, px + ox * outlineSize, py + oy * outlineSize, pw, ph);
            });

            tmpX.globalCompositeOperation = 'source-in';
            tmpX.fillStyle = '#ffffff';
            tmpX.fillRect(0, 0, W, H);

            ctx.drawImage(tmpC, 0, 0);
            ctx.drawImage(photo, px, py, pw, ph);

            ctx.restore();
        }

        if (imgs['extra']) ctx.drawImage(imgs['extra'], 0, 0, W, H);
        if (forExport) {
            if (imgs['fifa']) ctx.drawImage(imgs['fifa'], 0, 0, W, H);
        } else {
            if (imgs['tapadera']) ctx.drawImage(imgs['tapadera'], 0, 0, W, H);
        }
        if (imgs['rectangulo']) ctx.drawImage(imgs['rectangulo'], 0, 0, W, H);
        if (imgs['marco']) ctx.drawImage(imgs['marco'], 0, 0, W, H);

        ctx.save();
        ctx.textAlign = 'center';
        const cx = W / 2;
        const FONT = '"FuentePersonalizadaAAA", "Barlow Condensed", sans-serif';

        ctx.font = `160px ${FONT}`;
        ctx.fillStyle = '#ffffff';
        ctx.translate(cx, 3670);
        ctx.scale(1, 1.40);
        ctx.fillText(state.name.toUpperCase(), 0, 0, 2538);
        ctx.restore();

        ctx.restore();
    },
    renderControls(state) {
        const bgOpts = Object.entries(this.rareza).map(([key, v]) => {
            const isActive = state.rareza === key ? ' active' : '';
            return `
            <button class="q-ext-btn${isActive}" 
                    data-rareza="${key}" 
                    style="--pos-color: ${v.rectColor}">
                ${v.label}
            </button>`;
        }).join('');

        const cfShow = state.customFlag ? '' : 'display:none';
        const cfHide = state.customFlag ? 'display:none' : '';

        return `
        <div class="card card--blue edition-controls" data-card-num="02">
            <h3>Rarity</h3>
            <div class="q-btn-row q-pos-row">${bgOpts}</div>
        </div>

        <div class="card card--orange edition-controls" data-card-num="03" id="cardCustomFlag">
            <h3>País personalizado</h3>

            <div class="crow">
                <label for="customFlag">Personalizar</label>
                <label class="toggle-switch">
                    <input type="checkbox" id="customFlag" ${state.customFlag ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
                <span>Activar personalización</span>
            </div>

            <div id="customFlagDropdownWrap" style="${cfHide}">
                <p class="custom-flag-hint">Selector de país desactivado</p>
            </div>

            <div id="customFlagControls" style="${cfShow}">
                <div class="crow">
                    <label for="customFlagColor">Fondo del escudo</label>
                    <input type="color" id="customFlagColor" value="${state.customFlagColor || '#1a3fa3'}">
                    <span>Color de fondo</span>
                </div>

                <div class="crow" style="align-items:flex-start;flex-direction:column;gap:6px;">
                    <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;">
                        Imagen del escudo
                    </label>
                    <label class="upload-btn upload-direct" for="customFlagImgInput" style="margin-bottom:0;font-size:12px;padding:8px 12px;">
                        <span>🖼 Subir imagen</span>
                    </label>
                    <input type="file" id="customFlagImgInput" accept="image/*" style="display:none!important;">
                    <span id="customFlagImgName" style="font-size:10px;color:#555;">${state.customFlagImg ? '✅ Imagen cargada' : 'Sin imagen'}</span>
                </div>

                <div id="customFlagImgSliders" style="${state.customFlagImg ? '' : 'display:none'}">
                    <div class="srow" style="margin-top:8px;">
                        <label for="sFlagScale">Tamaño</label>
                        <input type="range" id="sFlagScale" min="5" max="200" value="${state.customFlagImgScale || 100}">
                        <input type="number" class="srow-num" id="vFlagScale" min="5" max="200" value="${state.customFlagImgScale || 100}">
                    </div>
                    <div class="srow">
                        <label for="sFlagX">Horizontal</label>
                        <input type="range" id="sFlagX" min="-500" max="500" value="${state.customFlagImgX || 0}">
                        <input type="number" class="srow-num" id="vFlagX" min="-500" max="500" value="${state.customFlagImgX || 0}">
                    </div>
                    <div class="srow">
                        <label for="sFlagY">Vertical</label>
                        <input type="range" id="sFlagY" min="-500" max="500" value="${state.customFlagImgY || 0}">
                        <input type="number" class="srow-num" id="vFlagY" min="-500" max="500" value="${state.customFlagImgY || 0}">
                    </div>
                </div>
            </div>
        </div>`;
    },

    bindControls(state, onUpdate) {
        document.querySelectorAll('.q-ext-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.rareza = btn.dataset.rareza;
                document.querySelectorAll('.q-ext-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                onUpdate('draw');
            });
        });

        // ── Bandera personalizada ─────────────────────────────────────────────
        const customFlagToggle = document.getElementById('customFlag');
        if (customFlagToggle) {
            customFlagToggle.addEventListener('change', e => {
                state.customFlag = e.target.checked;

                const controls    = document.getElementById('customFlagControls');
                const ddWrap      = document.getElementById('customFlagDropdownWrap');
                const countryCard = document.querySelector('.card--green');

                if (controls) controls.style.display = e.target.checked ? '' : 'none';
                if (ddWrap)   ddWrap.style.display   = e.target.checked ? '' : 'none';

                if (countryCard) {
                    countryCard.style.opacity      = e.target.checked ? '0.4' : '';
                    countryCard.style.pointerEvents = e.target.checked ? 'none' : '';
                }

                onUpdate('draw');
            });

            if (state.customFlag) {
                const countryCard = document.querySelector('.card--green');
                if (countryCard) {
                    countryCard.style.opacity      = '0.4';
                    countryCard.style.pointerEvents = 'none';
                }
            }
        }

        const flagColorEl = document.getElementById('customFlagColor');
        if (flagColorEl) {
            flagColorEl.addEventListener('input', e => {
                state.customFlagColor = e.target.value;
                onUpdate('draw');
            });
        }

        const flagImgInput = document.getElementById('customFlagImgInput');
        if (flagImgInput) {
            flagImgInput.addEventListener('change', e => {
                const file = e.target.files[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                const img = new Image();
                img.onload = () => {
                    URL.revokeObjectURL(url);
                    state.customFlagImg = img;

                    // Escala automática para que entre bien en el slot grande
                    const MF_SIZE = 2246;
                    const maxDim  = Math.max(img.width, img.height);
                    const autoScale = Math.round((MF_SIZE * 0.80) / maxDim * 100);
                    state.customFlagImgScale = Math.min(Math.max(autoScale, 5), 200);
                    state.customFlagImgX     = 0;
                    state.customFlagImgY     = 0;

                    const sFlagScale = document.getElementById('sFlagScale');
                    const vFlagScale = document.getElementById('vFlagScale');
                    if (sFlagScale) sFlagScale.value = state.customFlagImgScale;
                    if (vFlagScale) vFlagScale.value = state.customFlagImgScale;
                    ['sFlagX','vFlagX','sFlagY','vFlagY'].forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.value = 0;
                    });

                    const slidersWrap = document.getElementById('customFlagImgSliders');
                    if (slidersWrap) slidersWrap.style.display = '';
                    const nameSpan = document.getElementById('customFlagImgName');
                    if (nameSpan) nameSpan.textContent = '✅ ' + file.name.slice(0, 22);

                    onUpdate('draw');
                };
                img.src = url;
            });
        }

        const flagSliders = [
            { sl: 'sFlagScale', num: 'vFlagScale', key: 'customFlagImgScale' },
            { sl: 'sFlagX',     num: 'vFlagX',     key: 'customFlagImgX'     },
            { sl: 'sFlagY',     num: 'vFlagY',     key: 'customFlagImgY'     },
        ];
        flagSliders.forEach(({ sl, num, key }) => {
            const slEl  = document.getElementById(sl);
            const numEl = document.getElementById(num);
            if (!slEl || !numEl) return;
            const sync = val => {
                state[key] = parseFloat(val);
                slEl.value  = val;
                numEl.value = val;
                onUpdate('draw');
            };
            slEl.addEventListener('input',  e => sync(e.target.value));
            numEl.addEventListener('input', e => sync(e.target.value));
        });
    },
};