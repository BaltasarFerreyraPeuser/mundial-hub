const W = 1650;
const H = 2310;

let optimizedPhoto = null;
const tintCache = { num2: null, num6: null, cosito: null, marco: null, marco6: null };
let needsDraw = true;

const canvas = document.getElementById('cv');
const ctx = canvas.getContext('2d');

const customFont = new FontFace('FuentePersonalizada', 'url(../assets/fonts/fuente.otf)');
const customFont2 = new FontFace('FuentePersonalizadaA', 'url(../assets/fonts/fuente2.ttf)');
const customFont3 = new FontFace('FuentePersonalizadaAA', 'url(../assets/fonts/fuente3.ttf)');
Promise.all([customFont.load(), customFont2.load(), customFont3.load()])
    .then(fonts => { fonts.forEach(f => document.fonts.add(f)); draw(); })
    .catch(() => draw());

const FONT_NOMBRE = '"FuentePersonalizadaA",  "Barlow Condensed", sans-serif';
const FONT_RESTO = '"FuentePersonalizadaAA", "Barlow Condensed", sans-serif';
const FONT_PAIS = '"FuentePersonalizada",   "Barlow Condensed", sans-serif';

const GROUPS = {
    A: [
        { code: 'MEX', name: 'México', flag: '🇲🇽' },
        { code: 'RSA', name: 'Sudáfrica', flag: '🇿🇦' },
        { code: 'KOR', name: 'Corea del Sur', flag: '🇰🇷' },
        { code: 'CZE', name: 'Rep. Checa', flag: '🇨🇿' },
    ],
    B: [
        { code: 'CAN', name: 'Canadá', flag: '🇨🇦' },
        { code: 'BIH', name: 'Bosnia', flag: '🇧🇦' },
        { code: 'QAT', name: 'Qatar', flag: '🇶🇦' },
        { code: 'SUI', name: 'Suiza', flag: '🇨🇭' },
    ],
    C: [
        { code: 'BRA', name: 'Brasil', flag: '🇧🇷' },
        { code: 'MAR', name: 'Marruecos', flag: '🇲🇦' },
        { code: 'HAI', name: 'Haití', flag: '🇭🇹' },
        { code: 'SCO', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
    ],
    D: [
        { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸' },
        { code: 'PAR', name: 'Paraguay', flag: '🇵🇾' },
        { code: 'AUS', name: 'Australia', flag: '🇦🇺' },
        { code: 'TUR', name: 'Turquía', flag: '🇹🇷' },
    ],
    E: [
        { code: 'GER', name: 'Alemania', flag: '🇩🇪' },
        { code: 'CUW', name: 'Curazao', flag: '🇨🇼' },
        { code: 'CIV', name: 'Costa de Marfil', flag: '🇨🇮' },
        { code: 'ECU', name: 'Ecuador', flag: '🇪🇨' },
    ],
    F: [
        { code: 'NED', name: 'Países Bajos', flag: '🇳🇱' },
        { code: 'JPN', name: 'Japón', flag: '🇯🇵' },
        { code: 'SWE', name: 'Suecia', flag: '🇸🇪' },
        { code: 'TUN', name: 'Túnez', flag: '🇹🇳' },
    ],
    G: [
        { code: 'BEL', name: 'Bélgica', flag: '🇧🇪' },
        { code: 'EGY', name: 'Egipto', flag: '🇪🇬' },
        { code: 'IRI', name: 'Irán', flag: '🇮🇷' },
        { code: 'NZL', name: 'Nueva Zelanda', flag: '🇳🇿' },
    ],
    H: [
        { code: 'ESP', name: 'España', flag: '🇪🇸' },
        { code: 'CPV', name: 'Cabo Verde', flag: '🇨🇻' },
        { code: 'KSA', name: 'Arabia Saudita', flag: '🇸🇦' },
        { code: 'URU', name: 'Uruguay', flag: '🇺🇾' },
    ],
    I: [
        { code: 'FRA', name: 'Francia', flag: '🇫🇷' },
        { code: 'SEN', name: 'Senegal', flag: '🇸🇳' },
        { code: 'IRQ', name: 'Irak', flag: '🇮🇶' },
        { code: 'NOR', name: 'Noruega', flag: '🇳🇴' },
    ],
    J: [
        { code: 'ARG', name: 'Argentina', flag: '🇦🇷' },
        { code: 'ALG', name: 'Argelia', flag: '🇩🇿' },
        { code: 'AUT', name: 'Austria', flag: '🇦🇹' },
        { code: 'JOR', name: 'Jordania', flag: '🇯🇴' },
    ],
    K: [
        { code: 'POR', name: 'Portugal', flag: '🇵🇹' },
        { code: 'COD', name: 'RD Congo', flag: '🇨🇩' },
        { code: 'UZB', name: 'Uzbekistán', flag: '🇺🇿' },
        { code: 'COL', name: 'Colombia', flag: '🇨🇴' },
    ],
    L: [
        { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
        { code: 'CRO', name: 'Croacia', flag: '🇭🇷' },
        { code: 'GHA', name: 'Ghana', flag: '🇬🇭' },
        { code: 'PAN', name: 'Panamá', flag: '🇵🇦' },
    ],
};

const ALL_COUNTRIES = Object.entries(GROUPS).flatMap(([group, teams]) =>
    teams.map(t => ({ ...t, group }))
);

const state = {
    photo: null,
    photoScale: 110,
    photoY: -80,
    photoX: 0,
    cBg: '#43c4c9',
    c2: '#74a9db',
    c6: '#ffffff',
    cCosito: '#9ab7dd',
    name: 'TU NOMBRE',
    date: '1-1-2000',
    height: '1,75m',
    weight: '70 kg',
    club: 'MI CLUB',
    code: 'ARG',
    flagImg: null,
};

const LAYER_FILES = [
    { id: 'num2', src: '../assets/2.png' },
    { id: 'num6', src: '../assets/6.png' },
    { id: 'marco', src: '../assets/marco.png' },
    { id: 'marco6', src: '../assets/marco6.png' },
    { id: 'cosito', src: '../assets/cosito.png' },
    { id: 'rectA', src: '../assets/svg/rectanguloarriba.svg' },
    { id: 'rectB', src: '../assets/svg/rectanguloabajo.svg' },
    { id: 'fifa', src: '../assets/svg/logofifa.svg' },
    { id: 'fifa2', src: '../assets/svg/logofifa2.svg' },
    { id: 'panini', src: '../assets/svg/panini.svg' },
];

const imgs = {};

function loadLayers() {
    let loaded = 0;
    LAYER_FILES.forEach(layer => {
        const img = new Image();
        img.onload = () => {
            imgs[layer.id] = img;
            loaded++;
            if (loaded === LAYER_FILES.length) { updateAllTints(); needsDraw = true; }
        };
        img.onerror = () => { loaded++; };
        img.src = layer.src;
    });
}

function loadFlag(code) {
    const img = new Image();
    img.onload = () => { state.flagImg = img; needsDraw = true; };
    img.onerror = () => { state.flagImg = null; needsDraw = true; };
    img.src = `../assets/flags/${code}.png`;
}

function tintImage(sourceImg, hex) {
    const oc = document.createElement('canvas');
    oc.width = W; oc.height = H;
    const ox = oc.getContext('2d');
    ox.fillStyle = hex;
    ox.fillRect(0, 0, W, H);
    ox.globalCompositeOperation = 'destination-in';
    ox.drawImage(sourceImg, 0, 0, W, H);
    return oc;
}

function updateAllTints() {
    if (imgs.num2) tintCache.num2 = tintImage(imgs.num2, state.c2);
    if (imgs.num6) tintCache.num6 = tintImage(imgs.num6, state.c6);
    if (imgs.cosito) tintCache.cosito = tintImage(imgs.cosito, state.cCosito);
    if (imgs.marco) tintCache.marco = tintImage(imgs.marco, state.cBg);
    if (imgs.marco6) tintCache.marco6 = tintImage(imgs.marco6, state.c6);
}

function updateOptimizedPhoto() {
    if (!state.photo) return;
    const oc = document.createElement('canvas');
    oc.width = W; oc.height = H;
    const ox = oc.getContext('2d');
    const ratio = Math.max(W / state.photo.width, H / state.photo.height);
    ox.drawImage(state.photo, 0, 0, state.photo.width * ratio, state.photo.height * ratio);
    optimizedPhoto = oc;
}

function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 14);

    ctx.fillStyle = state.cBg;
    ctx.fillRect(0, 0, W, H);

    if (tintCache.num2) ctx.drawImage(tintCache.num2, 0, 0, W, H);
    if (tintCache.num6) ctx.drawImage(tintCache.num6, 0, 0, W, H);
    if (tintCache.cosito) ctx.drawImage(tintCache.cosito, 0, 0, W, H);

    if (optimizedPhoto) {
        const sc = state.photoScale / 100;
        const pw = W * sc;
        const ph = (optimizedPhoto.height / optimizedPhoto.width) * pw;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(0, 0, W, H, 14);
        ctx.clip();
        ctx.drawImage(optimizedPhoto, (W - pw) / 2 + state.photoX, state.photoY + H * 0.05, pw, ph);
        ctx.restore();
    }

    if (tintCache.marco) ctx.drawImage(tintCache.marco, 0, 0, W, H);
    if (tintCache.marco6) ctx.drawImage(tintCache.marco6, 0, 0, W, H);

    ctx.save();
    if (state.flagImg) ctx.drawImage(state.flagImg, 0, 0, W, H);
    state.code.toUpperCase().slice(0, 3).split('').forEach((l, i) => {
        ctx.font = `900 220px ${FONT_PAIS}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.lineWidth = 3.08;
        ctx.strokeText(l, W - 207, 1729 + i * 184);
        ctx.fillStyle = 'rgba(255,255,255,0.42)';
        ctx.fillText(l, W - 207, 1729 + i * 184);
    });
    ctx.restore();

    if (imgs.rectA) ctx.drawImage(imgs.rectA, 81, 1900, 1183, 207);
    if (imgs.rectB) ctx.drawImage(imgs.rectB, 81, 2130, 1022, 98);
    if (imgs.fifa2) ctx.drawImage(imgs.fifa2, 1353, 493, 128, 44);
    if (imgs.fifa) ctx.drawImage(imgs.fifa, 1269, 133, 288, 448);
    if (imgs.panini) ctx.drawImage(imgs.panini, 1124, 2130, 414, 98);

    ctx.save();
    ctx.textAlign = 'center';
    const cx = 88 + 1166 / 2;
    ctx.font = `700 88px ${FONT_RESTO}`;
    ctx.fillStyle = '#fff';
    ctx.fillText(state.name.toUpperCase(), cx, H - 316.8, 1166);
    ctx.font = `400 66px ${FONT_RESTO}`;
    ctx.fillText(`${state.date}  |  ${state.height}  |  ${state.weight}`, cx, H - 233.4, 1166);
    ctx.font = `100 66px ${FONT_RESTO}`;
    ctx.fillText(state.club.toUpperCase(), 88 + 1012 / 2, H - 110, 1012);
    ctx.restore();

    ctx.restore();
}

function renderLoop() {
    if (needsDraw) { draw(); needsDraw = false; }
    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

const photoInput = document.getElementById('photoInput');
const uploadLabel = document.getElementById('uploadLabel');
const uploadBtn = document.querySelector('.upload-btn');
const statusEl = document.getElementById('uploadStatus');

function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = 'status-msg ' + type;
    statusEl.style.display = 'block';
}

async function parseRembgResponse(res) {
    const raw = await res.text();
    let data = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch (_) { }
    return { data, raw };
}

photoInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    uploadLabel.textContent = 'Procesando...';
    uploadBtn.classList.add('loading');
    statusEl.style.display = 'none';
    const formData = new FormData();
    formData.append('photo', file);
    try {
        const res = await fetch('/api/remove-bg', {
            method: 'POST',
            body: file
        });

        if (!res.ok) throw new Error(`Error en el servidor: ${res.status}`);
        const blob = await res.blob();
        const img = new Image();

        img.onload = () => {
            state.photo = img;
            updateOptimizedPhoto();
            needsDraw = true;
            uploadLabel.textContent = 'Fondo removido';
            uploadBtn.classList.remove('loading');
            uploadBtn.classList.add('done');
            showStatus('¡Fondo quitado con éxito!', 'ok');
        };

        img.src = URL.createObjectURL(blob);

    } catch (err) {
        console.error(err);
        uploadLabel.textContent = 'Error al procesar';
        uploadBtn.classList.remove('loading');
        showStatus('Error: No se pudo quitar el fondo', 'error');
    }
});

document.getElementById('photoInputDirect').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
        state.photo = img;
        updateOptimizedPhoto();
        needsDraw = true;
        URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
});

function slider(id, key, vid, sfx) {
    document.getElementById(id).addEventListener('input', e => {
        state[key] = parseFloat(e.target.value);
        document.getElementById(vid).textContent = e.target.value + (sfx || '');
        needsDraw = true;
    });
}

function colorPicker(id, key) {
    document.getElementById(id).addEventListener('input', e => {
        state[key] = e.target.value;
        updateAllTints();
        needsDraw = true;
    });
}

function textField(id, key, upper) {
    let t;
    document.getElementById(id).addEventListener('input', e => {
        state[key] = upper ? e.target.value.toUpperCase() : e.target.value;
        clearTimeout(t);
        t = setTimeout(() => { needsDraw = true; }, 50);
    });
}

slider('sScale', 'photoScale', 'vScale', '%');
slider('sY', 'photoY', 'vY', '');
slider('sX', 'photoX', 'vX', '');
colorPicker('cBg', 'cBg'); colorPicker('c2', 'c2');
colorPicker('c6', 'c6'); colorPicker('cCosito', 'cCosito');
textField('tName', 'name', true);
textField('tDate', 'date', false);
textField('tHeight', 'height', false);
textField('tWeight', 'weight', false);
textField('tClub', 'club', true);

const searchInput = document.getElementById('countrySearch');
const dropdown = document.getElementById('countryDropdown');
const selectedDiv = document.getElementById('selectedCountry');

function selectCountry(country) {
    state.code = country.code;
    loadFlag(country.code);
    selectedDiv.innerHTML = `
    <img src="../assets/flags/miniflags/${country.code}.png" alt="${country.name}" class="sc-flag-img"
      onerror="this.style.display='none'">
    <div class="sc-info">
      <span class="sc-name">${country.name}</span>
      <span class="sc-code">${country.code} · Grupo ${country.group}</span>
    </div>`;
    searchInput.value = '';
    dropdown.style.display = 'none';
}

function renderDropdown(query) {
    const q = query.toLowerCase().trim();
    const results = q
        ? ALL_COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
        : ALL_COUNTRIES;

    if (!results.length) {
        dropdown.innerHTML = '<div class="dd-empty">Sin resultados</div>';
        dropdown.style.display = 'block';
        return;
    }

    const byGroup = {};
    results.forEach(c => { if (!byGroup[c.group]) byGroup[c.group] = []; byGroup[c.group].push(c); });

    dropdown.innerHTML = Object.entries(byGroup).map(([group, teams]) => `
    <div class="dd-group-label">Grupo ${group}</div>
    <div class="dd-group-container">${teams.map(c => `
      <div class="dd-item" data-code="${c.code}">
        <img src="../assets/flags/miniflags/${c.code}.png" alt="${c.name}" class="dd-flag-img"
          onerror="this.style.display='none'">
        <div class="dd-text-wrap">
          <span class="dd-name">${c.name}</span>
          <span class="dd-code">${c.code}</span>
        </div>
      </div>`).join('')}
    </div>`).join('');

    dropdown.style.display = 'block';
    dropdown.querySelectorAll('.dd-item').forEach(item => {
        item.addEventListener('click', () => {
            const country = ALL_COUNTRIES.find(c => c.code === item.dataset.code);
            if (country) selectCountry(country);
        });
    });
}

searchInput.addEventListener('focus', () => renderDropdown(searchInput.value));
searchInput.addEventListener('input', () => renderDropdown(searchInput.value));
document.addEventListener('click', e => {
    if (!e.target.closest('.country-search-wrap')) dropdown.style.display = 'none';
});

document.getElementById('dlBtn').addEventListener('click', () => {
    const a = document.createElement('a');
    a.download = `figurita-${state.name.replace(/\s+/g, '-').toLowerCase()}-2026.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
});

loadLayers();
loadFlag(state.code);
selectCountry(ALL_COUNTRIES.find(c => c.code === 'ARG'));