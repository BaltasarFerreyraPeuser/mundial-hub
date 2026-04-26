'use strict';

/* ─── Constantes de canvas ─────────────────────────────────── */
const W = 1650;
const H = 2310;

const canvasMap = {
    'edition-2026':      document.getElementById('cv-2026'),
    'edition-qatar2022': document.getElementById('cv-qatar'),
    'edition-extracard': document.getElementById('cv-extra'),
};

let canvas = canvasMap['edition-2026'];
let ctx    = canvas.getContext('2d', { alpha: false }); // alpha:false = +15% velocidad en canvas opaco

function switchCanvas(edition) {
    Object.values(canvasMap).forEach(c => { c.style.display = 'none'; });
    const target = canvasMap[edition.id] || canvasMap['edition-2026'];
    target.style.display = 'block';
    canvas = target;
    // Reusar contexto si ya existe (evita crear uno nuevo en cada switch)
    ctx = canvas.getContext('2d') || canvas.getContext('2d', { alpha: false });
}

/* ─── Fuentes personalizadas ────────────────────────────────── */
// Carga todas las fuentes en paralelo con Promise.all
const fontDefs = [
    ['FuentePersonalizada',      '/frontend/assets/fonts/fuente.otf'],
    ['FuentePersonalizadaA',     '/frontend/assets/fonts/fuente2.ttf'],
    ['FuentePersonalizadaAA',    '/frontend/assets/fonts/fuente3.ttf'],
    ['FuentePersonalizadaQatar', '/frontend/assets/fonts/qatarfuente.ttf'],
];

Promise.all(
    fontDefs.map(([name, url]) => new FontFace(name, `url(${url})`).load())
).then(fonts => {
    fonts.forEach(f => document.fonts.add(f));
    needsDraw = true;
}).catch(() => { needsDraw = true; });

/* ─── Estado global ─────────────────────────────────────────── */
const EDITIONS = [Edition2026, EditionQatar2022, EditionExtraCard];

let activeEdition = EDITIONS[0];
let state         = { ...activeEdition.defaultState, _touched: {} };
let imgs          = {};
let tints         = {};
let photo         = null;
let flagImg       = null;
let needsDraw     = true;

/* ─── Utilidades de países ──────────────────────────────────── */
// Caché por edición para no recomputar en cada keystroke del buscador
const _countryCache = new Map();
function getAllCountries(edition) {
    if (_countryCache.has(edition.id)) return _countryCache.get(edition.id);
    const result = Object.entries(edition.groups).flatMap(([group, teams]) =>
        teams.map(t => ({ ...t, group }))
    );
    _countryCache.set(edition.id, result);
    return result;
}

/* ─── Carga de capas con Promise.all ───────────────────────── */
// Antes se cargaban en serie; ahora todas en paralelo
function loadLayers(edition) {
    imgs  = {};
    tints = {};
    const files = edition.layerFiles || [];
    if (!files.length) { needsDraw = true; return; }

    Promise.all(
        files.map(layer => new Promise(resolve => {
            const img = new Image();
            img.onload  = () => { imgs[layer.id] = img; resolve(); };
            img.onerror = () => resolve(); // tolera errores, no bloquea
            img.src = layer.src;
        }))
    ).then(() => {
        tints    = edition.buildTints(imgs, state);
        needsDraw = true;
    });
}

/* ─── Carga de bandera ──────────────────────────────────────── */
// Cancela la imagen anterior si llega una nueva antes de que cargue
let _flagPending = null;
function loadFlag(code) {
    if (_flagPending) { _flagPending.onload = _flagPending.onerror = null; }
    const img = new Image();
    _flagPending = img;
    img.onload  = () => { if (_flagPending === img) { flagImg = img; needsDraw = true; } };
    img.onerror = () => { if (_flagPending === img) { flagImg = null; needsDraw = true; } };
    img.src = activeEdition.flagsPath + code + '.png';
}

/* ─── Render loop eficiente ─────────────────────────────────── */
// Solo dibuja cuando hay cambios (needsDraw), no en cada frame
function renderLoop() {
    if (needsDraw) {
        activeEdition.draw(ctx, state, imgs, tints, photo, flagImg);
        needsDraw = false;
    }
    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

/* ─── Tema ──────────────────────────────────────────────────── */
function applyTheme(theme) {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v));
}

/* ─── Controles de edición ──────────────────────────────────── */
function renderEditionControls(edition) {
    const slot = document.getElementById('editionControlsSlot');
    if (!slot) return;
    slot.innerHTML = edition.renderControls(state);
    edition.bindControls(state, onUpdate);
}

