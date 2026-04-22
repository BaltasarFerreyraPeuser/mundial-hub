const W = 1650;
const H = 2310;

const canvasMap = {
    'edition-2026':      document.getElementById('cv-2026'),
    'edition-qatar2022': document.getElementById('cv-qatar'),
};

let canvas = canvasMap['edition-2026'];
let ctx    = canvas.getContext('2d');

function switchCanvas(edition) {
    Object.values(canvasMap).forEach(c => { c.style.display = 'none'; });
    const target = canvasMap[edition.id] || canvasMap['edition-2026'];
    target.style.display = 'block';
    canvas = target;
    ctx    = canvas.getContext('2d');
}

const customFont  = new FontFace('FuentePersonalizada',     'url(/frontend/assets/fonts/fuente.otf)');
const customFont2 = new FontFace('FuentePersonalizadaA',    'url(/frontend/assets/fonts/fuente2.ttf)');
const customFont3 = new FontFace('FuentePersonalizadaAA',   'url(/frontend/assets/fonts/fuente3.ttf)');
const customFont4 = new FontFace('FuentePersonalizadaQatar','url(/frontend/assets/fonts/qatarfuente.ttf)');

Promise.all([customFont.load(), customFont2.load(), customFont3.load(), customFont4.load()])
    .then(fonts => { fonts.forEach(f => document.fonts.add(f)); needsDraw = true; })
    .catch(() => { needsDraw = true; });

const EDITIONS = [Edition2026, EditionQatar2022];

let activeEdition = EDITIONS[0];
let state         = { ...activeEdition.defaultState, _touched: {} };
let imgs          = {};
let tints         = {};
let photo         = null;
let flagImg       = null;
let needsDraw     = true;

function getAllCountries(edition) {
    return Object.entries(edition.groups).flatMap(([group, teams]) =>
        teams.map(t => ({ ...t, group }))
    );
}

function loadLayers(edition) {
    imgs = {}; tints = {};
    const files = edition.layerFiles || [];
    if (!files.length) { needsDraw = true; return; }
    let loaded = 0;
    files.forEach(layer => {
        const img = new Image();
        img.onload = () => {
            imgs[layer.id] = img; loaded++;
            if (loaded === files.length) { tints = edition.buildTints(imgs, state); needsDraw = true; }
        };
        img.onerror = () => { loaded++; if (loaded === files.length) needsDraw = true; };
        img.src = layer.src;
    });
}

function loadFlag(code) {
    const img = new Image();
    img.onload  = () => { flagImg = img; needsDraw = true; };
    img.onerror = () => { flagImg = null; needsDraw = true; };
    img.src = activeEdition.flagsPath + code + '.png';
}

function renderLoop() {
    if (needsDraw) { activeEdition.draw(ctx, state, imgs, tints, photo, flagImg); needsDraw = false; }
    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

function applyTheme(theme) {
    Object.entries(theme).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
}

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

function showEditionLoader() {
    let overlay = document.getElementById('editionLoader');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id        = 'editionLoader';
        overlay.className = 'edition-loader';
        overlay.innerHTML = [
            '<div class="edition-loader__inner">',
            '<img src="/frontend/assets/svg/loader-anim.svg" alt="" class="edition-loader__anim" onerror="this.style.display=\'none\'">',
            '<div class="edition-loader__spinner" aria-hidden="true"></div>',
            '<p class="edition-loader__text">Cargando edición...</p>',
            '</div>'
        ].join('');
        document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
}

function hideEditionLoader() {
    const overlay = document.getElementById('editionLoader');
    if (overlay) overlay.classList.remove('active');
}

function switchEdition(edition) {
    if (edition === activeEdition) return;
    showEditionLoader();
    setTimeout(() => {
        activeEdition = edition;
        const prevCode = state.code;
        const prevTouched = state._touched || {};
        const newState = { ...edition.defaultState, code: prevCode, _touched: {} };
        const sharedFields = ['name', 'date', 'height', 'weight'];
        sharedFields.forEach(k => {
            if (prevTouched[k]) { newState[k] = prevTouched[k]; newState._touched[k] = prevTouched[k]; }
        });
        state = newState;
        switchCanvas(edition);
        document.body.setAttribute('data-edition', edition.id);
        applyTheme(edition.theme);
        loadLayers(edition);
        loadFlag(state.code);
        renderEditionControls(edition);
        renderDropdown('');
        syncTabsToActiveEdition();
        needsDraw = true;
        hideEditionLoader();
    }, 300);
}

function syncTabsToActiveEdition() { renderTabs(); }

document.getElementById('photoInputDirect').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        const img = new Image();
        img.onload = () => { photo = img; needsDraw = true; };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
});

