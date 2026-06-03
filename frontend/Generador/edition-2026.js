const formatHeight = (value) => {
    let v = value.replace('.', ',').replace(/[^0-9,]/g, '');
    return v.slice(0, 4);
};

const formatWeight = (value) => {
    return value.replace(/\D/g, '').slice(0, 3);
};

const Edition2026 = {

    id: 'edition-2026',
    name: 'Mundial 2026',
    downloadSuffix: '2026',

    flagsPath: '/frontend/assets/flags/',
    flagsSvgPath: 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/flags/4x3/',

    theme: {
        '--theme-primary':    '#17277f',
        '--theme-accent':     '#43c4c9',
        '--theme-accent2':    '#e5ff00',
        '--theme-card-top':   '#17277f',
        '--theme-tab-active': '#17277f',
        '--theme-rainbow':    'linear-gradient(to right, #2651ff 0% 16.6%, #ea0001 16.6% 33.2%, #e5ff00 33.2% 49.8%, #6d00fc 49.8% 66.4%, #019afa 66.4% 83%, #00c93b 83% 100%)',
        '--theme-how-to-bg':  'linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0)), linear-gradient(135deg, #e5ff00, #019afa)',
        '--theme-bg-body':    '#ffffff',
        '--theme-header-txt': '#000000',
    },

    groups: {
        A: [
            { code: 'MEX', name: 'México' },
            { code: 'RSA', name: 'Sudáfrica' },
            { code: 'KOR', name: 'Corea del Sur' },
            { code: 'CZE', name: 'Chequia' },
        ],
        B: [
            { code: 'CAN', name: 'Canadá' },
            { code: 'BIH', name: 'Bosnia y Herzegovina' },
            { code: 'QAT', name: 'Qatar' },
            { code: 'SUI', name: 'Suiza' },
        ],
        C: [
            { code: 'BRA', name: 'Brasil' },
            { code: 'MAR', name: 'Marruecos' },
            { code: 'HAI', name: 'Haití' },
            { code: 'SCO', name: 'Escocia' },
        ],
        D: [
            { code: 'USA', name: 'Estados Unidos' },
            { code: 'PAR', name: 'Paraguay' },
            { code: 'AUS', name: 'Australia' },
            { code: 'TUR', name: 'Turquía' },
        ],
        E: [
            { code: 'GER', name: 'Alemania' },
            { code: 'CUW', name: 'Curazao' },
            { code: 'CIV', name: 'Costa de Marfil' },
            { code: 'ECU', name: 'Ecuador' },
        ],
        F: [
            { code: 'NED', name: 'Países Bajos' },
            { code: 'JPN', name: 'Japón' },
            { code: 'SWE', name: 'Suecia' },
            { code: 'TUN', name: 'Túnez' },
        ],
        G: [
            { code: 'BEL', name: 'Bélgica' },
            { code: 'EGY', name: 'Egipto' },
            { code: 'IRI', name: 'Irán' },
            { code: 'NZL', name: 'Nueva Zelanda' },
        ],
        H: [
            { code: 'ESP', name: 'España' },
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
            { code: 'ARG', name: 'Argentina'},
            { code: 'ALG', name: 'Argelia'},
            { code: 'AUT', name: 'Austria' },
            { code: 'JOR', name: 'Jordania' },
        ],
        K: [
            { code: 'POR', name: 'Portugal' },
            { code: 'COD', name: 'DR Congo' },
            { code: 'UZB', name: 'Uzbekistán' },
            { code: 'COL', name: 'Colombia' },
        ],
        L: [
            { code: 'ENG', name: 'Inglaterra' },
            { code: 'CRO', name: 'Croacia' },
            { code: 'GHA', name: 'Ghana' },
            { code: 'PAN', name: 'Panamá' },
        ],
        Extra: [
            { code: 'VEN', name: 'Venezuela' },
            { code: 'IRL', name: 'Irlanda' },
            { code: 'ITA', name: 'Italia' },
            { code: 'POL', name: 'Polonia' },
            { code: 'CHI', name: 'Chile' },
            { code: 'BOL', name: 'Bolivia' },
            { code: 'RUS', name: 'Rusia' },
            { code: 'CRC', name: 'Costa Rica' },
            { code: 'HON', name: 'Honduras'},
        ],
    },

    countryColors: {
        MEX: { c2: '#006847', c6: '#ce1126', cCosito: '#ffffff' },
        RSA: { c2: '#e1392d', c6: '#000c8a', cCosito: '#007847' },
        KOR: { c2: '#ffffff', c6: '#0047a0', cCosito: '#cd2e3a' },
        CZE: { c2: '#11457e', c6: '#ffffff', cCosito: '#d7141a' },
        CAN: { c2: '#d52b1e', c6: '#ffffff', cCosito: '#d45c54' },
        BIH: { c2: '#000099', c6: '#ffcc00', cCosito: '#5b7fd2' },
        QAT: { c2: '#ffffff', c6: '#8d1b3d', cCosito: '#b05e77' },
        SUI: { c2: '#ff0000', c6: '#ff0000', cCosito: '#ffffff' },
        BRA: { c2: '#229e45', c6: '#229e45', cCosito: '#f8e509' },
        MAR: { c2: '#c1272d', c6: '#c1272d', cCosito: '#0c5d32' },
        HAI: { c2: '#00209f', c6: '#d21034', cCosito: '#db768a' },
        SCO: { c2: '#0065bd', c6: '#0065bd', cCosito: '#ffffff' },
        USA: { c2: '#0065bd', c6: '#192f5d', cCosito: '#e4102b' },
        PAR: { c2: '#d52b1e', c6: '#0038a8', cCosito: '#ffffff' },
        AUS: { c2: '#00008b', c6: '#ffffff', cCosito: '#ff0000' },
        TUR: { c2: '#e30a17', c6: '#e30a17', cCosito: '#ffffff' },
        GER: { c2: '#000001', c6: '#ffcc00', cCosito: '#ff0000' },
        CUW: { c2: '#002b7f', c6: '#f9e814', cCosito: '#5f7fbf' },
        CIV: { c2: '#ff9a00', c6: '#00cd00', cCosito: '#ffffff' },
        ECU: { c2: '#ffe800', c6: '#da0010', cCosito: '#00148e' },
        NED: { c2: '#ae1c28', c6: '#21468b', cCosito: '#ffffff' },
        JPN: { c2: '#ffffff', c6: '#ffffff', cCosito: '#bc002d' },
        SWE: { c2: '#005293', c6: '#005293', cCosito: '#fecb00' },
        TUN: { c2: '#e70013', c6: '#e70013', cCosito: '#ffffff' },
        BEL: { c2: '#000001', c6: '#f31830', cCosito: '#ffd90c' },
        EGY: { c2: '#ce1126', c6: '#000001', cCosito: '#ffffff' },
        IRI: { c2: '#239f40', c6: '#da0000', cCosito: '#ffffff' },
        NZL: { c2: '#00247d', c6: '#c8102e', cCosito: '#385aa8' },
        ESP: { c2: '#aa151b', c6: '#f1bf00', cCosito: '#c64e50' },
        CPV: { c2: '#081873', c6: '#081873', cCosito: '#de3929' },
        KSA: { c2: '#165d31', c6: '#165d31', cCosito: '#ffffff' },
        URU: { c2: '#ffffff', c6: '#0038a8', cCosito: '#5777b7' },
        FRA: { c2: '#000091', c6: '#e1000f', cCosito: '#ffffff' },
        SEN: { c2: '#0b7226', c6: '#bc0000', cCosito: '#ffff00' },
        IRQ: { c2: '#ce1126', c6: '#000001', cCosito: '#ffffff' },
        NOR: { c2: '#ed2939', c6: '#002664', cCosito: '#ffffff' },
        ARG: { c2: '#74a9db', c6: '#ffffff', cCosito: '#9ab7dd' },
        ALG: { c2: '#006233', c6: '#ffffff', cCosito: '#d21034' },
        AUT: { c2: '#c8102e', c6: '#ffffff', cCosito: '#e86969' },
        JOR: { c2: '#000001', c6: '#009900', cCosito: '#ffffff' },
        POR: { c2: '#006600', c6: '#ff0000', cCosito: '#367335' },
        COD: { c2: '#007fff', c6: '#ce1021', cCosito: '#f7d618' },
        UZB: { c2: '#0099b5', c6: '#1eb53a', cCosito: '#ffffff' },
        COL: { c2: '#ffe800', c6: '#da0010', cCosito: '#00148e' },
        ENG: { c2: '#ffffff', c6: '#ffffff', cCosito: '#ce1124' },
        CRO: { c2: '#ff0000', c6: '#171796', cCosito: '#ffffff' },
        GHA: { c2: '#ce1126', c6: '#006b3f', cCosito: '#fcd116' },
        PAN: { c2: '#ffffff', c6: '#0000ab', cCosito: '#db0000' },
        IRL: { c2: '#009a49', c6: '#ff7900', cCosito: '#ffffff' },
        CRC: { c2: '#0000b4', c6: '#d90000', cCosito: '#ffffff' },
        HON: { c2: '#18c3df', c6: '#ffffff', cCosito: '#6dcedf' },
    },

    positions: {
        gk: { label: 'Goalkeeper', rectColor: '#79438e' },
        def: { label: 'Defender', rectColor: '#d22d4b' },
        mid: { label: 'Midfielder', rectColor: '#da6a2c' },
        fwd: { label: 'Forward', rectColor: '#007c8d' },
    },

    defaultState: {
        photoScale: 110,
        photoY:     -80,
        photoX:     null,  
        cBg:        '#65c8c9',
        useGoldBg: false,
        c2: '#74a9db', c6: '#ffffff', cCosito: '#9ab7dd',
        position:   'mid',
        name: 'NAME',
        apellido: 'LASTNAME',
        day: '1',
        month: '1',
        year: '2000',
        height:     '1.75',
        weight:     '70',
        club:       'MY CLUB',
        code:       'ARG',
        bgVariant:  null,
        showShirt:  true,
        shirtY:     0,
    },

    layerFiles: [
        { id: 'gold',      src: '/frontend/assets/fondogold.webp'    },
        { id: 'marcogold', src: '/frontend/assets/marcogold.webp'    },
        { id: 'num2',      src: '/frontend/assets/svg/2.svg'        },
        { id: 'num6',      src: '/frontend/assets/svg/6.svg'        },
        { id: 'marco', src: '/frontend/assets/svg/marco.svg' },
        { id: 'marcobandera', src: '/frontend/assets/svg/marcobandera.svg' },
        { id: 'marco6',    src: '/frontend/assets/svg/marco6.svg'   },
        { id: 'cosito',    src: '/frontend/assets/svg/medio.svg'    },
        { id: 'rectA',     src: '/frontend/assets/svg/rectAR.svg'   },
        { id: 'rectB',     src: '/frontend/assets/svg/rectAB.svg'   },
        { id: 'fifa',      src: '/frontend/assets/svg/logofifa.svg' },
        { id: 'panini',    src: '/frontend/assets/svg/panini.svg'   },
    ],

    buildTints(imgs, state) {
        const tint = (src, hex) => {
            if (!src) return null;
            const oc = document.createElement('canvas');
            oc.width = 2895; oc.height = 3840;
            const ox = oc.getContext('2d');
            ox.fillStyle = hex;
            ox.fillRect(0, 0, 2895, 3840);
            ox.globalCompositeOperation = 'destination-in';
            ox.drawImage(src, 0, 0, 2895, 3840);
            return oc;
        };
        const posColor = (this.positions[state.position] || this.positions.mid).rectColor;
        return {
            num2:   tint(imgs.num2,   state.c2),
            num6:   tint(imgs.num6,   state.c6),
            cosito: tint(imgs.cosito, state.cCosito),
            marco:  tint(imgs.marco,  state.cBg),
            marco6: tint(imgs.marco6, state.c6),
            rectA:  tint(imgs.rectA,  posColor),
            rectB: tint(imgs.rectB, posColor),
            marcobandera: tint(imgs.marcobandera, '#ffffff'),
        };
    },
    draw(ctx, state, imgs, tints, photo, flagImg) {
        const W = 2895, H = 3840;
        const FONT_NOMBRE = '"FuentePersonalizadaA"';
        const FONT_NACI = "'FuenteNacimiento'";
        const FONT_APELLIDO = '"FuentePersonalizadaAA", "Barlow Condensed", sans-serif';
        const FONT_PAIS  = '"FuentePersonalizada",   "Barlow Condensed", sans-serif';
        ctx.clearRect(0, 0, W, H);
        ctx.save();

        ctx.fillStyle = state.cBg;
        ctx.fillRect(0, 0, W, H);

        if (state.useGoldBg && imgs['gold']) {
            ctx.drawImage(imgs['gold'], 0, 0, W, H);
        }

        if (tints.num2)   ctx.drawImage(tints.num2,   0, 0, W, H);
        if (tints.num6)   ctx.drawImage(tints.num6, 0, 0, W, H);
        if (tints.cosito) ctx.drawImage(tints.cosito, 0, 0, W, H);

        if (photo) {
            const sc = state.photoScale / 40;
            const pw = photo.width  * sc;
            const ph = photo.height * sc;
            const px = state.photoX !== null ? state.photoX : (W - pw) / 2;
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(0, 0, W, H, 14);
            ctx.clip();
            ctx.drawImage(photo, px, state.photoY, pw, ph);
            ctx.restore();
        }

        if (state.showShirt && imgs['shirt']) {
            ctx.drawImage(imgs['shirt'], 0, state.shirtY || 0, W, H);
        }

        if (tints.marco) ctx.drawImage(tints.marco, 0, 0, W, H);

        if (state.useGoldBg && imgs['marcogold']) {
            ctx.drawImage(imgs['marcogold'], 0, 0, W, H);
        }
        if (tints.marco6) ctx.drawImage(tints.marco6, 0, 0, W, H);
        if (typeof drawFlagInMarco === 'function') {
            drawFlagInMarco(ctx, flagImg);
        } else if (flagImg) {
            ctx.drawImage(flagImg, 45, 78, W, H);
        }
        if (tints.marcobandera) ctx.drawImage(tints.marcobandera, 0, 0, W, H);
        ctx.save();
        state.code.toUpperCase().slice(0, 3).split('').forEach((l, i) => {
            ctx.font         = `690px ${FONT_PAIS}`;
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle    = 'transparent';
            ctx.strokeStyle  = 'rgba(255,255,255,1)';
            ctx.lineWidth    = 17.00;
            ctx.strokeText(l, W - 380, 2870 + i * 305);
            ctx.fillText(l, W - 380, 2870 + i * 305);
        });
        ctx.restore();

        if (tints.rectA) ctx.drawImage(tints.rectA, 0, 0, W, H);

        if (tints.rectB) ctx.drawImage(tints.rectB, 0, 0, W, H);

        if (imgs.fifa)   ctx.drawImage(imgs.fifa,   2220,  235,  585, 827);
        if (imgs.panini) ctx.drawImage(imgs.panini, 1985, 3523,  706,  167);

        const cleanDate = `${state.day}-${state.month}-${state.year}`;
        const cleanHeight = formatHeight(state.height);
        const cleanWeight = formatWeight(state.weight);

        ctx.save();
        const cx = 211 + 2022 / 2;
        const MAX_NAME_W = 1850;

        ctx.font = `180px ${FONT_NOMBRE}`;
        const nameWidth = ctx.measureText(state.name.toUpperCase() + ' ').width * 0.80;
        ctx.font = `180px ${FONT_APELLIDO}`;
        const apellidoWidth = ctx.measureText(state.apellido.toUpperCase()).width * 1.15;
        const totalWidth = nameWidth + apellidoWidth;

        const compress = totalWidth > MAX_NAME_W ? MAX_NAME_W / totalWidth : 1;
        const nameW_final = nameWidth * compress;
        const apellidoW_final = apellidoWidth * compress;
        const startX = cx - (nameW_final + apellidoW_final) / 2;

        // Nombre
        ctx.save();
        ctx.translate(startX, H - 545);
        ctx.scale(0.80 * compress, 1);
        ctx.textAlign = 'left';
        ctx.font = `180px ${FONT_NOMBRE}`;
        ctx.fillStyle = '#fff';
        ctx.fillText(state.name.toUpperCase() + ' ', 0, 0);
        ctx.restore();

        // Apellido
        ctx.save();
        ctx.translate(startX + nameW_final, H - 545);
        ctx.scale(1.15 * compress, 1);
        ctx.textAlign = 'left';
        ctx.font = `180px ${FONT_APELLIDO}`;
        ctx.fillStyle = '#fff';
        ctx.fillText(state.apellido.toUpperCase(), 0, 0);
        ctx.restore();

        ctx.restore();
        //Naci
        ctx.save();
        ctx.textAlign = 'center';
        const cx2 = 211 + 2022 / 2
        ctx.font = `88px ${FONT_NACI}`;
        ctx.fillStyle = '#fff';
        ctx.translate(cx2, H - 400);
        ctx.scale(1, 1.35);
        ctx.fillText(`${cleanDate}  |  ${cleanHeight} m  |  ${cleanWeight} kg`, 0, 0, 2040);
        ctx.restore();
        //Club
        ctx.save();
        ctx.textAlign = 'center';
        ctx.font = `115px ${FONT_NOMBRE}`;
        ctx.fillStyle = '#fff';
        ctx.translate(211 + 1734 / 2, H - 190);
        ctx.scale(1, 1.15);
        ctx.fillText(state.club.toUpperCase(), 0, 0, 1760);
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
        <div class="card card--blue edition-controls" data-card-num="02">
            <h3>Colors</h3>
            <div class="crow">
                <label for="cBg">Background</label>
                <input type="color" id="cBg" value="${state.cBg}" ${state.useGoldBg ? 'disabled' : ''}>
                <span>Background color</span>
            </div>
            <div class="crow">
                <label for="useGoldBg">Gold</label>
                <label class="toggle-switch">
                    <input type="checkbox" id="useGoldBg" ${state.useGoldBg ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
                <span>Gold background</span>
            </div>
            <div class="crow">
                <label for="c2">Number 2</label>
                <input type="color" id="c2" value="${state.c2}">
                <span>Color of the 2</span>
            </div>
            <div class="crow">
                <label for="c6">Number 6</label>
                <input type="color" id="c6" value="${state.c6}">
                <span>Color of the 6</span>
            </div>
            <div class="crow">
                <label for="cCosito">Middle</label>
                <input type="color" id="cCosito" value="${state.cCosito}">
                <span>Middle color</span>
            </div>
            <div class="crow">
                <label for="showShirt">Shirt</label>
                <label class="toggle-switch">
                    <input type="checkbox" id="showShirt" ${state.showShirt ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
                <span>Show country shirt</span>
            </div>
            <div class="crow" id="shirtYRow" style="${state.showShirt ? '' : 'display:none'}">
                <label for="sShirtY">Shirt Y</label>
                <input type="range" id="sShirtY" min="-500" max="500" step="1" value="${state.shirtY || 0}">
                <span id="vShirtY">${state.shirtY || 0}</span>
            </div>
        </div>
        <div class="card card--red edition-controls" data-card-num="03">
            <h3>Position</h3>
            <div class="q-btn-row q-pos-row">${posOpts}</div>
        </div>`;
    },

    bindControls(state, onUpdate) {
        const cp = (id, key) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', e => { state[key] = e.target.value; onUpdate('tints'); });
        };
        cp('cBg', 'cBg'); cp('c2', 'c2'); cp('c6', 'c6'); cp('cCosito', 'cCosito');

        const goldEl = document.getElementById('useGoldBg');
        if (goldEl) {
            goldEl.addEventListener('change', e => {
                state.useGoldBg = e.target.checked;
                const cBgInput = document.getElementById('cBg');
                if (cBgInput) cBgInput.disabled = e.target.checked;
                onUpdate('draw');
            });
        }

        ['inDay', 'inMonth', 'inYear'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', e => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (id === 'inDay') state.day = val.slice(0, 2);
                    if (id === 'inMonth') state.month = val.slice(0, 2);
                    if (id === 'inYear') state.year = val.slice(0, 4);

                    e.target.value = (id === 'inYear') ? state.year : (id === 'inDay' ? state.day : state.month);
                    onUpdate('draw');
                });
            }
        });

        const shirtEl = document.getElementById('showShirt');
        if (shirtEl) {
            shirtEl.addEventListener('change', e => {
                state.showShirt = e.target.checked;
                const row = document.getElementById('shirtYRow');
                if (row) row.style.display = e.target.checked ? '' : 'none';
                if (e.target.checked && imgs && imgs['shirt'] && typeof ShirtAlign !== 'undefined') {
                    const photoEl = typeof photo !== 'undefined' ? photo : null;
                    if (photoEl && state._photoBounds) {
                        ShirtAlign.align(photoEl, imgs['shirt'], state, onUpdate);
                    } else {
                        ShirtAlign.alignShirt(imgs['shirt'], state, onUpdate);
                    }
                } else {
                    onUpdate('draw');
                }
            });
        }

        const shirtYEl = document.getElementById('sShirtY');
        if (shirtYEl) {
            shirtYEl.addEventListener('input', e => {
                state.shirtY = parseInt(e.target.value);
                const vEl = document.getElementById('vShirtY');
                if (vEl) vEl.textContent = e.target.value;
                onUpdate('draw');
            });
        }

        document.querySelectorAll('.q-pos-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.position = btn.dataset.pos;
                document.querySelectorAll('.q-pos-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                onUpdate('tints');
            });
        });
    },
};