function onUpdate(type) {
    if (type === 'tints') tints = activeEdition.buildTints(imgs, state);
    needsDraw = true;
}

/* ─── Loader de edición ─────────────────────────────────────── */
let _loaderEl = null;
function showEditionLoader() {
    if (!_loaderEl) {
        _loaderEl = document.createElement('div');
        _loaderEl.id        = 'editionLoader';
        _loaderEl.className = 'edition-loader';
        _loaderEl.innerHTML =
            '<div class="edition-loader__inner">' +
            '<img src="/frontend/assets/svg/loader-anim.svg" alt="" class="edition-loader__anim" onerror="this.style.display=\'none\'">' +
            '<div class="edition-loader__spinner" aria-hidden="true"></div>' +
            '<p class="edition-loader__text">Loading edition...</p>' +
            '</div>';
        document.body.appendChild(_loaderEl);
    }
    _loaderEl.classList.add('active');
}

function hideEditionLoader() {
    if (_loaderEl) _loaderEl.classList.remove('active');
}

/* ─── Cambio de edición ─────────────────────────────────────── */
function switchEdition(edition) {
    if (edition === activeEdition) return;
    showEditionLoader();

    // Usamos 0ms: queremos liberar el hilo principal un tick para que el loader aparezca,
    // pero no 500ms de delay artificial que empeora el TBT
    requestAnimationFrame(() => requestAnimationFrame(() => {
        activeEdition = edition;
        const prevCode    = state.code;
        const prevTouched = state._touched || {};
        const newState    = { ...edition.defaultState, code: prevCode, _touched: {} };

        ['name', 'date', 'height', 'weight'].forEach(k => {
            if (prevTouched[k]) { newState[k] = prevTouched[k]; newState._touched[k] = prevTouched[k]; }
        });

        const fieldsToToggle = {
            'tDate':   edition.id !== 'edition-extracard',
            'tHeight': edition.id !== 'edition-extracard',
            'tWeight': edition.id !== 'edition-extracard',
            'tClub':   edition.id !== 'edition-extracard' && edition.id !== 'edition-qatar2022',
        };
        Object.entries(fieldsToToggle).forEach(([id, show]) => {
            const el = document.getElementById(id);
            if (el) {
                const row = el.closest('.frow');
                if (row) row.style.display = show ? 'flex' : 'none';
            }
        });

        state = newState;
        switchCanvas(edition);
        document.body.setAttribute('data-edition', edition.id);
        applyTheme(edition.theme);
        loadLayers(edition);
        loadFlag(state.code);
        renderEditionControls(edition);
        renderDropdown('');
        renderTabs();
        needsDraw = true;
        hideEditionLoader();
    }));
}

/* ─── Foto del jugador ──────────────────────────────────────── */
document.getElementById('photoInputDirect').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    // createObjectURL es mucho más rápido que FileReader+base64
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
        URL.revokeObjectURL(url); // libera memoria
        photo = img;
        needsDraw = true;
    };
    img.src = url;
});

/* ─── Sliders ───────────────────────────────────────────────── */
function slider(id, key, vid, sfx) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', e => {
        state[key] = parseFloat(e.target.value);
        document.getElementById(vid).textContent = e.target.value + (sfx || '');
        needsDraw = true;
    });
}
slider('sScale', 'photoScale', 'vScale', '%');
slider('sY',     'photoY',     'vY',     '');
slider('sX',     'photoX',     'vX',     '');

/* ─── Campos de texto con debounce ──────────────────────────── */
function textField(id, key, upper) {
    const el = document.getElementById(id);
    if (!el) return;
    let t;
    el.addEventListener('input', e => {
        const val = upper ? e.target.value.toUpperCase() : e.target.value;
        state[key] = val;
        if (!state._touched) state._touched = {};
        state._touched[key] = val;
        clearTimeout(t);
        t = setTimeout(() => { needsDraw = true; }, 50);
    });
}
textField('tName',   'name',   true);
textField('tDate',   'date',   false);
textField('tHeight', 'height', false);
textField('tWeight', 'weight', false);
textField('tClub',   'club',   true);

/* ─── Buscador de países ────────────────────────────────────── */
const searchInput = document.getElementById('countrySearch');
const dropdown    = document.getElementById('countryDropdown');
const selectedDiv = document.getElementById('selectedCountry');

