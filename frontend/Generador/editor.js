'use strict';

const W = 2895;
const H = 3840;

const canvasMap = {
    'edition-2026':      document.getElementById('cv-2026'),
    'edition-qatar2022': document.getElementById('cv-qatar'),
    'edition-extracard': document.getElementById('cv-extra'),
    'edition-2018': document.getElementById('cv-rusia'),
    'edition-2006': document.getElementById('cv-germany'),
};

let canvas = canvasMap['edition-2026'];
let ctx    = canvas.getContext('2d', { alpha: false });

function switchCanvas(edition) {
    Object.values(canvasMap).forEach(c => { c.style.display = 'none'; });
    const target = canvasMap[edition.id] || canvasMap['edition-2026'];
    target.style.display = 'block';
    canvas = target;
    ctx = canvas.getContext('2d', { alpha: false });
}

const fontDefs = [
    ['FuentePersonalizada',      '/frontend/assets/fonts/truly-26.otf'],
    ['FuentePersonalizadaA',     '/frontend/assets/fonts/Nombre2.ttf'],
    ['FuentePersonalizadaAA', '/frontend/assets/fonts/Apellido2.ttf'],
    ['FuenteNacimiento', '/frontend/assets/fonts/nacimiento.ttf'],
    ['FuentePersonalizadaQatar', '/frontend/assets/fonts/qatarfuente.ttf'],
    ['FuenteRusia', '/frontend/assets/fonts/rusiafont.ttf'],
    ['FuenteTahoma', '/frontend/assets/fonts/tahoma.ttf'],
    ['FuenteTahomaBold', '/frontend/assets/fonts/tahomabd.ttf'],
    ['FuentePais2006', '/frontend/assets/fonts/pais2006.ttf'],
    ['FuenteNombre2006', '/frontend/assets/fonts/nombre2006.ttf'],
];
Promise.allSettled(
    fontDefs.map(([name, url]) => new FontFace(name, `url(${url})`).load())
).then(results => {
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            document.fonts.add(result.value);
        } else {
            console.error(`Fallo al cargar la fuente: ${fontDefs[index][0]} ->`, result.reason);
        }
    });
    needsDraw = true;
});

if (typeof ShirtAlign !== 'undefined') ShirtAlign.loadModels();

const EDITIONS = [Edition2026, EditionQatar2022, EditionExtraCard, EditionRusia2018, Edition2006];

let activeEdition = EDITIONS[0];
let state         = { ...activeEdition.defaultState, _touched: {} };
let imgs          = {};
let tints         = {};
let photo         = null;
let flagImg       = null;
let needsDraw     = true;

const _countryCache = new Map();
function getAllCountries(edition) {
    if (_countryCache.has(edition.id)) return _countryCache.get(edition.id);
    const result = Object.entries(edition.groups).flatMap(([group, teams]) =>
        teams.map(t => ({ ...t, group }))
    );
    _countryCache.set(edition.id, result);
    return result;
}

function loadLayers(edition) {
    imgs  = {};
    tints = {};
    const files = edition.layerFiles || [];
    if (!files.length) { needsDraw = true; return; }

    Promise.all(
        files.map(layer => new Promise(resolve => {
            const img = new Image();
            img.onload  = () => { imgs[layer.id] = img; resolve(); };
            img.onerror = () => resolve();
            img.src = layer.src;
        }))
    ).then(() => {
        tints    = edition.buildTints(imgs, state);
        needsDraw = true;
    });
}

const MARCO_FLAG = { x: 2298, y: 2142, w: 390, h: 390 };

