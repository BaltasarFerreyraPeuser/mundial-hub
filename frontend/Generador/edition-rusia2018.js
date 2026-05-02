const EditionRusia2018 = {

    id: 'edition-2018',
    name: 'Mundial 2018',
    downloadSuffix: '2018',

    flagsPath: '/frontend/assets/flags/rusiaflags/',
    miniflagsPath: '/frontend/assets/flags/miniflags/',

    canvasW: 2994,
    canvasH: 3960,

    theme: {
        '--theme-primary':    '#7b1427',
        '--theme-accent':     '#c8102e',
        '--theme-accent2':    '#8b0000',
        '--theme-card-top':   '#7b1427',
        '--theme-tab-active': '#7b1427',
        '--theme-rainbow':    'linear-gradient(to right, #003087 0% 33%, #ffffff 33% 66%, #c8102e 66% 100%)',
        '--theme-how-to-bg':  'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0)), linear-gradient(135deg, #7b1427, #c8102e)',
        '--theme-bg-body':    '#f5f0ee',
        '--theme-header-txt': '#7b1427',
    },

    groups: {
        A: [
            { code: 'RUS', name: 'Rusia'              },
            { code: 'KSA', name: 'Arabia Saudita'     },
            { code: 'EGY', name: 'Egipto'             },
            { code: 'URU', name: 'Uruguay'            },
        ],
        B: [
            { code: 'POR', name: 'Portugal'           },
            { code: 'ESP', name: 'España'             },
            { code: 'MAR', name: 'Marruecos'          },
            { code: 'IRN', name: 'Irán'               },
        ],
        C: [
            { code: 'FRA', name: 'Francia'            },
            { code: 'AUS', name: 'Australia'          },
            { code: 'PER', name: 'Perú'               },
            { code: 'DEN', name: 'Dinamarca'          },
        ],
        D: [
            { code: 'ARG', name: 'Argentina'          },
            { code: 'ISL', name: 'Islandia'           },
            { code: 'CRO', name: 'Croacia'            },
            { code: 'NGA', name: 'Nigeria'            },
        ],
        E: [
            { code: 'BRA', name: 'Brasil'             },
            { code: 'SUI', name: 'Suiza'              },
            { code: 'CRC', name: 'Costa Rica'         },
            { code: 'SRB', name: 'Serbia'             },
        ],
        F: [
            { code: 'GER', name: 'Alemania'           },
            { code: 'MEX', name: 'México'             },
            { code: 'SWE', name: 'Suecia'             },
            { code: 'KOR', name: 'República de Corea' },
        ],
        G: [
            { code: 'BEL', name: 'Bélgica'           },
            { code: 'PAN', name: 'Panamá'             },
            { code: 'TUN', name: 'Túnez'              },
            { code: 'ENG', name: 'Inglaterra'         },
        ],
        H: [
            { code: 'POL', name: 'Polonia'            },
            { code: 'SEN', name: 'Senegal'            },
            { code: 'COL', name: 'Colombia'           },
            { code: 'JPN', name: 'Japón'              },
        ],
    },

    positions: {
        gk:  { label: 'Goalkeeper', rectColor: '#003087' },
        def: { label: 'Defender',   rectColor: '#c8102e' },
        mid: { label: 'Midfielder', rectColor: '#7b1427' },
        fwd: { label: 'Forward',    rectColor: '#03a258' },
    },

    defaultState: {
        photoScale: 110,
        photoY:     -80,
        photoX:     0,
        cBg:        '#1a1a2e',
        marco1:     '#c8102e',
        position:   'mid',
        name:       'YOUR NAME',
        date:       '1-1-2000',
        height:     'm 1.75',
        weight:     'kg 70',
        club:       'MY CLUB',
        code:       'ARG',
        debut:      '2017',
        bgVariant:  null,
    },

    layerFiles: [
        { id: 'fondo',    src: '/frontend/assets/rusia18/fondo.png'      },
        { id: 'marco',    src: '/frontend/assets/rusia18/Marco.png'      },
        { id: 'marco1',   src: '/frontend/assets/rusia18/marco1.png'     },
        { id: 'logo',     src: '/frontend/assets/rusia18/logorusia.png'  },
        { id: 'posicion', src: '/frontend/assets/rusia18/posicion.png'   },
        { id: 'textos',   src: '/frontend/assets/rusia18/textos.png'     },
    ],

    buildTints(imgs, state) {
        const tint = (src, hex) => {
            if (!src || !hex) return null;
            const oc = document.createElement('canvas');
            oc.width = 2994; oc.height = 3960;
            const ox = oc.getContext('2d');
            ox.fillStyle = hex;
            ox.fillRect(0, 0, 2994, 3960);
            ox.globalCompositeOperation = 'destination-in';
            ox.drawImage(src, 0, 0, 2994, 3960);
            return oc;
        };
        const posColor = (this.positions[state.position] || this.positions.mid).rectColor;
        return {
            marco1:   tint(imgs.marco1,   state.marco1),
            posicion: tint(imgs.posicion, posColor),
        };
    },

    draw(ctx, state, imgs, tints, photo, flagImg) {
        const W = 2994, H = 3960;
        const FONT_nombre = '"Tahoma", "Barlow Condensed", sans-serif';
        const FONT_normal = '"FuenteRusia", "Barlow Condensed", sans-serif';

        ctx.clearRect(0, 0, W, H);
        ctx.save();

        ctx.fillStyle = state.cBg || '#1a1a2e';
        ctx.fillRect(0, 0, W, H);

        if (imgs['fondo']) ctx.drawImage(imgs['fondo'], 0, 0, W, H);

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

        if (tints.marco1) ctx.drawImage(tints.marco1, 0, 0, W, H);
        if (imgs['marco']) ctx.drawImage(imgs['marco'], 0, 0, W, H);
        if (tints.posicion) ctx.drawImage(tints.posicion, 0, 0, W, H);
        if (imgs['logo']) ctx.drawImage(imgs['logo'], 0, 0, W, H);
        if (imgs['textos']) ctx.drawImage(imgs['textos'], 0, 0, W, H);
        if (flagImg) ctx.drawImage(flagImg, 0, 0, W, H);

        // --- PAIS CODE (FRA) ---
        ctx.save();
        ctx.font = `700 120px ${FONT_normal}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.lineWidth = 4;
        ctx.fillStyle = '#ffffff';
        const paisCode = state.code.toUpperCase().slice(0, 3);
        ctx.strokeText(paisCode, 2182, 2450);  // ← corregido
        ctx.fillText(paisCode, 2182, 2450);
        ctx.restore();

        // --- DEBUT ---
        ctx.save();
        ctx.font = `150px ${FONT_normal}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#e5dfd9';
        ctx.fillText(state.debut || '', 2204, 2170);  // ← corregido
        ctx.restore();

        // --- ALTURA ---
        ctx.save();
        ctx.font = `150px ${FONT_normal}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#e5dfd9';
        ctx.fillText(state.height, 691, 2450);  // ← corregido
        ctx.restore();

        // --- PESO ---
        ctx.save();
        ctx.font = `150px ${FONT_normal}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#e5dfd9';
        ctx.fillText(state.weight, 675, 2730);  // ← corregido
        ctx.restore();

        // --- NOMBRE ---
        ctx.save();
        ctx.font = `700 180px ${FONT_nombre}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#843340';
        ctx.fillText(state.name.toUpperCase(), 304, 1602, 467);  // ← corregido
        ctx.restore();

        // --- CLUB ---
        ctx.save();
        ctx.font = `600 120px ${FONT_normal}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#e5dfd9';
        ctx.fillText(state.club.toUpperCase(), 325, 1799, 509);  // ← corregido
        ctx.restore();

        ctx.restore();
    },

    renderControls(state) {
        const posOpts = Object.entries(this.positions).map(([key, v]) => `
            <button class="q-pos-btn${state.position === key ? ' active' : ''}"
                    data-pos="${key}"
                    style="--pos-color:${v.rectColor}">
                ${v.label}
            </button>`).join('');

        return `
        <div class="card card--rusia-color edition-controls" data-card-num="02">
            <h3>Colors</h3>
            <div class="crow">
                <label for="marco1">Marco</label>
                <input type="color" id="marco1" value="${state.marco1 || '#c8102e'}">
                <span>Color del marco</span>
            </div>
        </div>
        <div class="card card--rusia-pos edition-controls" data-card-num="03">
            <h3>Position</h3>
            <div class="q-btn-row q-pos-row">${posOpts}</div>
        </div>
        <div class="card card--rusia-debut edition-controls" data-card-num="05">
            <h3>Debut</h3>
            <div class="frow">
                <label for="tDebut">Debut year</label>
                <input type="number" id="tDebut" value="${state.debut || 2017}"
                       min="1900" max="2030" placeholder="2017"
                       aria-label="Professional debut year">
            </div>
        </div>`;
    },

    bindControls(state, onUpdate) {
        const cp = (id, key) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', e => { state[key] = e.target.value; onUpdate('tints'); });
        };
        cp('marco1', 'marco1');

        document.querySelectorAll('.q-pos-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.position = btn.dataset.pos;
                document.querySelectorAll('.q-pos-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                onUpdate('tints');
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
