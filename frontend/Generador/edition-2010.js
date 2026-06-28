const Edition2010 = {

    id: 'edition-2010',
    name: 'Sudáfrica 2010',
    downloadSuffix: '2010',

    canvasW: 2985,
    canvasH: 3840,

    flagsPath: '/frontend/assets/flags/flags2010/',
    flagsSvgPath: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/flags/4x3/',
    miniflagsPath: '/frontend/assets/flags/miniflags/',

    theme: {
        '--theme-primary':    '#D71920',
        '--theme-accent':     '#F39200',
        '--theme-accent2':    '#FFF200',
        '--theme-card-top':   '#D71920',
        '--theme-tab-active': '#D71920',
        '--theme-rainbow':    'linear-gradient(to right, #D71920 0% 25%, #F39200 25% 50%, #FFF200 50% 75%, #009640 75% 100%)',
        '--theme-how-to-bg':  'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0)), linear-gradient(135deg, #D71920, #F39200)',
        '--theme-bg-body':    '#fff8f0',
        '--theme-header-txt': '#D71920',
    },

    groups: {
        A: [
            { code: 'RSA', name: 'Sudáfrica'      },
            { code: 'MEX', name: 'México'         },
            { code: 'URU', name: 'Uruguay'        },
            { code: 'FRA', name: 'Francia'        },
        ],
        B: [
            { code: 'ARG', name: 'Argentina'      },
            { code: 'NGA', name: 'Nigeria'        },
            { code: 'KOR', name: 'Corea del Sur'  },
            { code: 'GRE', name: 'Grecia'         },
        ],
        C: [
            { code: 'ENG', name: 'Inglaterra'     },
            { code: 'USA', name: 'EE.UU.'         },
            { code: 'ALG', name: 'Argelia'        },
            { code: 'SVN', name: 'Eslovenia'      },
        ],
        D: [
            { code: 'GER', name: 'Alemania'       },
            { code: 'AUS', name: 'Australia'      },
            { code: 'SRB', name: 'Serbia'         },
            { code: 'GHA', name: 'Ghana'          },
        ],
        E: [
            { code: 'NED', name: 'Países Bajos'   },
            { code: 'DEN', name: 'Dinamarca'      },
            { code: 'JPN', name: 'Japón'          },
            { code: 'CMR', name: 'Camerún'        },
        ],
        F: [
            { code: 'ITA', name: 'Italia'         },
            { code: 'NZL', name: 'Nueva Zelanda'  },
            { code: 'SVK', name: 'Eslovaquia'     },
            { code: 'PAR', name: 'Paraguay'       },
        ],
        G: [
            { code: 'BRA', name: 'Brasil'         },
            { code: 'PRK', name: 'Corea del Norte'},
            { code: 'CIV', name: 'Costa de Marfil'},
            { code: 'POR', name: 'Portugal'       },
        ],
        H: [
            { code: 'ESP', name: 'España'         },
            { code: 'CHI', name: 'Chile'          },
            { code: 'SUI', name: 'Suiza'          },
            { code: 'HON', name: 'Honduras'       },
        ],
    },

    defaultState: {
        photoScale: 110,
        photoY:     -80,
        photoX:     0,
        cJugador:   '#75AADB',
        cBandera:   '#000000',
        cTextPais:  '#ffffff',
        cTextNombre:'#ffffff',
        name:       'YOUR NAME',
        code:       'ARG',
    },

    // Recorte de bandera: círculo derivado de la <ellipse id="path1"> real y
    // visible en marcoBandera.svg. Coordenadas EN EL VIEWBOX ORIGINAL del SVG
    // (789.78123 x 1016) — _clipFlagShape/_drawFlag son las que escalan esto
    // a coordenadas del canvas (2985x3840). No re-escalar acá.
    flagSlot: { cx: 91.050713, cy: 887.68988, r: 46.6 },

    layerFiles: [
        { id: 'marcoBlanco',    src: '/frontend/assets/svg/2010/marcoBlanco.webp'   },
        { id: 'marcoJugador',   src: '/frontend/assets/svg/2010/marcoJugador.svg'   },
        { id: 'fondo',          src: '/frontend/assets/svg/2010/fondo.webp'         },
        { id: 'marcoBandera',   src: '/frontend/assets/svg/2010/marcoBandera.svg'   },
        { id: 'paisabajo',      src: '/frontend/assets/svg/2010/paisabajo.svg'      },
        { id: 'nonmbreAbajo',   src: '/frontend/assets/svg/2010/nonmbreAbajo.svg'   },
        { id: 'logo',           src: '/frontend/assets/svg/2010/logofifa.svg'       },
    ],

    buildTints(imgs, state) {
        const W = 2985, H = 3840;

        const tint = (src, hex) => {
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

        const jugador = state.cJugador || '#75AADB';
        const bandera = state.cBandera || '#000000';

        return {
            marcoJugador: tint(imgs.marcoJugador, jugador),
            marcoBandera: tint(imgs.marcoBandera, bandera),
            paisabajo:    tint(imgs.paisabajo,    bandera),
            nonmbreAbajo: tint(imgs.nonmbreAbajo, jugador),
        };
    },

    _clipFlagShape(ctx, W, H) {
        const sx = W / 789.78123;
        const sy = H / 1016;
        const { cx, cy, r } = this.flagSlot;
        ctx.beginPath();
        // Usamos un único factor de escala uniforme (promedio) para que el
        // círculo no se deforme en una elipse al escalar X e Y por separado.
        const s = (sx + sy) / 2;
        ctx.ellipse(cx * sx, cy * sy, r * s, r * s, 0, 0, Math.PI * 2);
        ctx.closePath();
    },

    _drawFlag(ctx, state, flagImg, W, H) {
        if (!flagImg) return;

        const { cx: CX, cy: CY, r: R } = this.flagSlot;
        const sx = W / 789.78123;
        const sy = H / 1016;
        const s = (sx + sy) / 2;
        const FCX = CX * sx, FCY = CY * sy, FR = R * s;
        const FX = FCX - FR, FY = FCY - FR, FW = FR * 2, FH = FR * 2;

        const fw = flagImg.naturalWidth  || flagImg.width  || FW;
        const fh = flagImg.naturalHeight || flagImg.height || FH;

        ctx.save();
        this._clipFlagShape(ctx, W, H);
        ctx.clip();

        if (state.code === 'BRA') {
            ctx.fillStyle = '#009C3B';
            ctx.fillRect(FX, FY, FW, FH);
            const scale = Math.min(FW / fw, FH / fh);
            const dw = fw * scale;
            const dh = fh * scale;
            ctx.drawImage(flagImg, FX + (FW - dw) / 2, FY + (FH - dh) / 2, dw, dh);
        } else {
            const scale = Math.max(FW / fw, FH / fh);
            const dw = fw * scale;
            const dh = fh * scale;
            ctx.drawImage(flagImg, FX + (FW - dw) / 2, FY + (FH - dh) / 2, dw, dh);
        }
        ctx.restore();
    },

    draw(ctx, state, imgs, tints, photo, flagImg) {
        const W = 2985, H = 3840;
        const FONT = '"Fuente2010", "Barlow Condensed", sans-serif';

        ctx.clearRect(0, 0, W, H);
        ctx.save();

        if (imgs.fondo) {
            ctx.drawImage(imgs.fondo, 0, 0, W, H);
        } else {
            ctx.fillStyle = '#D71920';
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

        if (imgs.marcoBlanco) {
            ctx.drawImage(imgs.marcoBlanco, 0, 0, W, H);
        }

        if (tints.marcoJugador) {
            ctx.drawImage(tints.marcoJugador, 0, 0, W, H);
        } else if (imgs.marcoJugador) {
            ctx.drawImage(imgs.marcoJugador, 0, 0, W, H);
        }
        this._drawFlag(ctx, state, flagImg, W, H);
        if (tints.marcoBandera) {
            ctx.drawImage(tints.marcoBandera, 0, 0, W, H);
        } else if (imgs.marcoBandera) {
            ctx.drawImage(imgs.marcoBandera, 0, 0, W, H);
        }

        if (tints.paisabajo) {
            ctx.drawImage(tints.paisabajo, 0, 0, W, H);
        } else if (imgs.paisabajo) {
            ctx.drawImage(imgs.paisabajo, 0, 0, W, H);
        }

        ctx.save();
        ctx.font = `bold 120px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = state.cTextPais || '#ffffff';
        ctx.fillText(state.code.toUpperCase().slice(0, 3), 355, 3620, 3560);
        ctx.restore();

        if (tints.nonmbreAbajo) {
            ctx.drawImage(tints.nonmbreAbajo, 0, 0, W, H);
        } else if (imgs.nonmbreAbajo) {
            ctx.drawImage(imgs.nonmbreAbajo, 0, 0, W, H);
        }

        ctx.save();
        const cx = 2985 / 2
        ctx.font = `bold 125px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = state.cTextNombre || '#ffffff';
        ctx.fillText(state.name.toUpperCase(), cx, 3650, 1750);
        ctx.restore();

        if (imgs.logo) {
            ctx.drawImage(imgs.logo, 0, 0, W, H);
        }
        ctx.restore();
    },

    renderControls(state) {
        return `
        <div class="card edition-controls card--2010-color" data-card-num="02">
            <h3>Colores figurita</h3>
            <div class="crow" style="gap:10px;align-items:center;">
                <label for="cJugador" style="min-width:110px;font-size:12px;">Marco jugador</label>
                <input type="color" id="cJugador" value="${state.cJugador || '#F39200'}">
            </div>
            <div class="crow" style="gap:10px;align-items:center;">
                <label for="cBandera" style="min-width:110px;font-size:12px;">Marco bandera</label>
                <input type="color" id="cBandera" value="${state.cBandera || '#0055A5'}">
            </div>
            <div class="crow" style="gap:10px;align-items:center;">
                <label for="cTextPais" style="min-width:110px;font-size:12px;">Texto país</label>
                <input type="color" id="cTextPais" value="${state.cTextPais || '#ffffff'}">
            </div>
            <div class="crow" style="gap:10px;align-items:center;">
                <label for="cTextNombre" style="min-width:110px;font-size:12px;">Texto nombre</label>
                <input type="color" id="cTextNombre" value="${state.cTextNombre || '#ffffff'}">
            </div>
        </div>`;
    },

    bindControls(state, onUpdate) {
        const cJugador = document.getElementById('cJugador');
        if (cJugador) {
            cJugador.addEventListener('input', e => {
                state.cJugador = e.target.value;
                onUpdate('tints');
            });
        }
        const cBandera = document.getElementById('cBandera');
        if (cBandera) {
            cBandera.addEventListener('input', e => {
                state.cBandera = e.target.value;
                onUpdate('tints');
            });
        }
        const cTextPais = document.getElementById('cTextPais');
        if (cTextPais) {
            cTextPais.addEventListener('input', e => {
                state.cTextPais = e.target.value;
                onUpdate('draw');
            });
        }
        const cTextNombre = document.getElementById('cTextNombre');
        if (cTextNombre) {
            cTextNombre.addEventListener('input', e => {
                state.cTextNombre = e.target.value;
                onUpdate('draw');
            });
        }
    },
};