const ALPHA3_TO_ALPHA2 = {
    // Grupo A
    MEX: 'mx', RSA: 'za', KOR: 'kr', CZE: 'cz',
    // Grupo B
    CAN: 'ca', BIH: 'ba', QAT: 'qa', SUI: 'ch',
    // Grupo C
    BRA: 'br', MAR: 'ma', HAI: 'ht', SCO: 'gb-sct',
    // Grupo D
    USA: 'us', PAR: 'py', AUS: 'au', TUR: 'tr',
    // Grupo E
    GER: 'de', CUW: 'cw', CIV: 'ci', ECU: 'ec',
    // Grupo F
    NED: 'nl', JPN: 'jp', SWE: 'se', TUN: 'tn',
    // Grupo G
    BEL: 'be', EGY: 'eg', IRI: 'ir', NZL: 'nz',
    // Grupo H
    ESP: 'es', CPV: 'cv', KSA: 'sa', URU: 'uy',
    // Grupo I
    FRA: 'fr', SEN: 'sn', IRQ: 'iq', NOR: 'no',
    // Grupo J
    ARG: 'ar', ALG: 'dz', AUT: 'at', JOR: 'jo',
    // Grupo K
    POR: 'pt', COD: 'cd', UZB: 'uz', COL: 'co',
    // Grupo L
    ENG: 'gb-eng', CRO: 'hr', GHA: 'gh', PAN: 'pa',
    VEN: 've', IRL: 'ie', ITA: 'it', POL: 'pl', CHI: 'cl', BOL: 'bo', RUS: 'ru', DEN: 'dk', PER: 'pe', ISL: 'is', NGA: 'ng', CRC: 'cr', SRB: 'rs', HON: 'hn',
    WAL: 'gb-wls', CMR: 'cm',
};

let _flagPending = null;
function loadFlag(code) {
    if (_flagPending) { _flagPending.onload = _flagPending.onerror = null; }
    const img = new Image();
    _flagPending = img;
    img.onload  = () => { if (_flagPending === img) { flagImg = img; needsDraw = true; } };
    img.onerror = () => { if (_flagPending === img) { flagImg = null; needsDraw = true; } };
    if (activeEdition.flagsSvgPath) {
        img.crossOrigin = 'anonymous';
        const alpha2 = ALPHA3_TO_ALPHA2[code] || code.toLowerCase();
        img.src = activeEdition.flagsSvgPath + alpha2 + '.svg';
    } else {
        img.src = activeEdition.flagsPath + code + '.png';
    }
}

const FLAG_CONTAIN = {
    BRA: '#009C3B',
};

function drawFlagInMarco(ctx, flagImg, countryCode) {
    if (!flagImg) return;
    const { x, y, w, h } = MARCO_FLAG;

    const fw = flagImg.naturalWidth  || flagImg.width  || w;
    const fh = flagImg.naturalHeight || flagImg.height || h;

    const bgColor = countryCode && FLAG_CONTAIN[countryCode];

    let dw, dh, dx, dy;
    if (bgColor) {
        const scale = Math.min(w / fw, h / fh);
        dw = fw * scale; dh = fh * scale;
        dx = x + (w - dw) / 2; dy = y + (h - dh) / 2;
    } else {
        const scale = h / fh;
        dw = fw * scale; dh = h;
        dx = x + (w - dw) / 2; dy = y;
    }

    const r = 197;
    const x2 = x + w, y2 = y + h;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x2 - r, y);
    ctx.arcTo(x2, y,  x2, y + r, r);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x + r, y2);
    ctx.arcTo(x,  y2, x, y2 - r, r);
    ctx.lineTo(x,  y + r);
    ctx.arcTo(x,  y,  x + r, y,  r);
    ctx.closePath();
    ctx.clip();

    if (bgColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, w, h);
    }

    ctx.drawImage(flagImg, dx, dy, dw, dh);
    ctx.restore();
}

let _shirtPending = null;
function loadShirt(code) {
    if (_shirtPending) { _shirtPending.onload = _shirtPending.onerror = null; }
    const img = new Image();
    _shirtPending = img;
    img.onload  = () => {
        if (_shirtPending === img) {
            imgs['shirt'] = img;
            if (state.showShirt && typeof ShirtAlign !== 'undefined') {
                if (photo && state._photoBounds) {
                    ShirtAlign.align(photo, img, state, onUpdate);
                } else {
                    ShirtAlign.alignShirt(img, state, onUpdate);
                }
            } else {
                needsDraw = true;
            }
        }
    };
    img.onerror = () => { if (_shirtPending === img) { delete imgs['shirt']; needsDraw = true; } };
    img.src = '/frontend/assets/Shirt/' + code + '.webp';
}