function selectCountry(country) {
    state.code = country.code;
    loadFlag(country.code);
    const mfp = activeEdition.miniflagsPath || (activeEdition.flagsPath + 'miniflags/');
    selectedDiv.innerHTML =
        '<img src="' + mfp + country.code + '.png"' +
        ' alt="' + country.name + '" class="sc-flag-img" width="36" height="36" onerror="this.style.display=\'none\'">' +
        '<div class="sc-info">' +
        '<span class="sc-name">' + country.name + '</span>' +
        '<span class="sc-code">' + country.code + ' · Group ' + country.group + '</span>' +
        '</div>';
    searchInput.value      = '';
    dropdown.style.display = 'none';
}

// Reutiliza DocumentFragment para minimizar reflows
function renderDropdown(query) {
    const allCountries = getAllCountries(activeEdition);
    const q = query.toLowerCase().trim();
    const results = q
        ? allCountries.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
        : allCountries;

    if (!results.length) {
        dropdown.innerHTML     = '<div class="dd-empty">No results</div>';
        dropdown.style.display = 'block';
        return;
    }

    const byGroup = {};
    results.forEach(c => { (byGroup[c.group] = byGroup[c.group] || []).push(c); });

    const fp = activeEdition.miniflagsPath || (activeEdition.flagsPath + 'miniflags/');

    // Construir HTML en un solo string (evita múltiples reflows)
    const html = Object.entries(byGroup).map(([group, teams]) =>
        '<div class="dd-group-label">Group ' + group + '</div>' +
        '<div class="dd-group-container">' +
        teams.map(c =>
            '<div class="dd-item" data-code="' + c.code + '">' +
            '<img src="' + fp + c.code + '.png" alt="' + c.name + '" class="dd-flag-img" width="44" height="44" loading="lazy" onerror="this.style.display=\'none\'">' +
            '<div class="dd-text-wrap"><span class="dd-name">' + c.name + '</span><span class="dd-code">' + c.code + '</span></div>' +
            '</div>'
        ).join('') +
        '</div>'
    ).join('');

    dropdown.innerHTML     = html;
    dropdown.style.display = 'block';

    // Delegación de eventos en lugar de N listeners individuales
    dropdown.onclick = e => {
        const item = e.target.closest('.dd-item');
        if (!item) return;
        const country = getAllCountries(activeEdition).find(c => c.code === item.dataset.code);
        if (country) selectCountry(country);
    };
}

// Debounce del buscador para no disparar en cada tecla
let _searchTimer;
searchInput.addEventListener('focus', () => renderDropdown(searchInput.value));
searchInput.addEventListener('input', () => {
    clearTimeout(_searchTimer);
    _searchTimer = setTimeout(() => renderDropdown(searchInput.value), 80);
});
document.addEventListener('click', e => {
    if (!e.target.closest('.country-search-wrap')) dropdown.style.display = 'none';
});

/* ─── Descarga ──────────────────────────────────────────────── */
let lastDataUrl = null;

function getActiveDataUrl() {
    const cw = activeEdition.canvasW || W;
    const ch = activeEdition.canvasH || H;
    const ec   = document.createElement('canvas');
    ec.width  = cw;
    ec.height = ch;
    const ectx = ec.getContext('2d');
    if (!ectx) return null;
    try {
        activeEdition.draw(ectx, state, imgs, tints, photo, flagImg);
        return ec.toDataURL('image/png');
    } catch (err) {
        console.warn('toDataURL falló:', err);
        return null;
    }
}

/* ─── Modal de compartir ────────────────────────────────────── */
function openShareModal(dataUrl) {
    lastDataUrl = dataUrl;
    document.getElementById('shareModalImg').src = dataUrl;
    document.getElementById('shareModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('shareModal').addEventListener('click', e => {
    if (e.target === document.getElementById('shareModal')) closeShareModal();
});
document.getElementById('modalClose').addEventListener('click', closeShareModal);

document.getElementById('modalDownload').addEventListener('click', () => {
    if (!lastDataUrl) return;
    const a = document.createElement('a');
    a.download = 'figurita-' + state.name.replace(/\s+/g, '-').toLowerCase() + '-' + activeEdition.downloadSuffix + '.png';
    a.href = lastDataUrl;
    a.click();
});

document.getElementById('shareTwitter').addEventListener('click', () => {
    const txt = encodeURIComponent('Check out my ' + activeEdition.name + ' sticker! 🌍⚽ Create yours for free at mundialhub.vercel.app #WorldCup2026 #Sticker');
    window.open('https://twitter.com/intent/tweet?text=' + txt, '_blank');
});

