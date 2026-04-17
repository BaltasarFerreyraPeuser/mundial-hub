
const GROUPS = {
    'A': [
        { code: 'MEX', name: 'México', flag: '🇲🇽' },
        { code: 'RSA', name: 'Sudáfrica', flag: '🇿🇦' },
        { code: 'KOR', name: 'Corea del Sur', flag: '🇰🇷' },
        { code: 'CZE', name: 'Rep. Checa', flag: '🇨🇿' },
    ],
    'B': [
        { code: 'CAN', name: 'Canadá', flag: '🇨🇦' },
        { code: 'BIH', name: 'Bosnia', flag: '🇧🇦' },
        { code: 'QAT', name: 'Qatar', flag: '🇶🇦' },
        { code: 'SUI', name: 'Suiza', flag: '🇨🇭' },
    ],
    'C': [
        { code: 'BRA', name: 'Brasil', flag: '🇧🇷' },
        { code: 'MAR', name: 'Marruecos', flag: '🇲🇦' },
        { code: 'HAI', name: 'Haití', flag: '🇭🇹' },
        { code: 'SCO', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
    ],
    'D': [
        { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸' },
        { code: 'PAR', name: 'Paraguay', flag: '🇵🇾' },
        { code: 'AUS', name: 'Australia', flag: '🇦🇺' },
        { code: 'TUR', name: 'Turquía', flag: '🇹🇷' },
    ],
    'E': [
        { code: 'GER', name: 'Alemania', flag: '🇩🇪' },
        { code: 'CUW', name: 'Curazao', flag: '🇨🇼' },
        { code: 'CIV', name: 'Costa de Marfil', flag: '🇨🇮' },
        { code: 'ECU', name: 'Ecuador', flag: '🇪🇨' },
    ],
    'F': [
        { code: 'NED', name: 'Países Bajos', flag: '🇳🇱' },
        { code: 'JPN', name: 'Japón', flag: '🇯🇵' },
        { code: 'SWE', name: 'Suecia', flag: '🇸🇪' },
        { code: 'TUN', name: 'Túnez', flag: '🇹🇳' },
    ],
    'G': [
        { code: 'BEL', name: 'Bélgica', flag: '🇧🇪' },
        { code: 'EGY', name: 'Egipto', flag: '🇪🇬' },
        { code: 'IRI', name: 'Irán', flag: '🇮🇷' },
        { code: 'NZL', name: 'Nueva Zelanda', flag: '🇳🇿' },
    ],
    'H': [
        { code: 'ESP', name: 'España', flag: '🇪🇸' },
        { code: 'CPV', name: 'Cabo Verde', flag: '🇨🇻' },
        { code: 'KSA', name: 'Arabia Saudita', flag: '🇸🇦' },
        { code: 'URU', name: 'Uruguay', flag: '🇺🇾' },
    ],
    'I': [
        { code: 'FRA', name: 'Francia', flag: '🇫🇷' },
        { code: 'SEN', name: 'Senegal', flag: '🇸🇳' },
        { code: 'IRQ', name: 'Irak', flag: '🇮🇶' },
        { code: 'NOR', name: 'Noruega', flag: '🇳🇴' },
    ],
    'J': [
        { code: 'ARG', name: 'Argentina', flag: '🇦🇷' },
        { code: 'ALG', name: 'Argelia', flag: '🇩🇿' },
        { code: 'AUT', name: 'Austria', flag: '🇦🇹' },
        { code: 'JOR', name: 'Jordania', flag: '🇯🇴' },
    ],
    'K': [
        { code: 'POR', name: 'Portugal', flag: '🇵🇹' },
        { code: 'COD', name: 'RD Congo', flag: '🇨🇩' },
        { code: 'UZB', name: 'Uzbekistán', flag: '🇺🇿' },
        { code: 'COL', name: 'Colombia', flag: '🇨🇴' },
    ],
    'L': [
        { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
        { code: 'CRO', name: 'Croacia', flag: '🇭🇷' },
        { code: 'GHA', name: 'Ghana', flag: '🇬🇭' },
        { code: 'PAN', name: 'Panamá', flag: '🇵🇦' },
    ],
};


const R32_MATCHES = [
  { id:'r32_1',  a:'1A', b:'3D' },
  { id:'r32_2',  a:'2B', b:'2C' },
  { id:'r32_3',  a:'1C', b:'3B' },
  { id:'r32_4',  a:'1B', b:'3A' },
  { id:'r32_5',  a:'1F', b:'3E' },
  { id:'r32_6',  a:'2E', b:'2D' },
  { id:'r32_7',  a:'1E', b:'3F' },
  { id:'r32_8',  a:'2F', b:'2A' },
  { id:'r32_9',  a:'1H', b:'3G' },
  { id:'r32_10', a:'2G', b:'2I' },
  { id:'r32_11', a:'1G', b:'3H' },
  { id:'r32_12', a:'1I', b:'3J' },
  { id:'r32_13', a:'1L', b:'3K' },
  { id:'r32_14', a:'2K', b:'2L' },
  { id:'r32_15', a:'1K', b:'3L' },
  { id:'r32_16', a:'2J', b:'2H' },
];

const state = {
  groupResults: {},
  selectedThirds: [],
  bracket: {},
  rounds: [],
};

Object.keys(GROUPS).forEach(g => {
  state.groupResults[g] = { first: null, second: null, third: null };
});

const FLAGS_PATH = '../assets/flags/miniflags/';

function flagEl(team, size = 34) {
  if (!team) return `<div class="team-flag-emoji" style="width:${size}px;height:${size}px;font-size:${Math.round(size*0.55)}px">❓</div>`;
  const img = new Image();
  const src = `${FLAGS_PATH}${team.code}.png`;
  return `<img
    class="team-flag-img"
    src="${src}"
    alt="${team.name}"
    style="width:${size}px;height:${size}px"
    onerror="this.outerHTML='<div class=\\'team-flag-emoji\\' style=\\'width:${size}px;height:${size}px;font-size:${Math.round(size*0.55)}px\\'>${team.flag}</div>'"
  >`;
}

function matchFlagEl(team) {
  if (!team) return `<div class="match-team-emoji">❓</div>`;
  return `<img
    class="match-team-flag"
    src="${FLAGS_PATH}${team.code}.png"
    alt="${team.name}"
    onerror="this.outerHTML='<div class=\\'match-team-emoji\\'>${team.flag}</div>'"
  >`;
}

function resolveSlot(slot) {
  // slot: '1A', '2B', '3C', o '3RD_n' para los 8 terceros ya seleccionados
  if (!slot) return null;
  const pos = parseInt(slot[0]);
  const group = slot[1];
  const r = state.groupResults[group];
  if (!r) return null;
  if (pos === 1) return r.first;
  if (pos === 2) return r.second;
  if (pos === 3) return r.third;
  return null;
}

// ── FASE 1: GRUPOS ────────────────────────────────────────────
function buildGroupNav() {
  const nav = document.getElementById('groupNav');
  nav.innerHTML = Object.keys(GROUPS).map(g =>
    `<button class="group-tab" data-group="${g}" onclick="switchGroup('${g}')">Grupo ${g}</button>`
  ).join('');
  switchGroup('A');
}

function switchGroup(letter) {
  document.querySelectorAll('.group-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.group === letter);
  });
  document.querySelectorAll('.group-panel').forEach(p => {
    p.classList.toggle('active', p.dataset.group === letter);
  });
}

function buildGroupPanels() {
  const container = document.getElementById('groupPanels');
  container.innerHTML = Object.entries(GROUPS).map(([letter, teams]) => `
    <div class="group-panel" data-group="${letter}">
      <div class="group-panel-inner">
        <div class="group-panel-title">Grupo ${letter}</div>
        <div class="group-panel-subtitle">Seleccioná el orden de clasificación</div>
        ${teams.map(team => `
          <div class="team-row" data-group="${letter}" data-code="${team.code}"
               onclick="cycleRank('${letter}','${team.code}')">
            ${flagEl(team, 34)}
            <span class="team-name">${team.name}</span>
            <span class="team-code">${team.code}</span>
            <div class="pos-badge empty" id="badge-${letter}-${team.code}">—</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function cycleRank(letter, code) {
  const r = state.groupResults[letter];
  const team = GROUPS[letter].find(t => t.code === code);

  // Si ya tiene posición, quitarla
  if (r.first && r.first.code === code)       { r.first  = null; }
  else if (r.second && r.second.code === code){ r.second = null; }
  else if (r.third && r.third.code === code)  { r.third  = null; }
  else {
    // Asignar la próxima posición libre
    if (!r.first)       r.first  = team;
    else if (!r.second) r.second = team;
    else if (!r.third)  r.third  = team;
    // Si ya hay 3, no hace nada (tienen que desmarcar primero)
  }

  refreshGroupUI(letter);
  updateGroupsProgress();
}

function refreshGroupUI(letter) {
  const r = state.groupResults[letter];
  const teams = GROUPS[letter];

  teams.forEach(team => {
    const row   = document.querySelector(`.team-row[data-group="${letter}"][data-code="${team.code}"]`);
    const badge = document.getElementById(`badge-${letter}-${team.code}`);
    if (!row || !badge) return;

    // Limpiar
    row.classList.remove('rank-1', 'rank-2', 'rank-3');
    badge.className = 'pos-badge empty';
    badge.textContent = '—';

    if (r.first  && r.first.code  === team.code) {
      row.classList.add('rank-1');
      badge.className = 'pos-badge pos-1';
      badge.textContent = '1°';
    } else if (r.second && r.second.code === team.code) {
      row.classList.add('rank-2');
      badge.className = 'pos-badge pos-2';
      badge.textContent = '2°';
    } else if (r.third  && r.third.code  === team.code) {
      row.classList.add('rank-3');
      badge.className = 'pos-badge pos-3';
      badge.textContent = '3°';
    }
  });

  // Marcar tab como completo
  const complete = r.first && r.second && r.third;
  const tab = document.querySelector(`.group-tab[data-group="${letter}"]`);
  if (tab) tab.classList.toggle('complete', !!complete);
}

function updateGroupsProgress() {
  const total    = Object.keys(GROUPS).length; // 12
  const complete = Object.values(state.groupResults)
    .filter(r => r.first && r.second && r.third).length;

  document.getElementById('groupsProgressText').textContent =
    `${complete} / ${total} grupos completados`;
  document.getElementById('progressFill').style.width =
    `${(complete / total) * 100}%`;

  document.getElementById('btnToThirds').disabled = complete < total;
}

// ── FASE 2: MEJORES TERCEROS ──────────────────────────────────
function buildThirdsGrid() {
  const grid = document.getElementById('thirdsGrid');
  const thirds = Object.entries(state.groupResults)
    .map(([letter, r]) => ({ ...r.third, group: letter }))
    .filter(t => t && t.code);

  grid.innerHTML = thirds.map(team => `
    <div class="third-card" data-code="${team.code}" onclick="toggleThird('${team.code}')">
      ${flagEl(team, 36).replace('team-flag-img', 'third-flag-img').replace('team-flag-emoji', 'third-flag-emoji')}
      <div class="third-info">
        <div class="third-name">${team.name}</div>
        <div class="third-group">Grupo ${team.group} · 3º</div>
      </div>
      <div class="third-check" id="third-check-${team.code}"></div>
    </div>
  `).join('');
}

function toggleThird(code) {
  const already = state.selectedThirds.findIndex(t => t.code === code);
  if (already > -1) {
    state.selectedThirds.splice(already, 1);
  } else {
    if (state.selectedThirds.length >= 8) return; // máx 8
    const team = Object.values(state.groupResults)
      .map(r => r.third).find(t => t && t.code === code);
    if (team) state.selectedThirds.push(team);
  }
  refreshThirdsUI();
}

function refreshThirdsUI() {
  const count = state.selectedThirds.length;
  const codes = state.selectedThirds.map(t => t.code);

  document.querySelectorAll('.third-card').forEach(card => {
    const code = card.dataset.code;
    const sel  = codes.includes(code);
    card.classList.toggle('selected', sel);
    const check = document.getElementById(`third-check-${code}`);
    if (check) check.textContent = sel ? '✓' : '';
  });

  const counter = document.getElementById('thirdsCounter');
  counter.textContent = `${count} / 8 seleccionados`;
  counter.classList.toggle('ready', count === 8);

  document.getElementById('btnToBracket').disabled = count !== 8;
}


let bracketMatches = {}; 
let bracketRounds  = []; 

function buildBracket() {
  bracketMatches = {};
  bracketRounds  = [];

  const thirdsSlots = R32_MATCHES.filter(m => m.b.startsWith('3')).map(m => m.id);
  const thirdsMap   = {};
  thirdsSlots.forEach((matchId, i) => {
    thirdsMap[matchId] = state.selectedThirds[i] || null;
  });

  const round32 = R32_MATCHES.map(m => {
    const teamA = resolveSlot(m.a);
    const teamB = m.b.startsWith('3') ? thirdsMap[m.id] : resolveSlot(m.b);
    bracketMatches[m.id] = { teamA, teamB, winner: null };
    return m.id;
  });
  bracketRounds.push({ label: 'Ronda de 32', matches: round32 });

  const roundNames = ['Ronda de 16', 'Cuartos de Final', 'Semifinal', 'Final'];
  let prev = round32;
  roundNames.forEach((name, ri) => {
    const curr = [];
    for (let i = 0; i < prev.length; i += 2) {
      const id = `r${ri + 2}_${Math.floor(i / 2) + 1}`;
      bracketMatches[id] = { teamA: null, teamB: null, winner: null };
      curr.push(id);
    }
    bracketRounds.push({ label: name, matches: curr });
    prev = curr;
  });

  renderBracket();
}

function pickWinner(matchId, which) {
  const m = bracketMatches[matchId];
  if (!m) return;
  const winner = which === 'A' ? m.teamA : m.teamB;
  if (!winner) return;

  if (m.winner && m.winner.code === winner.code) {
    m.winner = null;
    propagateWinner(matchId, null);
    renderBracket();
    return;
  }

  m.winner = winner;
  propagateWinner(matchId, winner);
  renderBracket();
  checkChampion();
}

function propagateWinner(matchId, winner) {
  for (let ri = 0; ri < bracketRounds.length - 1; ri++) {
    const idx = bracketRounds[ri].matches.indexOf(matchId);
    if (idx === -1) continue;

    const nextRound = bracketRounds[ri + 1];
    const nextMatchIdx = Math.floor(idx / 2);
    const nextMatchId  = nextRound.matches[nextMatchIdx];
    const slot         = idx % 2 === 0 ? 'teamA' : 'teamB';

    const nm = bracketMatches[nextMatchId];
    if (!nm) return;

    const prev = nm[slot];
    nm[slot] = winner;

    if (nm.winner && prev && nm.winner.code === prev.code) {
      nm.winner = null;
      propagateWinner(nextMatchId, null);
    }
    return;
  }
}

function checkChampion() {
  const finalMatchId = bracketRounds[bracketRounds.length - 1].matches[0];
  const finalMatch   = bracketMatches[finalMatchId];
  if (finalMatch && finalMatch.winner) {
    showChampion(finalMatch.winner);
  } else {
    document.getElementById('championDisplay').classList.add('hidden');
    document.getElementById('btnShareResult').style.display = 'none';
  }
}

function showChampion(team) {
  const display = document.getElementById('championDisplay');
  const nameEl  = document.getElementById('championName');
  const flagEl2 = document.getElementById('championFlag');

  nameEl.textContent = team.name;
  flagEl2.innerHTML  = `<img src="${FLAGS_PATH}${team.code}.png" alt="${team.name}"
    onerror="this.outerHTML='${team.flag}'" style="width:100%;height:100%;object-fit:cover">`;

  display.classList.remove('hidden');
  document.getElementById('btnShareResult').style.display = 'inline-flex';

  setTimeout(() => display.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
}

function renderBracket() {
  const bracket = document.getElementById('bracket');
  bracket.innerHTML = '';

  bracketRounds.forEach((round, ri) => {
    const col = document.createElement('div');
    col.className = `round-col${ri === bracketRounds.length - 1 ? ' final-col' : ''}`;

    const label = document.createElement('div');
    label.className = 'round-label';
    label.textContent = round.label;
    col.appendChild(label);

    round.matches.forEach(matchId => {
      const m   = bracketMatches[matchId];
      const wrap = document.createElement('div');
      wrap.className = 'match';

      const teamAEl = makeMatchTeamEl(matchId, m.teamA, 'A', m.winner);
      const sep     = document.createElement('div');
      sep.className = 'match-vs';
      const teamBEl = makeMatchTeamEl(matchId, m.teamB, 'B', m.winner);

      wrap.appendChild(teamAEl);
      wrap.appendChild(sep);
      wrap.appendChild(teamBEl);
      col.appendChild(wrap);
    });

    bracket.appendChild(col);

    if (ri < bracketRounds.length - 1) {
      const conn = document.createElement('div');
      conn.className = 'connector';
      bracket.appendChild(conn);
    }
  });

  const trophyCol = document.createElement('div');
  trophyCol.className = 'trophy-col';
  trophyCol.innerHTML = `<div class="trophy-icon">🏆</div><div class="trophy-label">Campeón</div>`;
  bracket.appendChild(trophyCol);
}

function makeMatchTeamEl(matchId, team, which, winner) {
  const div = document.createElement('div');
  div.className = 'match-team';

  if (!team) {
    div.classList.add('empty');
    div.innerHTML = `<div class="match-team-emoji">—</div><span class="match-team-name">A definir</span>`;
    return div;
  }

  const isWinner = winner && winner.code === team.code;
  const isLoser  = winner && winner.code !== team.code;
  if (isWinner) div.classList.add('winner');
  if (isLoser)  div.classList.add('loser');

  div.innerHTML = `
    ${matchFlagEl(team)}
    <span class="match-team-name">${team.name}</span>
    <div class="winner-dot"></div>
  `;

  div.addEventListener('click', () => pickWinner(matchId, which));
  return div;
}

function goToPhase(n) {
  ['phase1','phase2','phase3'].forEach((id, i) => {
    document.getElementById(id).classList.toggle('hidden', i + 1 !== n);
  });
  // Stepper
  document.querySelectorAll('.step').forEach(s => {
    const sn = parseInt(s.dataset.step);
    s.classList.toggle('active', sn === n);
    s.classList.toggle('done',   sn < n);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetAll() {
  if (!confirm('¿Reiniciar toda la simulación? Se perderán todos los datos.')) return;

  Object.keys(GROUPS).forEach(g => {
    state.groupResults[g] = { first: null, second: null, third: null };
  });
  state.selectedThirds = [];
  bracketMatches = {};
  bracketRounds  = [];

  // Reconstruir UI
  buildGroupPanels();
  buildGroupNav();
  updateGroupsProgress();

  document.getElementById('championDisplay').classList.add('hidden');
  document.getElementById('btnShareResult').style.display = 'none';

  goToPhase(1);
}

// ── COMPARTIR ─────────────────────────────────────────────────
document.getElementById('btnShareResult').addEventListener('click', () => {
  const finalMatchId = bracketRounds[bracketRounds.length - 1]?.matches[0];
  const champ = bracketMatches[finalMatchId]?.winner;
  if (!champ) return;
  const text = `🏆 Mi predicción para el Mundial 2026: ¡${champ.name} campeón del mundo! ¿Cuál es la tuya? Simulalo en mundial26.fan`;
  if (navigator.share) {
    navigator.share({ text, url: window.location.href });
  } else {
    navigator.clipboard.writeText(text)
      .then(() => alert('Predicción copiada al portapapeles ✓'));
  }
});

// ── INICIALIZAR ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildGroupPanels();
  buildGroupNav();
  updateGroupsProgress();

  // Fase 1 → Fase 2
  document.getElementById('btnToThirds').addEventListener('click', () => {
    buildThirdsGrid();
    refreshThirdsUI();
    goToPhase(2);
  });

  // Fase 2 → Fase 1
  document.getElementById('btnBackToGroups').addEventListener('click', () => goToPhase(1));

  // Fase 2 → Fase 3
  document.getElementById('btnToBracket').addEventListener('click', () => {
    buildBracket();
    goToPhase(3);
  });

  // Fase 3 → Fase 2
  document.getElementById('btnBackToThirds').addEventListener('click', () => goToPhase(2));

  // Reset
  document.getElementById('btnReset').addEventListener('click', resetAll);
});