function renderLoop() {
    if (needsDraw) {
        activeEdition.draw(ctx, state, imgs, tints, photo, flagImg);
        needsDraw = false;
    }
    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

function applyTheme(theme) {
    const root = document.documentElement;
    Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v));
}

function renderEditionControls(edition) {
    const slot = document.getElementById('editionControlsSlot');
    if (!slot) return;
    slot.innerHTML = edition.renderControls(state);
    edition.bindControls(state, onUpdate);
}

let _tintDebounce = null;
function onUpdate(type) {
    if (type === 'tints') {
        clearTimeout(_tintDebounce);
        _tintDebounce = setTimeout(() => {
            tints = activeEdition.buildTints(imgs, state, tints);
            needsDraw = true;
        }, 30);
        return;
    }

    if (type === 'draw') {
        const controls = [
            { sl: 'sScale', num: 'vScale', key: 'photoScale' },
            { sl: 'sY', num: 'vY', key: 'photoY' },
            { sl: 'sX', num: 'vX', key: 'photoX' }
        ];

        controls.forEach(({ sl, num, key }) => {
            const sliderEl = document.getElementById(sl);
            const numberEl = document.getElementById(num);
            if (state[key] !== undefined) {
                if (sliderEl) sliderEl.value = state[key];
                if (numberEl) numberEl.value = state[key];
            }
        });
    }

    needsDraw = true;
}

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

function switchEdition(edition) {
    if (edition === activeEdition) return;
    showEditionLoader();

    requestAnimationFrame(() => requestAnimationFrame(() => {
        activeEdition = edition;
        const prevCode    = state.code;
        const prevTouched = state._touched || {};
        const newState    = { ...edition.defaultState, code: prevCode, _touched: {} };

        ['name', 'day', 'month', 'year', 'height', 'weight'].forEach(k => {
            if (prevTouched[k]) { newState[k] = prevTouched[k]; newState._touched[k] = prevTouched[k]; }
        });

        const fieldsToToggle = {
            'tHeight':   edition.id !== 'edition-extracard' && edition.id !== 'edition-2006',
            'tWeight':   edition.id !== 'edition-extracard' && edition.id !== 'edition-2006',
            'tClub':     edition.id !== 'edition-extracard' && edition.id !== 'edition-qatar2022' && edition.id !== 'edition-2006',
            'tApellido': edition.id === 'edition-2026',
        };
        Object.entries(fieldsToToggle).forEach(([id, show]) => {
            const el = document.getElementById(id);
            if (el) {
                const row = el.closest('.frow');
                if (row) row.style.display = show ? 'flex' : 'none';
            }
        });
        const rowNaci = document.getElementById('rowNacimiento');
        if (rowNaci) rowNaci.style.display = edition.id === 'edition-extracard' ? 'none' : 'flex';

        state = newState;
        switchCanvas(edition);
        document.body.setAttribute('data-edition', edition.id);
        applyTheme(edition.theme);
        loadLayers(edition);
        loadFlag(state.code);
        loadShirt(state.code);
        renderEditionControls(edition);
        renderDropdown('');
        renderTabs();
        needsDraw = true;
        hideEditionLoader();
    }));
}

document.getElementById('photoInputDirect').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = async () => {
        URL.revokeObjectURL(url);
        photo = img;
        needsDraw = true;
        if (
            typeof ShirtAlign !== 'undefined' &&
            activeEdition.id === 'edition-2026'
        ) {
            await ShirtAlign.align(photo, imgs['shirt'], state, onUpdate);
            if (state.showShirt && imgs['shirt'] && state._photoBounds) {
                ShirtAlign.alignShirt(imgs['shirt'], state, onUpdate);
            }
        }
    };
    img.src = url;
});

let sliderDebounce;

function syncControls(sliderId, numberId, key) {
    const sl = document.getElementById(sliderId);
    const num = document.getElementById(numberId);
    if (!sl || !num) return;

    const updateValue = (val) => {
        state[key] = parseFloat(val);
        sl.value = val;
        num.value = val;

        clearTimeout(sliderDebounce);
        sliderDebounce = setTimeout(() => {
            needsDraw = true;
        }, 15);
    };

    sl.addEventListener('input', e => updateValue(e.target.value));
    num.addEventListener('input', e => updateValue(e.target.value));
}

