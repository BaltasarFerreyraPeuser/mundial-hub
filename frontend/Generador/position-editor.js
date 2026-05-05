'use strict';

// ─────────────────────────────────────────────
//  POSITION EDITOR — Rusia 2018
//  Agrega un botón "⚙ Posiciones" en los controles
//  de la edición 2018. Al abrirlo muestra un overlay
//  con preview en tiempo real sobre el canvas real.
// ─────────────────────────────────────────────

const PositionEditor = (() => {

    const CW = 2994, CH = 3960;

    // Campos editables con sus valores iniciales
    // (ajustados a partir del grid debug confirmado)
    const FIELDS = [
        { key: 'code',   label: 'Código país (FRA/ARG)', color: '#00ccff', x: 2021, y: 170  },
        { key: 'debut',  label: 'Debut (año)',           color: '#00ff88', x: 2369, y: 592  },
        { key: 'height', label: 'Altura (m 1.75)',       color: '#ff00ff', x: 2521, y: 3072 },
        { key: 'weight', label: 'Peso (kg 70)',          color: '#ffff00', x: 2542, y: 3312 },
        { key: 'date',   label: 'Fecha nacimiento',      color: '#ff8800', x: 1050, y: 3210 },
        { key: 'name',   label: 'Nombre',                color: '#ff4444', x: 1344, y: 3512 },
        { key: 'club',   label: 'Club',                  color: '#ffffff', x: 1497, y: 3720 },
    ];

    // Posiciones actuales (se modifican con los sliders)
    let positions = {};
    FIELDS.forEach(f => { positions[f.key] = { x: f.x, y: f.y }; });

    // Referencia al overlay DOM
    let overlayEl = null;
    // Referencia al canvas de preview dentro del overlay
    let previewCanvas = null;
    let previewCtx = null;
    // Escala de visualización del preview
    const PREVIEW_W = 360;
    let previewScale = PREVIEW_W / CW;

    // ── Dibuja el preview con los textos de debug ──────────────────
    function drawPreview(editionState, imgs, tints, photo, flagImg) {
        if (!previewCtx) return;
        const pw = PREVIEW_W;
        const ph = Math.round(CH * previewScale);
        previewCanvas.width  = pw;
        previewCanvas.height = ph;

        const ctx = previewCtx;
        ctx.save();
        ctx.scale(previewScale, previewScale);

        // Reusar el draw() real de la edición para tener fondo/fotos/capas
        EditionRusia2018.draw(ctx, editionState, imgs, tints, photo, flagImg);

        // Dibujar crosshairs de cada campo
        FIELDS.forEach(f => {
            const { x, y } = positions[f.key];
            ctx.save();
            ctx.strokeStyle = f.color;
            ctx.lineWidth = 10;
            ctx.beginPath(); ctx.moveTo(x - 80, y); ctx.lineTo(x + 80, y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x, y - 80); ctx.lineTo(x, y + 80); ctx.stroke();
            ctx.fillStyle = f.color;
            ctx.font = 'bold 80px monospace';
            ctx.textBaseline = 'bottom';
            ctx.fillText(f.key, x + 20, y - 5);
            ctx.restore();
        });

        ctx.restore();
    }

    // ── Genera el bloque draw() completo para copiar ───────────────
    function generateDrawCode() {
        const p = positions;
        return `draw(ctx, state, imgs, tints, photo, flagImg) {
    const W = 2994, H = 3960;
    const FONT_nombre = '"Tahoma", "Barlow Condensed", sans-serif';
    const FONT_normal  = '"FuenteRusia", "Barlow Condensed", sans-serif';

    ctx.clearRect(0, 0, W, H);
    ctx.save();

    ctx.fillStyle = state.cBg || '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    if (imgs['fondo'])   ctx.drawImage(imgs['fondo'],   0, 0, W, H);

    if (photo) {
        const sc = state.photoScale / 40;
        const pw = photo.width  * sc;
        const ph = photo.height * sc;
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(0, 0, W, H, 14);
        ctx.clip();
        ctx.drawImage(photo, (W - pw) / 2 + state.photoX, state.photoY, pw, ph);
        ctx.restore();
    }

    if (tints.marco1)   ctx.drawImage(tints.marco1,   0, 0, W, H);
    if (imgs['marco'])  ctx.drawImage(imgs['marco'],   0, 0, W, H);
    if (tints.posicion) ctx.drawImage(tints.posicion,  0, 0, W, H);
    if (imgs['logo'])   ctx.drawImage(imgs['logo'],    0, 0, W, H);
    if (imgs['textos']) ctx.drawImage(imgs['textos'],  0, 0, W, H);
    if (flagImg)        ctx.drawImage(flagImg,          0, 0, W, H);

    // ── PAIS CODE ──
    ctx.save();
    ctx.font         = \`700 120px \${FONT_normal}\`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.strokeStyle  = 'rgba(0,0,0,0.6)';
    ctx.lineWidth    = 4;
    ctx.fillStyle    = '#ffffff';
    const paisCode = state.code.toUpperCase().slice(0, 3);
    ctx.strokeText(paisCode, ${p.code.x}, ${p.code.y});
    ctx.fillText  (paisCode, ${p.code.x}, ${p.code.y});
    ctx.restore();

    // ── DEBUT ──
    ctx.save();
    ctx.font         = \`150px \${FONT_normal}\`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle    = '#e5dfd9';
    ctx.fillText(state.debut || '', ${p.debut.x}, ${p.debut.y});
    ctx.restore();

    // ── ALTURA ──
    ctx.save();
    ctx.font         = \`150px \${FONT_normal}\`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle    = '#e5dfd9';
    ctx.fillText(state.height, ${p.height.x}, ${p.height.y});
    ctx.restore();

    // ── PESO ──
    ctx.save();
    ctx.font         = \`150px \${FONT_normal}\`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle    = '#e5dfd9';
    ctx.fillText(state.weight, ${p.weight.x}, ${p.weight.y});
    ctx.restore();

    // ── FECHA ──
    ctx.save();
    ctx.font         = \`130px \${FONT_normal}\`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle    = '#3a3a3a';
    ctx.fillText(state.date || '', ${p.date.x}, ${p.date.y});
    ctx.restore();

    // ── NOMBRE ──
    ctx.save();
    ctx.font         = \`700 200px \${FONT_nombre}\`;
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle    = '#7b1427';
    ctx.fillText(state.name.toUpperCase(), ${p.name.x}, ${p.name.y}, 1700);
    ctx.restore();

    // ── CLUB ──
    ctx.save();
    ctx.font         = \`400 130px \${FONT_normal}\`;
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle    = '#3a3a3a';
    ctx.fillText(state.club.toUpperCase(), ${p.club.x}, ${p.club.y}, 2700);
    ctx.restore();

    ctx.restore();
},`;
    }

    // ── Construye el HTML del overlay ─────────────────────────────
    function buildOverlay() {
        const el = document.createElement('div');
        el.id = 'posEditorOverlay';
        el.style.cssText = `
            position:fixed; inset:0; z-index:9999;
            background:rgba(0,0,0,0.82);
            display:flex; align-items:flex-start; justify-content:center;
            padding:20px; gap:20px; overflow-y:auto;
            font-family:sans-serif;
        `;

        // ── Panel izquierdo: preview canvas ──
        const left = document.createElement('div');
        left.style.cssText = 'flex-shrink:0; display:flex; flex-direction:column; align-items:center; gap:8px;';

        previewCanvas = document.createElement('canvas');
        previewCanvas.width  = PREVIEW_W;
        previewCanvas.height = Math.round(CH * previewScale);
        previewCanvas.style.cssText = `
            border-radius:8px; border:2px solid #444;
            background:#111; max-height:80vh; width:${PREVIEW_W}px;
        `;
        previewCtx = previewCanvas.getContext('2d');

        const previewLabel = document.createElement('p');
        previewLabel.textContent = 'Preview con crosshairs';
        previewLabel.style.cssText = 'color:#aaa; font-size:12px; margin:0;';

        left.appendChild(previewCanvas);
        left.appendChild(previewLabel);

        // ── Panel derecho: controles ──
        const right = document.createElement('div');
        right.style.cssText = `
            flex:1; max-width:340px; display:flex; flex-direction:column; gap:12px;
        `;

        const title = document.createElement('h2');
        title.textContent = '⚙ Editor de posiciones — Rusia 2018';
        title.style.cssText = 'color:#fff; font-size:16px; margin:0;';
        right.appendChild(title);

        const sub = document.createElement('p');
        sub.textContent = 'Mové los sliders. El preview se actualiza en tiempo real.';
        sub.style.cssText = 'color:#888; font-size:12px; margin:0;';
        right.appendChild(sub);

        // Sliders por campo
        FIELDS.forEach(f => {
            const card = document.createElement('div');
            card.style.cssText = `
                background:#1e1e1e; border:1px solid #333; border-radius:8px;
                padding:10px; border-left:3px solid ${f.color};
            `;

            const lbl = document.createElement('div');
            lbl.textContent = f.label;
            lbl.style.cssText = `color:${f.color}; font-size:12px; font-weight:bold; margin-bottom:6px;`;
            card.appendChild(lbl);

            ['x', 'y'].forEach(axis => {
                const max = axis === 'x' ? CW : CH;
                const row = document.createElement('div');
                row.style.cssText = 'display:flex; align-items:center; gap:8px; margin-bottom:4px;';

                const axLbl = document.createElement('span');
                axLbl.textContent = axis.toUpperCase();
                axLbl.style.cssText = 'color:#666; font-size:11px; width:12px;';

                const slider = document.createElement('input');
                slider.type  = 'range';
                slider.min   = 0;
                slider.max   = max;
                slider.step  = 1;
                slider.value = positions[f.key][axis];
                slider.style.cssText = 'flex:1; accent-color:' + f.color + ';';

                const val = document.createElement('span');
                val.id = `pe_${f.key}_${axis}`;
                val.textContent = positions[f.key][axis];
                val.style.cssText = 'color:#ccc; font-size:11px; font-family:monospace; width:36px; text-align:right;';

                slider.addEventListener('input', e => {
                    positions[f.key][axis] = parseInt(e.target.value);
                    val.textContent = e.target.value;
                    refreshPreview();
                    refreshCode();
                });

                row.appendChild(axLbl);
                row.appendChild(slider);
                row.appendChild(val);
                card.appendChild(row);
            });

            right.appendChild(card);
        });

        // Botones
        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex; gap:8px; margin-top:4px;';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 Copiar draw()';
        copyBtn.style.cssText = `
            flex:1; padding:10px; background:#c8102e; color:#fff;
            border:none; border-radius:6px; cursor:pointer; font-size:13px; font-weight:bold;
        `;
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(generateDrawCode()).then(() => {
                copyBtn.textContent = '✅ Copiado!';
                setTimeout(() => { copyBtn.textContent = '📋 Copiar draw()'; }, 2000);
            });
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕ Cerrar';
        closeBtn.style.cssText = `
            padding:10px 16px; background:#333; color:#fff;
            border:none; border-radius:6px; cursor:pointer; font-size:13px;
        `;
        closeBtn.addEventListener('click', close);

        btnRow.appendChild(copyBtn);
        btnRow.appendChild(closeBtn);
        right.appendChild(btnRow);

        // Caja de código generado
        const codeBox = document.createElement('pre');
        codeBox.id = 'pe_codeBox';
        codeBox.style.cssText = `
            background:#111; color:#0f0; font-size:9px; font-family:monospace;
            padding:8px; border-radius:6px; max-height:160px; overflow-y:auto;
            white-space:pre; border:1px solid #333; margin:0;
        `;
        codeBox.textContent = generateDrawCode();
        right.appendChild(codeBox);

        el.appendChild(left);
        el.appendChild(right);

        // Cerrar al click en el fondo
        el.addEventListener('click', e => { if (e.target === el) close(); });

        return el;
    }

    function refreshCode() {
        const box = document.getElementById('pe_codeBox');
        if (box) box.textContent = generateDrawCode();
    }

    // La función refreshPreview necesita acceso al estado global del editor
    // Se setea cuando se abre el panel
    let _getEditorState = null;

    function refreshPreview() {
        if (!_getEditorState) return;
        const { edState, imgs, tints, photo, flagImg } = _getEditorState();
        drawPreview(edState, imgs, tints, photo, flagImg);
    }

    // ── API pública ────────────────────────────────────────────────
    function open(getEditorState) {
        if (overlayEl) return;
        _getEditorState = getEditorState;
        overlayEl = buildOverlay();
        document.body.appendChild(overlayEl);
        // Primer render
        refreshPreview();
    }

    function close() {
        if (overlayEl) {
            overlayEl.remove();
            overlayEl = null;
        }
    }

    function isOpen() { return !!overlayEl; }

    return { open, close, isOpen };
})();