document.getElementById('shareWhatsapp').addEventListener('click', () => {
    const txt = encodeURIComponent('Check out my ' + activeEdition.name + ' sticker! 🌍⚽ https://mundialhub.vercel.app');
    window.open('https://wa.me/?text=' + txt, '_blank');
});

document.getElementById('shareInstagram').addEventListener('click', () => {
    if (!lastDataUrl) return;
    const a = document.createElement('a');
    a.download = 'figurita-' + state.name.replace(/\s+/g, '-').toLowerCase() + '-' + activeEdition.downloadSuffix + '.png';
    a.href = lastDataUrl;
    a.click();
    document.getElementById('igTip').style.display = 'block';
});

document.getElementById('dlBtn').addEventListener('click', () => {
    const dataUrl = getActiveDataUrl();
    if (!dataUrl) { alert('Error generating the image. Please try again.'); return; }
    const a = document.createElement('a');
    a.download = 'figurita-' + state.name.replace(/\s+/g, '-').toLowerCase() + '-' + activeEdition.downloadSuffix + '.png';
    a.href = dataUrl;
    a.click();
    openShareModal(dataUrl);
});

/* ─── Tabs de ediciones ─────────────────────────────────────── */
const TABS = [
    { label: '2026',              edition: Edition2026,      disabled: false, icon: '/frontend/assets/svg/logofifa3.svg' },
    { label: '2022',              edition: EditionQatar2022, disabled: false, icon: '/frontend/assets/svg/logoqatar.svg' },
    { label: 'EXTRA STICKER 2026', edition: EditionExtraCard, disabled: false, icon: '/frontend/assets/extra.png' },
    { label: 'EXTRA STICKER 2022', sub: 'COMING SOON', edition: null, disabled: true, icon: '/frontend/assets/extra22.png' },
    { label: '2018', sub: 'COMING SOON', edition: null, disabled: true, icon: '/frontend/assets/svg/logorusia.svg' },
    { label: '2014', sub: 'COMING SOON', edition: null, disabled: true, icon: '/frontend/assets/svg/logobrasil.svg' },
];

let currentTabIdx = 0;
const VISIBLE = 2;

function renderTabs() {
    const container = document.getElementById('wcTabsContainer');
    const visible   = TABS.slice(currentTabIdx, currentTabIdx + VISIBLE);
    container.innerHTML = visible.map((t, i) => {
        const isActive = t.edition === activeEdition;
        return '<button class="wc-tab' + (isActive ? ' active' : '') + (t.disabled ? ' disabled' : '') + '" ' +
               'data-tab-idx="' + (currentTabIdx + i) + '" ' +
               'title="' + (t.disabled ? 'Coming soon' : t.label) + '" ' +
               (t.disabled ? 'aria-disabled="true"' : '') + '>' +
               '<img src="' + (t.icon || '') + '" alt="' + t.label + '" class="wc-tab-icon" width="60" height="auto" loading="lazy" onerror="this.style.display=\'none\'">' +
               '<span class="wc-year">' + t.label + '</span>' +
               (t.disabled ? '<div class="lock-icon">LOCKED</div>' : '') +
               '</button>';
    }).join('');

    document.getElementById('wcPrev').disabled = currentTabIdx === 0;
    document.getElementById('wcNext').disabled = currentTabIdx >= TABS.length - VISIBLE;

    // Delegación de evento en el contenedor en lugar de un listener por tab
    container.onclick = e => {
        const btn = e.target.closest('.wc-tab:not(.disabled)');
        if (!btn) return;
        const tab = TABS[parseInt(btn.dataset.tabIdx)];
        if (tab && tab.edition) switchEdition(tab.edition);
    };
}

document.getElementById('wcPrev').addEventListener('click', () => {
    if (currentTabIdx > 0) { currentTabIdx--; renderTabs(); }
});
document.getElementById('wcNext').addEventListener('click', () => {
    if (currentTabIdx < TABS.length - VISIBLE) { currentTabIdx++; renderTabs(); }
});

/* ─── Inicialización ────────────────────────────────────────── */
document.body.setAttribute('data-edition', activeEdition.id);
applyTheme(activeEdition.theme);
switchCanvas(activeEdition);
renderEditionControls(activeEdition);
renderTabs();
loadLayers(activeEdition);
loadFlag(state.code);

const initCountry = getAllCountries(activeEdition).find(c => c.code === 'ARG')
    || getAllCountries(activeEdition)[0];
if (initCountry) selectCountry(initCountry);