syncControls('sScale', 'vScale', 'photoScale');
syncControls('sY', 'vY', 'photoY');
syncControls('sX', 'vX', 'photoX');

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
textField('tName', 'name', true);
textField('tApellido', 'apellido', true);
textField('tDate',   'date',   false);
textField('tHeight', 'height', false);
textField('tWeight', 'weight', false);
textField('tClub',   'club',   true);

const searchInput = document.getElementById('countrySearch');
const dropdown    = document.getElementById('countryDropdown');
const selectedDiv = document.getElementById('selectedCountry');

function selectCountry(country) {
    state.code = country.code;
    loadFlag(country.code);
    loadShirt(country.code);
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

    const colors = activeEdition.countryColors?.[state.code];
    if (colors) {
        state.c2 = colors.c2;
        state.c6 = colors.c6;
        state.cCosito = colors.cCosito;
        const c2El = document.getElementById('c2');
        const c6El = document.getElementById('c6');
        const cCositoEl = document.getElementById('cCosito');
        if (c2El) c2El.value = colors.c2;
        if (c6El) c6El.value = colors.c6;
        if (cCositoEl) cCositoEl.value = colors.cCosito;
        onUpdate('tints');
    }
}

function normalizeStr(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function renderDropdown(query) {
    const allCountries = getAllCountries(activeEdition);
    const q = normalizeStr(query.trim());
    const results = q
        ? allCountries.filter(c => normalizeStr(c.name).includes(q) || c.code.toLowerCase().includes(q))
        : allCountries;

    if (!results.length) {
        dropdown.innerHTML     = '<div class="dd-empty">No results</div>';
        dropdown.style.display = 'block';
        return;
    }

    const byGroup = {};
    results.forEach(c => { (byGroup[c.group] = byGroup[c.group] || []).push(c); });

    const fp = activeEdition.miniflagsPath || (activeEdition.flagsPath + 'miniflags/');

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

    dropdown.onclick = e => {
        const item = e.target.closest('.dd-item');
        if (!item) return;
        const country = getAllCountries(activeEdition).find(c => c.code === item.dataset.code);
        if (country) selectCountry(country);
    };
}

let _searchTimer;
searchInput.addEventListener('focus', () => renderDropdown(searchInput.value));
searchInput.addEventListener('input', () => {
    clearTimeout(_searchTimer);
    _searchTimer = setTimeout(() => renderDropdown(searchInput.value), 80);
});
document.addEventListener('click', e => {
    if (!e.target.closest('.country-search-wrap')) dropdown.style.display = 'none';
});

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

const TABS = [
    { label: '2026',              edition: Edition2026,      disabled: false, icon: '/frontend/assets/svg/logofifa3.svg' },
    { label: '2022', edition: EditionQatar2022, disabled: false, icon: '/frontend/assets/svg/logoqatar.svg' },
    { label: '2018', edition: EditionRusia2018, disabled: false, icon: '/frontend/assets/svg/logorusia.svg' },
    { label: '2006', sub: 'COMING SOON', edition: Edition2006, disabled: false, icon: '/frontend/assets/svg/logo2006.svg' },
    { label: 'EXTRA STICKER 2026', edition: EditionExtraCard, disabled: false, icon: '/frontend/assets/extra.png' },
    { label: 'EXTRA STICKER 2022', sub: 'COMING SOON', edition: null, disabled: true, icon: '/frontend/assets/extra22.png' },
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

document.body.setAttribute('data-edition', activeEdition.id);
applyTheme(activeEdition.theme);
switchCanvas(activeEdition);
renderEditionControls(activeEdition);
renderTabs();
loadLayers(activeEdition);
loadFlag(state.code);
loadShirt(state.code);
const initCountry = getAllCountries(activeEdition).find(c => c.code === 'ARG')
    || getAllCountries(activeEdition)[0];
if (initCountry) selectCountry(initCountry);
needsDraw = true;