// ─────────────────────────────────────────────
//  INYECCIÓN DEL BOTÓN EN LOS CONTROLES
//  Parchea renderEditionControls para agregar
//  el botón solo cuando la edición es Rusia 2018
// ─────────────────────────────────────────────

(function injectButton() {
    // Espera a que el DOM esté listo y editor.js haya cargado
    function tryInject() {
        if (typeof renderEditionControls === 'undefined' ||
            typeof activeEdition === 'undefined') {
            setTimeout(tryInject, 100);
            return;
        }

        // Observa cambios en #editionControlsSlot para inyectar el botón
        // cada vez que se renderizan los controles
        const slot = document.getElementById('editionControlsSlot');
        if (!slot) { setTimeout(tryInject, 100); return; }

        const observer = new MutationObserver(() => {
            if (typeof activeEdition === 'undefined') return;
            if (activeEdition.id !== 'edition-2018') return;
            if (document.getElementById('posEditorBtn')) return;

            const btn = document.createElement('button');
            btn.id = 'posEditorBtn';
            btn.textContent = '⚙ Ajustar posiciones de texto';
            btn.style.cssText = `
                width:100%; margin-top:12px; padding:10px;
                background:#7b1427; color:#fff;
                border:none; border-radius:6px;
                cursor:pointer; font-size:13px; font-weight:bold;
                font-family:inherit;
            `;
            btn.addEventListener('click', () => {
                PositionEditor.open(() => ({
                    edState: state,
                    imgs,
                    tints,
                    photo,
                    flagImg,
                }));
            });

            // Agrega el botón al final del slot de controles
            slot.appendChild(btn);
        });

        observer.observe(slot, { childList: true, subtree: false });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInject);
    } else {
        tryInject();
    }
})();