function slider(id, key, vid, sfx) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', e => {
        state[key] = parseFloat(e.target.value);
        document.getElementById(vid).textContent = e.target.value + (sfx || '');
        needsDraw = true;
    });
}
slider('sScale','photoScale','vScale','%');
slider('sY',    'photoY',   'vY',   '');
slider('sX',    'photoX',   'vX',   '');

function textField(id, key, upper) {
    const el = document.getElementById(id);
    if (!el) return;
    let t;
    el.addEventListener('input', e => {
        const val = upper ? e.target.value.toUpperCase() : e.target.value;
        state[key] = val;
        if (!state._touched) state._touched = {};
        state._touched[key] = val;
        clearTimeout(t); t = setTimeout(() => { needsDraw = true; }, 50);
    });
}
textField('tName',   'name',   true);
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
    const mfp = activeEdition.miniflagsPath || (activeEdition.flagsPath + 'miniflags/');
    selectedDiv.innerHTML = [
        '<img src="' + mfp + country.code + '.png"',
        '     alt="' + country.name + '" class="sc-flag-img" onerror="this.style.display=\'none\'">',
        '<div class="sc-info">',
        '<span class="sc-name">' + country.name + '</span>',
        '<span class="sc-code">' + country.code + ' · Grupo ' + country.group + '</span>',
        '</div>'
    ].join('');
    searchInput.value      = '';
    dropdown.style.display = 'none';
}

function renderDropdown(query) {
    const allCountries = getAllCountries(activeEdition);
    const q = query.toLowerCase().trim();
    const results = q
        ? allCountries.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
        : allCountries;

    if (!results.length) {
        dropdown.innerHTML     = '<div class="dd-empty">Sin resultados</div>';
        dropdown.style.display = 'block';
        return;
    }

    const byGroup = {};
    results.forEach(c => { if (!byGroup[c.group]) byGroup[c.group] = []; byGroup[c.group].push(c); });

    const fp = activeEdition.miniflagsPath || (activeEdition.flagsPath + 'miniflags/');
    dropdown.innerHTML = Object.entries(byGroup).map(([group, teams]) =>
        '<div class="dd-group-label">Grupo ' + group + '</div>' +
        '<div class="dd-group-container">' +
        teams.map(c =>
            '<div class="dd-item" data-code="' + c.code + '">' +
            '<img src="' + fp + c.code + '.png" alt="' + c.name + '" class="dd-flag-img" onerror="this.style.display=\'none\'">' +
            '<div class="dd-text-wrap"><span class="dd-name">' + c.name + '</span><span class="dd-code">' + c.code + '</span></div>' +
            '</div>'
        ).join('') +
        '</div>'
    ).join('');

    dropdown.style.display = 'block';

    dropdown.querySelectorAll('.dd-item').forEach(item => {
        item.addEventListener('click', () => {
            const country = getAllCountries(activeEdition).find(c => c.code === item.dataset.code);
            if (country) selectCountry(country);
        });
    });
}

searchInput.addEventListener('focus', () => renderDropdown(searchInput.value));
searchInput.addEventListener('input', () => renderDropdown(searchInput.value));
document.addEventListener('click', e => {
    if (!e.target.closest('.country-search-wrap')) dropdown.style.display = 'none';
});

