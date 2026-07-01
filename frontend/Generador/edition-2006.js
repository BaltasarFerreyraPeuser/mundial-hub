const Edition2006 = {

    id: 'edition-2006',
    name: 'Alemania 2006',
    downloadSuffix: '2006',

    canvasW: 2994,
    canvasH: 3960,

    flagsPath: '/frontend/assets/flags/flags2006/',
    flagsSvgPath: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/flags/4x3/',
    miniflagsPath: '/frontend/assets/flags/miniflags/',

    theme: {
        '--theme-primary':    '#1a3c6e',
        '--theme-accent':     '#c8a800',
        '--theme-accent2':    '#e63027',
        '--theme-card-top':   '#1a3c6e',
        '--theme-tab-active': '#1a3c6e',
        '--theme-rainbow':    'linear-gradient(to right, #000000 0% 33%, #c8a800 33% 66%, #e63027 66% 100%)',
        '--theme-how-to-bg':  'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0)), linear-gradient(135deg, #1a3c6e, #e63027)',
        '--theme-bg-body':    '#f0f2f8',
        '--theme-header-txt': '#1a3c6e',
    },

    groups: {
        A: [
            { code: 'GER', name: 'Alemania'      },
            { code: 'CRC', name: 'Costa Rica'    },
            { code: 'POL', name: 'Polonia'       },
            { code: 'ECU', name: 'Ecuador'       },
        ],
        B: [
            { code: 'ENG', name: 'Inglaterra'    },
            { code: 'PAR', name: 'Paraguay'      },
            { code: 'TRI', name: 'Trinidad y Tobago' },
            { code: 'SWE', name: 'Suecia'        },
        ],
        C: [
            { code: 'ARG', name: 'Argentina'     },
            { code: 'CIV', name: 'Costa de Marfil' },
            { code: 'SRB', name: 'Serbia y Montenegro' },
            { code: 'NED', name: 'Países Bajos'  },
        ],
        D: [
            { code: 'MEX', name: 'México'        },
            { code: 'IRI', name: 'Irán'          },
            { code: 'ANG', name: 'Angola'        },
            { code: 'POR', name: 'Portugal'      },
        ],
        E: [
            { code: 'ITA', name: 'Italia'        },
            { code: 'GHA', name: 'Ghana'         },
            { code: 'USA', name: 'EE.UU.'        },
            { code: 'CZE', name: 'República Checa' },
        ],
        F: [
            { code: 'BRA', name: 'Brasil'        },
            { code: 'CRO', name: 'Croacia'       },
            { code: 'AUS', name: 'Australia'     },
            { code: 'JPN', name: 'Japón'         },
        ],
        G: [
            { code: 'FRA', name: 'Francia'       },
            { code: 'KOR', name: 'Corea del Sur' },
            { code: 'TOG', name: 'Togo'          },
            { code: 'SUI', name: 'Suiza'         },
        ],
        H: [
            { code: 'ESP', name: 'España'        },
            { code: 'UKR', name: 'Ucrania'       },
            { code: 'TUN', name: 'Túnez'         },
            { code: 'KSA', name: 'Arabia Saudita'},
        ],
    },

    defaultState: {
        photoScale: 110,
        photoY:     -80,
        photoX:     0,
        cCosito:    '#c8a800',
        cCosito1:   '#c8a800',
        cCosito2:   '#c8a800',
        cCosito3:   '#c8a800',
        sCosito:    false,
        sCosito1:   false,
        sCosito2:   false,
        sCosito3:   false,
        name:       'YOUR NAME',
        day:        '1',
        month:      '1',
        year:       '2000',
        code:       'ARG',
    },

    flagSlot: { x: 220, y: 199, w: 418, h: 257 },

    layerFiles: [
        { id: 'fondo',    src: '/frontend/assets/2006/fondo.webp'    },
        { id: 'costado',  src: '/frontend/assets/2006/costado.webp'  },
        { id: 'cosito', src: '/frontend/assets/2006/cosito_abajo.webp' },
        { id: 'cosito1', src: '/frontend/assets/2006/cosito_arriba.webp' },
        { id: 'cosito2', src: '/frontend/assets/2006/cositomedio.webp' },
        { id: 'cosito3', src: '/frontend/assets/2006/cositoabajo2.webp' },
        { id: 'bcosito',  src: '/frontend/assets/2006/Bcosito_abajo.webp'  },
        { id: 'bcosito1', src: '/frontend/assets/2006/Bcosito_arriba.webp' },
        { id: 'bcosito2', src: '/frontend/assets/2006/Bcositomedio.webp'   },
        { id: 'bcosito3', src: '/frontend/assets/2006/Bcositoabajo2.webp'  },
        { id: 'logo',     src: '/frontend/assets/2006/logo.svg'      },
        { id: 'marco',    src: '/frontend/assets/2006/marco.webp'    },
        { id: 'bandera',  src: '/frontend/assets/2006/bandera.png'   },
    ],

    buildTints(imgs, state) {
        const W = 2994, H = 3960;

        const tintShape = (src, hex) => {
            if (!src || !hex) return null;
            const oc = document.createElement('canvas');
            oc.width = W; oc.height = H;
            const ox = oc.getContext('2d');
            ox.fillStyle = hex;
            ox.fillRect(0, 0, W, H);
            ox.globalCompositeOperation = 'destination-in';
            ox.drawImage(src, 0, 0, W, H);
            return oc;
        };
        const makeCosito = (baseSrc, borderSrc, hex, strokeMode) => {
            if (!baseSrc || !hex) return null;

            if (strokeMode && borderSrc) {
                const whiteBase = tintShape(baseSrc, '#ffffff');
                const coloredBorder = tintShape(borderSrc, hex);

                const oc = document.createElement('canvas');
                oc.width = W; oc.height = H;
                const ox = oc.getContext('2d');
                if (whiteBase)      ox.drawImage(whiteBase, 0, 0);
                if (coloredBorder)  ox.drawImage(coloredBorder, 0, 0);
                return oc;
            }

            return tintShape(baseSrc, hex);
        };

        return {
            cosito:  makeCosito(imgs['cosito'],  imgs['bcosito'],  state.cCosito  || '#c8a800', state.sCosito),
            cosito1: makeCosito(imgs['cosito1'], imgs['bcosito1'], state.cCosito1 || '#c8a800', state.sCosito1),
            cosito2: makeCosito(imgs['cosito2'], imgs['bcosito2'], state.cCosito2 || '#c8a800', state.sCosito2),
            cosito3: makeCosito(imgs['cosito3'], imgs['bcosito3'], state.cCosito3 || '#c8a800', state.sCosito3),
        };
    },

    draw(ctx, state, imgs, tints, photo, flagImg) {
        const W = 2994, H = 3960;
        const FONT_code = '"FuentePais2006", "Barlow Condensed", sans-serif';
        const FONT_name = '"FuenteNombre2006", "Barlow Condensed", sans-serif';

        ctx.clearRect(0, 0, W, H);
        ctx.save();

        // 1 — Fondo
        if (imgs['fondo']) {
            ctx.drawImage(imgs['fondo'], 0, 0, W, H);
        } else {
            ctx.fillStyle = '#1a3c6e';
            ctx.fillRect(0, 0, W, H);
        }

        if (photo) {
            const sc = state.photoScale / 40;
            const pw = photo.width * sc;
            const ph = photo.height * sc;
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(0, 0, W, H, 14);
            ctx.clip();
            ctx.drawImage(photo, (W - pw) / 2 + state.photoX, state.photoY, pw, ph);
            ctx.restore();
        }

        // 3 — Costado
        if (imgs['costado']) ctx.drawImage(imgs['costado'], 0, 0, W, H);

        // 4 — Picos
        if (tints && tints['cosito']) {
            ctx.drawImage(tints['cosito'], 0, 0, W, H);
        } else if (imgs['cosito']) {
            ctx.drawImage(imgs['cosito'], 0, 0, W, H);
        }
        if (tints && tints['cosito1']) {
            ctx.drawImage(tints['cosito1'], 0, 0, W, H);
        } else if (imgs['cosito1']) {
            ctx.drawImage(imgs['cosito1'], 0, 0, W, H);
        }
        if (tints && tints['cosito2']) {
            ctx.drawImage(tints['cosito2'], 0, 0, W, H);
        } else if (imgs['cosito2']) {
            ctx.drawImage(imgs['cosito2'], 0, 0, W, H);
        }
        if (tints && tints['cosito3']) {
            ctx.drawImage(tints['cosito3'], 0, 0, W, H);
        } else if (imgs['cosito3']) {
            ctx.drawImage(imgs['cosito3'], 0, 0, W, H);
        }

        // 5 — Logo
        if (imgs['logo']) ctx.drawImage(imgs['logo'], 0, 0, W, H);

        // 6 — Marco
        if (imgs['marco']) ctx.drawImage(imgs['marco'], 0, 0, W, H);

        // 7 — Bandera en el slot rectangular
        const { x: FX, y: FY, w: FW, h: FH } = this.flagSlot;

        if (flagImg) {
            const fw = flagImg.naturalWidth  || flagImg.width  || FW;
            const fh = flagImg.naturalHeight || flagImg.height || FH;

            ctx.save();
            ctx.beginPath();
            ctx.rect(FX, FY, FW, FH);
            ctx.clip();

            let dw, dh, dx, dy;
            if (state.code === 'BRA') {
                const scale = Math.min(FW / fw, FH / fh);
                dw = fw * scale; dh = fh * scale;
                dx = FX + (FW - dw) / 2; dy = FY + (FH - dh) / 2;
                ctx.fillStyle = '#009C3B';
                ctx.fillRect(FX, FY, FW, FH);
            } else {
                const scale = Math.max(FW / fw, FH / fh);
                dw = fw * scale; dh = fh * scale;
                dx = FX + (FW - dw) / 2; dy = FY + (FH - dh) / 2;
            }
            ctx.drawImage(flagImg, dx, dy, dw, dh);
            ctx.restore();
        } else {
            ctx.save();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 6;
            ctx.strokeRect(FX, FY, FW, FH);
            ctx.restore();
        }
        if (imgs['bandera']) ctx.drawImage(imgs['bandera'], 0, 0, W, H);

        ctx.save();
        ctx.font = `bold 235px ${FONT_code}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#ffffff';
        const codeCX = FX + FW / 2;
        const codeY  = FY + FH + 30;
        ctx.fillText(state.code.toUpperCase().slice(0, 3), 430, 435, FW);
        ctx.restore();

        ctx.save();
        ctx.font = `bold 170px ${FONT_name}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#000000';
        ctx.fillText(state.name.toUpperCase(), 210, 3800, 1800);
        ctx.restore();

        ctx.restore();
    },

    renderControls(state) {
        const cositos = [
            { id: 'cCosito',  sId: 'sCosito',  label: 'Pico 1', color: state.cCosito  || '#c8a800', stroke: !!state.sCosito  },
            { id: 'cCosito1', sId: 'sCosito1', label: 'Pico 2', color: state.cCosito1 || '#c8a800', stroke: !!state.sCosito1 },
            { id: 'cCosito2', sId: 'sCosito2', label: 'Pico 3', color: state.cCosito2 || '#c8a800', stroke: !!state.sCosito2 },
            { id: 'cCosito3', sId: 'sCosito3', label: 'Pico 4', color: state.cCosito3 || '#c8a800', stroke: !!state.sCosito3 },
        ];
        const rows = cositos.map(c => `
            <div class="crow" style="gap:10px;align-items:center;">
                <label for="${c.id}" style="min-width:110px;font-size:12px;">${c.label}</label>
                <input type="color" id="${c.id}" value="${c.color}">
                <label style="display:flex;align-items:center;gap:4px;font-size:11px;cursor:pointer;white-space:nowrap;">
                    <input type="checkbox" id="${c.sId}" ${c.stroke ? 'checked' : ''}>
                    Borde
                </label>
            </div>`).join('');
        return `
        <div class="card edition-controls" data-card-num="02">
            <h3>Color cositos</h3>
            ${rows}
        </div>`;
    },

    bindControls(state, onUpdate) {
        [
            { colorId: 'cCosito',  strokeId: 'sCosito',  colorKey: 'cCosito',  strokeKey: 'sCosito'  },
            { colorId: 'cCosito1', strokeId: 'sCosito1', colorKey: 'cCosito1', strokeKey: 'sCosito1' },
            { colorId: 'cCosito2', strokeId: 'sCosito2', colorKey: 'cCosito2', strokeKey: 'sCosito2' },
            { colorId: 'cCosito3', strokeId: 'sCosito3', colorKey: 'cCosito3', strokeKey: 'sCosito3' },
        ].forEach(({ colorId, strokeId, colorKey, strokeKey }) => {
            const colorEl = document.getElementById(colorId);
            if (colorEl) colorEl.addEventListener('input', e => { state[colorKey] = e.target.value; onUpdate('tints'); });
            const strokeEl = document.getElementById(strokeId);
            if (strokeEl) strokeEl.addEventListener('change', e => { state[strokeKey] = e.target.checked; onUpdate('tints'); });
        });

        ['inDay', 'inMonth', 'inYear'].forEach(id => {
            const inp = document.getElementById(id);
            if (!inp) return;
            inp.addEventListener('input', e => {
                const val = e.target.value.replace(/\D/g, '');
                if (id === 'inDay')   state.day   = val.slice(0, 2);
                if (id === 'inMonth') state.month = val.slice(0, 2);
                if (id === 'inYear')  state.year  = val.slice(0, 4);
                e.target.value = (id === 'inYear') ? state.year : (id === 'inDay' ? state.day : state.month);
                onUpdate('draw');
            });
        });
    },
};
