const EditionExtraCard = {

    id: 'edition-extracard',
    name: 'Extra Card',
    downloadSuffix: 'extracard',

    canvasW: 2994,
    canvasH: 3960,

    flagsPath: '/frontend/assets/flags/extraflags/',
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
    },

    defaultState: {
        photoScale: 110,
        photoY: 1200,
        photoX: 0,
        rareza: 'com',
        name: 'YOUR NAME',
        code: 'ARG',
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
        { id: 'fifa', src: '/frontend/assets/extracard/fifa.png' },
        { id: 'rectangulo', src: '/frontend/assets/extracard/rectangulo.png' },
        { id: 'marco', src: '/frontend/assets/extracard/marco.png' },
    ],

    buildTints(_imgs, _state) {
        return {};
    },

    draw(ctx, state, imgs, _tints, photo, flagImg) {
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

        if (flagImg) ctx.drawImage(flagImg, 0, 0, W, H);

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
        if (imgs['fifa']) ctx.drawImage(imgs['fifa'], 0, 0, W, H);
        if (imgs['rectangulo']) ctx.drawImage(imgs['rectangulo'], 0, 0, W, H);
        if (imgs['marco']) ctx.drawImage(imgs['marco'], 0, 0, W, H);

        ctx.save();
        ctx.textAlign = 'center';
        const cx = W / 2;
        const FONT = '"FuentePersonalizadaAA", "Barlow Condensed", sans-serif';

        ctx.font = `215px ${FONT}`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(state.name.toUpperCase(), cx, 3664, 2538);
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

        return `
        <div class="card card--blue edition-controls" data-card-num="02">
            <h3>Rarity</h3>
            <div class="q-btn-row q-pos-row">${bgOpts}</div>
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
    },
};