let lastDataUrl = null;

function getActiveDataUrl() {
    const cw = activeEdition.canvasW || W;
    const ch = activeEdition.canvasH || H;
    const ec = document.createElement('canvas');
    ec.width = cw; ec.height = ch;
    const ectx = ec.getContext('2d');
    if (!ectx) { console.error('No se pudo obtener contexto 2d'); return null; }
    try {
        activeEdition.draw(ectx, state, imgs, tints, photo, flagImg);
        return ec.toDataURL('image/png');
    } catch(e) {
        console.warn('toDataURL falló:', e);
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
    a.download = 'figurita-' + state.name.replace(/\s+/g,'-').toLowerCase() + '-' + activeEdition.downloadSuffix + '.png';
    a.href = lastDataUrl; a.click();
});

document.getElementById('shareTwitter').addEventListener('click', () => {
    const txt = encodeURIComponent('Mirá mi figurita del ' + activeEdition.name + '! 🌍⚽ Creá la tuya gratis en mundialhub.vercel.app #Mundial2026 #Figurita');
    window.open('https://twitter.com/intent/tweet?text=' + txt, '_blank');
});

document.getElementById('shareWhatsapp').addEventListener('click', () => {
    const txt = encodeURIComponent('Mirá mi figurita del ' + activeEdition.name + '! 🌍⚽ https://mundialhub.vercel.app');
    window.open('https://wa.me/?text=' + txt, '_blank');
});

document.getElementById('shareInstagram').addEventListener('click', () => {
    if (!lastDataUrl) return;
    const a = document.createElement('a');
    a.download = 'figurita-' + state.name.replace(/\s+/g,'-').toLowerCase() + '-' + activeEdition.downloadSuffix + '.png';
    a.href = lastDataUrl; a.click();
    document.getElementById('igTip').style.display = 'block';
});

document.getElementById('dlBtn').addEventListener('click', () => {
    const dataUrl = getActiveDataUrl();
    if (!dataUrl) { alert('Error al generar la imagen. Intentá de nuevo.'); return; }
    const a = document.createElement('a');
    a.download = 'figurita-' + state.name.replace(/\s+/g,'-').toLowerCase() + '-' + activeEdition.downloadSuffix + '.png';
    a.href = dataUrl; a.click();
    openShareModal(dataUrl);
});

const TABS = [
    { label:'2026',         edition:Edition2026,      disabled:false, icon:'/frontend/assets/svg/logofifa3.svg' },
    { label:'2022',         edition:EditionQatar2022, disabled:false, icon:'/frontend/assets/svg/logoqatar.svg' },
    { label:'EXTRA STICKER', sub:'COMING SOON', edition:null, disabled:true, icon: '/frontend/assets/extra.png' },
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
               'title="' + (t.disabled ? 'Próximamente' : t.label) + '" ' +
               (t.disabled ? 'aria-disabled="true"' : '') + '>' +
               '<img src="' + (t.icon || '') + '" alt="' + t.label + '" class="wc-tab-icon" onerror="this.style.display=\'none\'">' +
               '<span class="wc-year">' + t.label + '</span>' +
               (t.disabled ? '<div class="lock-icon">BLOQUEADO</div>' : '') +
               '</button>';
    }).join('');

    document.getElementById('wcPrev').disabled = currentTabIdx === 0;
    document.getElementById('wcNext').disabled = currentTabIdx >= TABS.length - VISIBLE;

    container.querySelectorAll('.wc-tab:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = TABS[parseInt(btn.dataset.tabIdx)];
            if (tab && tab.edition) switchEdition(tab.edition);
        });
    });
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

const initCountry = getAllCountries(activeEdition).find(c => c.code === 'ARG')
    || getAllCountries(activeEdition)[0];
if (initCountry) selectCountry(initCountry);
