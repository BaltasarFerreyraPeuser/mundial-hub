const EditionQatar2022 = {

    id: 'edition-qatar2022',
    name: 'Qatar 2022',
    downloadSuffix: 'qatar2022',

    canvasW: 2994,
    canvasH: 3960,

    flagsPath: '/frontend/assets/flags/Qatarflags/',
    miniflagsPath: '/frontend/assets/flags/miniflags/',

    theme: {
        '--theme-primary':    '#5a0a28',
        '--theme-accent':     '#F0A500',
        '--theme-accent2':    '#00A86B',
        '--theme-card-top':   '#5a0a28',
        '--theme-tab-active': '#5a0a28',
        '--theme-rainbow':    'linear-gradient(to right, #8B1A3A 0% 25%, #F0A500 25% 50%, #00A86B 50% 75%, #ffffff 75% 100%)',
        '--theme-how-to-bg':  'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0)), linear-gradient(135deg, #5a0a28, #8B1A3A)',
        '--theme-bg-body':    '#f5ede8',
        '--theme-header-txt': '#5a0a28',
    },

    groups: {
        A: [
            { code:'QAT', name:'Qatar'         },
            { code:'ECU', name:'Ecuador'       },
            { code:'SEN', name:'Senegal'       },
            { code:'NED', name:'Países Bajos'  },
        ],
        B: [
            { code:'ENG', name:'Inglaterra'    },
            { code:'IRI', name:'Irán'          },
            { code:'USA', name:'EE.UU.'        },
            { code:'WAL', name:'Gales'         },
        ],
        C: [
            { code:'ARG', name:'Argentina'     },
            { code:'KSA', name:'Arabia Saudita'},
            { code:'MEX', name:'México'        },
            { code:'POL', name:'Polonia'       },
        ],
        D: [
            { code:'FRA', name:'Francia'       },
            { code:'AUS', name:'Australia'     },
            { code:'DEN', name:'Dinamarca'     },
            { code:'TUN', name:'Túnez'         },
        ],
        E: [
            { code:'ESP', name:'España'        },
            { code:'CRC', name:'Costa Rica'    },
            { code:'GER', name:'Alemania'      },
            { code:'JPN', name:'Japón'         },
        ],
        F: [
            { code:'BEL', name:'Bélgica'       },
            { code:'CAN', name:'Canadá'        },
            { code:'MAR', name:'Marruecos'     },
            { code:'CRO', name:'Croacia'       },
        ],
        G: [
            { code:'BRA', name:'Brasil'        },
            { code:'SRB', name:'Serbia'        },
            { code:'SUI', name:'Suiza'         },
            { code:'CMR', name:'Camerún'       },
        ],
        H: [
            { code:'POR', name:'Portugal'      },
            { code:'GHA', name:'Ghana'         },
            { code:'URU', name:'Uruguay'       },
            { code:'KOR', name:'Corea del Sur' },
        ],
    },

    positions: {
        gk:  { label: 'Goalkeeper' },
        def: { label: 'Defender'   },
        mid: { label: 'Midfielder' },
        fwd: { label: 'Forward'    },
    },

    defaultState: {
        photoScale: 110,
        photoY:     1200,
        photoX:     0,
        bgVariant:  'orange',
        position:   'mid',
        name:       'YOUR NAME',
        date:       '1-1-2000',
        height:     '1,75',
        weight:     '70',
        debut:      '2022',
        code:       'ARG',
        cBg:        '#E35205',
        c2:         null,
        c6:         null,
        cCosito:    null,
        club:       '',
    },

    bgVariants: {
        orange: { label: 'Orange', hex: '#E35205', src: '/frontend/assets/qatar22/fondonaranja.png' },
        blue:   { label: 'Blue', hex: '#62579f',   src: '/frontend/assets/qatar22/fondoazul.png'    },
    },

    layerFiles: [
        { id: 'bg-orange', src: '/frontend/assets/qatar22/fondonaranja.png' },
        { id: 'bg-blue',   src: '/frontend/assets/qatar22/fondoazul.png'    },
        { id: 'pos-gk',    src: '/frontend/assets/qatar22/arquero.png'      },
        { id: 'pos-def',   src: '/frontend/assets/qatar22/defensa.png'      },
        { id: 'pos-mid',   src: '/frontend/assets/qatar22/medio.png'        },
        { id: 'pos-fwd',   src: '/frontend/assets/qatar22/delantero.png'    },
        { id: 'q-capa1',   src: '/frontend/assets/qatar22/abajo.png'        },
        { id: 'q-capa2',   src: '/frontend/assets/qatar22/logo.png'         },
        { id: 'q-capa3',   src: '/frontend/assets/qatar22/peso.png'         },
        { id: 'q-capa4',   src: '/frontend/assets/qatar22/altura.png'       },
        { id: 'q-capa5', src: '/frontend/assets/qatar22/abajotap.png' },
        { id: 'q-capa6', src: '/frontend/assets/qatar22/abajotap2.png' },
    ],

    buildTints(_imgs, _state) {
        return {};
    },

    draw(ctx, state, imgs, _tints, photo, flagImg) {
        const W = 2994, H = 3960;

        ctx.clearRect(0, 0, W, H);
        ctx.save();

        const bgKey = state.bgVariant === 'blue' ? 'bg-blue' : 'bg-orange';
        if (imgs[bgKey]) {
            ctx.drawImage(imgs[bgKey], 0, 0, W, H);
        } else {
            ctx.fillStyle = state.bgVariant === 'blue' ? '#003087' : '#E35205';
            ctx.fillRect(0, 0, W, H);
        }

        if (photo) {
            const sc = state.photoScale / 20;
            const pw = photo.width  * sc;
            const ph = photo.height * sc;
            const px = (W - pw) / 2 + state.photoX;
            const py = state.photoY;

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(0, 0, W, H, 20);
            ctx.clip();
            ctx.save();

            ctx.shadowColor = 'rgba(0, 0, 0, 55)';
            ctx.shadowBlur = 10;                  
            ctx.shadowOffsetX = 112;               
            ctx.shadowOffsetY = 70;
            ctx.drawImage(photo, px, py, pw, ph);
            ctx.restore();

            const outlineSize = 22;
            const offsets = [
                [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]
            ];

            const tmpC = document.createElement('canvas');
            tmpC.width = W; tmpC.height = H;
            const tmpX = tmpC.getContext('2d');

            offsets.forEach(([ox, oy]) => {
                tmpX.drawImage(photo, px + (ox * outlineSize), py + (oy * outlineSize), pw, ph);
            });

            tmpX.globalCompositeOperation = 'source-in';
            tmpX.fillStyle = '#ffffff';
            tmpX.fillRect(0, 0, W, H);

            ctx.drawImage(tmpC, 0, 0);

            ctx.drawImage(photo, px, py, pw, ph);

            ctx.restore();
        }

        const posKey = `pos-${state.position || 'mid'}`;
        if (imgs[posKey]) ctx.drawImage(imgs[posKey], 0, 0, W, H);
        if (state.bgVariant === "orange") {
            if (imgs['q-capa6']) {
                ctx.drawImage(imgs['q-capa6'], 0, 0, W, H);
            } else {
                console.warn("La imagen q-capa6 no existe en el objeto imgs");
            }
        } else {
            if (imgs['q-capa5']) {
                ctx.drawImage(imgs['q-capa5'], 0, 0, W, H);
            } else {
                console.warn("La imagen q-capa5 no existe en el objeto imgs");
            }
        }
        if (imgs['q-capa1']) ctx.drawImage(imgs['q-capa1'], 0, 0, W, H);
        if (imgs['q-capa2']) ctx.drawImage(imgs['q-capa2'], 0, 0, W, H);
        if (imgs['q-capa3']) ctx.drawImage(imgs['q-capa3'], 0, 0, W, H);
        if (imgs['q-capa4']) ctx.drawImage(imgs['q-capa4'], 0, 0, W, H);

        if (flagImg) ctx.drawImage(flagImg, 0, 0, W, H);

        ctx.save();
        ctx.textAlign = 'center';
        const cx = W / 2;
        const FONT = '"FuentePersonalizadaQatar", "Barlow Condensed", sans-serif';

        ctx.font = `235px ${FONT}`;
        ctx.fillStyle = '#843340';
        ctx.fillText(state.name.toUpperCase(), cx, 3548.09, 2834);

        ctx.font = `600 120px ${FONT}`;
        ctx.fillStyle = '#e5dfd9';
        ctx.fillText(state.date, cx, 3771, W - 200);

        ctx.font = `150px ${FONT}`;
        ctx.fillStyle = '#e5dfd9';
        ctx.fillText(state.height, 2423.5, 1539, W - 200);

        ctx.font = `150px ${FONT}`;
        ctx.fillStyle = '#e5dfd9';
        ctx.fillText(state.weight, 2721, 1539, W - 200);

        ctx.font = `150px ${FONT}`;
        ctx.fillStyle = '#e5dfd9';
        ctx.fillText(state.debut || '', 2576, 991, W - 200);

        ctx.restore();
        ctx.restore();
    },

    renderControls(state) {
        const bgOpts = Object.entries(this.bgVariants).map(([key, v]) => `
            <button class="q-bg-btn${state.bgVariant === key ? ' active' : ''}" data-bg="${key}"
                    style="background:${v.hex}">
                ${v.label}
            </button>`).join('');

        const posOpts = Object.entries(this.positions).map(([key, v]) => `
            <button class="q-pos-btn${state.position === key ? ' active' : ''}" data-pos="${key}">
                ${v.label}
            </button>`).join('');

        return `
        <div class="card card--qatar-bg edition-controls" data-card-num="02">
            <h3>Background</h3>
            <div class="q-btn-row">${bgOpts}</div>
        </div>
        <div class="card card--qatar-pos edition-controls" data-card-num="03">
            <h3>Position</h3>
            <div class="q-btn-row q-pos-row">${posOpts}</div>
        </div>
        <div class="card edition-controls" data-card-num="05">
            <h3>Debut</h3>
            <div class="frow">
                <label for="tDebut">Debut year</label>
                <input type="number" id="tDebut" value="${state.debut || 2022}"
                       min="1900" max="2030" placeholder="2022"
                       aria-label="Professional debut year">
            </div>
        </div>`;
    },

    bindControls(state, onUpdate) {
        document.querySelectorAll('.q-bg-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.bgVariant = btn.dataset.bg;
                state.cBg = this.bgVariants[state.bgVariant].hex;
                document.querySelectorAll('.q-bg-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                onUpdate('draw');
            });
        });

        document.querySelectorAll('.q-pos-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.position = btn.dataset.pos;
                document.querySelectorAll('.q-pos-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                onUpdate('draw');
            });
        });

        const debutEl = document.getElementById('tDebut');
        if (debutEl) {
            debutEl.addEventListener('input', e => {
                state.debut = e.target.value;
                onUpdate('draw');
            });
        }
    },
};
