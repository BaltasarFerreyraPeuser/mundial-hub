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
        { id: 'cositos',  src: '/frontend/assets/2006/cositos.svg'   },
        { id: 'logo',     src: '/frontend/assets/2006/logo.svg'      },
        { id: 'marco',    src: '/frontend/assets/2006/marco.webp'    },
        { id: 'bandera',  src: '/frontend/assets/2006/bandera.png'   },
    ],

    buildTints(imgs, state) {
        if (!imgs['cositos'] || !state.cCosito) return {};

        const oc = document.createElement('canvas');
        oc.width = 2994; oc.height = 3960;
        const ox = oc.getContext('2d');
        ox.fillStyle = state.cCosito;
        ox.fillRect(0, 0, 2994, 3960);
        ox.globalCompositeOperation = 'destination-in';
        ox.drawImage(imgs['cositos'], 0, 0, 2994, 3960);

        return { cositos: oc };
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

        // 4 — Cositos (con tint)
        if (tints && tints['cositos']) {
            ctx.drawImage(tints['cositos'], 0, 0, W, H);
        } else if (imgs['cositos']) {
            ctx.drawImage(imgs['cositos'], 0, 0, W, H);
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
        return `
        <div class="card edition-controls" data-card-num="02">
            <h3>Color cositos</h3>
            <div class="crow">
                <label for="cCosito">Cositos</label>
                <input type="color" id="cCosito" value="${state.cCosito || '#c8a800'}">
                <span>Color de los cositos</span>
            </div>
        </div>`;
    },

    bindControls(state, onUpdate) {
        const el = document.getElementById('cCosito');
        if (el) {
            el.addEventListener('input', e => {
                state.cCosito = e.target.value;
                onUpdate('tints');
            });
        }

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
