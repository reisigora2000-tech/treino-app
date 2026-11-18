'use strict';
/* ---------- estado e armazenamento local (funciona offline) ---------- */
// Perfil da pessoa (vem do profile.js de cada pasta; o app do Igor usa os valores padrão)
const P0 = (typeof PROFILE !== 'undefined') ? PROFILE : {};
const KEY = P0.key || 'treino.v1';
const PID = P0.id || '';                 // identifica a pessoa no script do Google
const GOAL = P0.goal || 'massa';         // 'massa' ou 'saude'
const GYMRATS = P0.gymrats !== false;
const DEFAULT = { logs: {}, body: {}, pending: [], cfg: { url: '', token: '' }, lastSync: 0, start: '' };
let S = load();
function load() {
  try { return Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY)) || {}); }
  catch (e) { return JSON.parse(JSON.stringify(DEFAULT)); }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function markPending(k) { if (!S.pending.includes(k)) S.pending.push(k); save(); updateStatus(); scheduleSync(); }

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null) el.append(c.nodeType ? c : document.createTextNode(c));
  return el;
}
const todayStr = () => new Date().toLocaleDateString('sv-SE');
const parseD = s => new Date(s + 'T12:00:00');
const startDate = () => (typeof START_DATE !== 'undefined' ? START_DATE : (S.start || todayStr()));
const weekNum = d => P0.rotation
  ? 1 + Math.floor(sessionsBefore(d) / P0.rotation.order.length)      // rodízio: cada 4 treinos concluídos = 1 semana do plano
  : Math.max(1, Math.floor((parseD(d) - parseD(startDate())) / 864e5 / 7) + 1);

/* ---------- rodízio de treinos (vai quantos dias conseguir; o app mostra o próximo da fila) ---------- */
function sessionMap() { const m = {}; for (const r of Object.values(S.logs)) if (r.done) { const k = r.date + '|' + r.wk; m[k] = (m[k] || 0) + 1; } return m; }
function sessionsList() {   // sessões com ao menos 3 séries feitas, em ordem de data
  return Object.entries(sessionMap()).filter(([, n]) => n >= 3).map(([k]) => { const [date, wk] = k.split('|'); return { date, wk }; })
    .sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
}
const sessionsBefore = d => sessionsList().filter(s => s.date < d).length;
function nextWorkout(t) {
  const order = P0.rotation.order, today = sessionMap();
  const todays = Object.keys(today).filter(k => k.startsWith(t + '|')).sort((a, b) => today[b] - today[a]);
  if (todays.length) return todays[0].split('|')[1];            // já treinou hoje: continua nesse treino
  const prev = sessionsList().filter(s => s.date < t).pop();
  if (!prev) return order[0];
  return order[(order.indexOf(prev.wk) + 1) % order.length];
}
function restNotes(t) {
  const R = P0.rotation, notes = [], wd = parseD(t).getDay();
  const treinouHoje = Object.keys(sessionMap()).some(k => k.startsWith(t + '|'));
  if ((R.offDays || []).includes(wd)) notes.push('Hoje é dia livre de treino. Se estiver bem, pode treinar mesmo assim.');
  const prev = sessionsList().filter(s => s.date < t).pop();
  if (R.restBetween && prev && !treinouHoje && Math.round((parseD(t) - parseD(prev.date)) / 864e5) === 1)
    notes.push(`Você treinou ontem (${PLAN[prev.wk]?.name || 'treino'}). O ideal é descansar hoje e treinar amanhã. Se estiver bem, o próximo é o ${PLAN[nextWorkout(t)].name}.`);
  return notes;
}
// séries podem variar por fase (plano iniciante: 1 série nas semanas 1-2, depois 2)
const setsOf = (ex, d) => (typeof setsFor === 'function' ? setsFor(ex, weekNum(d)) : ex.sets);
const fmtDate = d => parseD(d).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
const fmtShort = d => parseD(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
const num = v => { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : null; };
const topReps = r => { const m = String(r).match(/\d+/g); return m ? +m[m.length - 1] : 0; };
const fmtKg = n => (Math.round(n * 10) / 10).toString().replace('.', ',');

/* ---------- navegação ---------- */
let tab = 'hoje';
let selWk = null;          // treino selecionado (UA/LA/UB/LB)
let progEx = null;         // exercício aberto na evolução
const openMedia = new Set();
document.querySelectorAll('#tabs button').forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab; render(); window.scrollTo(0, 0); }));

function render() {
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  const t = todayStr();
  $('#hdate').textContent = fmtDate(t);
  $('#htitle').textContent = { hoje: 'Treino de hoje', corpo: 'Peso corporal', progresso: 'Evolução', config: 'Ajustes' }[tab];
  const v = $('#view'); v.replaceChildren();
  ({ hoje: viewHoje, corpo: viewCorpo, progresso: viewProg, config: viewConfig }[tab])(v);
}

/* ---------- logs ---------- */
const logKey = (d, wk, i, s) => `${d}|${wk}|${i}|${s}`;
function lastPerf(wk, i, beforeDate) {
  let best = null;
  for (const r of Object.values(S.logs)) {
    if (r.wk !== wk || r.exi !== i || r.date >= beforeDate || !r.done) continue;
    if (!best || r.date > best) best = r.date;
  }
  if (!best) return null;
  const sets = {};
  for (const r of Object.values(S.logs)) if (r.wk === wk && r.exi === i && r.date === best && r.done) sets[r.set] = r;
  return { date: best, sets };
}
function saveSet(date, wk, i, s, kg, reps, done) {
  const k = logKey(date, wk, i, s);
  if (kg == null && reps == null && !done) { if (S.logs[k]) { delete S.logs[k]; S.pending = S.pending.filter(p => p !== 'l:' + k); markPending('d:' + k); } return; }
  S.logs[k] = { k, date, wk, exi: i, exName: PLAN[wk].ex[i].n, set: s, kg, reps, done: !!done, ts: Date.now() };
  S.pending = S.pending.filter(p => p !== 'd:' + k);
  markPending('l:' + k);
}

/* ---------- aba Treino ---------- */
function viewHoje(v) {
  const t = todayStr(), wd = parseD(t).getDay();
  const planned = P0.rotation ? nextWorkout(t) : WEEKDAY_PLAN[wd];
  if (!selWk) selWk = planned || null;
  const wk = weekNum(t);
  v.append(h('div', { class: 'chips' },
    Object.entries(PLAN).map(([id, p]) => h('button', { class: 'chip' + (selWk === id ? ' on' : ''), onclick: () => { selWk = id; render(); } }, p.name, planned === id ? h('small', {}, P0.rotation ? 'próximo' : 'hoje') : null))));
  const ph = phaseInfo(wk);
  if (P0.rotation) restNotes(t).forEach(n => v.append(h('div', { class: 'banner warn' }, n)));
  v.append(h('div', { class: 'banner' + (ph.warn ? ' warn' : '') }, h('b', {}, `Semana ${wk} de ${PROGRAM_WEEKS}`), ` · ${ph.name}. ${ph.tip}`, P0.rotation ? h('div', { class: 'small', style: 'margin-top:4px' }, `A semana avança a cada ${P0.rotation.order.length} treinos concluídos.`) : null));
  if (P0.avisos) v.append(h('details', { class: 'card' }, h('summary', {}, 'Cuidados antes de treinar'), h('ul', { class: 'plain' }, P0.avisos.map(a => h('li', {}, a)))));
  if (!selWk) {
    v.append(h('div', { class: 'card rest' }, h('div', { class: 'big' }, 'Dia de descanso'),
      h('p', { class: 'muted' }, 'Hoje não tem treino no plano. Caminhada leve, alimentação em dia e sono de 7 a 8 horas.'),
      h('p', { class: 'muted' }, 'Quer treinar mesmo assim? Escolha um treino acima.')));
    return;
  }
  const P = PLAN[selWk];
  v.append(h('div', { class: 'banner' }, h('b', {}, P.name), ' · ', P.tag, ' · ', P.ex.length + ' exercícios'));
  P.ex.forEach((ex, i) => v.append(exCard(selWk, ex, i, t)));
  const done = P.ex.reduce((a, ex, i) => a + [...Array(setsOf(ex, t)).keys()].filter(s => S.logs[logKey(t, selWk, i, s + 1)]?.done).length, 0);
  const total = P.ex.reduce((a, ex) => a + setsOf(ex, t), 0);
  v.append(h('div', { class: 'card' }, h('div', { class: 'row' }, h('div', {}, h('div', { class: 'muted' }, 'Séries concluídas'), h('div', { class: 'big', id: 'prog' }, `${done}/${total}`))),
    h('div', { class: 'small' }, 'Os registros ficam salvos no aparelho e vão para a planilha quando houver internet.')));
  // Gymrats: o treino vai para o Apple Health por um Atalho do iPhone; o Gymrats lê de lá.
  if (!GYMRATS) return;
  const mins = h('input', { type: 'number', inputmode: 'numeric', id: 'mins', value: suggestMins(t, selWk), min: '5', max: '240' });
  mins.addEventListener('input', () => { mins.dataset.edited = 1; });
  v.append(h('div', { class: 'card' }, h('b', {}, 'Terminou o treino?'),
    h('div', { class: 'small' }, 'Registra no Apple Health pelo Atalho "' + (S.cfg.shortcut || SHORTCUT_NAME) + '" e o Gymrats puxa de lá. Configure em Ajustes.'),
    h('label', {}, 'Duração do treino (minutos)'), mins, h('div', { style: 'height:12px' }),
    h('button', { class: 'btn', onclick: () => {
      const m = Math.max(5, Math.min(240, Math.round(num(mins.value) || 0)));
      if (!m) { mins.focus(); return; }
      location.href = `shortcuts://run-shortcut?name=${encodeURIComponent(S.cfg.shortcut || SHORTCUT_NAME)}&input=text&text=${m}`;
    } }, 'Enviar para o Apple Health')));
}
const SHORTCUT_NAME = 'Registrar Treino';
function suggestMins(date, wk) {
  const ts = Object.values(S.logs).filter(r => r.date === date && r.wk === wk && r.done).map(r => r.ts);
  if (ts.length < 2) return 60;
  return Math.min(180, Math.max(10, Math.round((Math.max(...ts) - Math.min(...ts)) / 60000) + 3));
}

function exCard(wk, ex, i, date) {
  const prev = lastPerf(wk, i, date);
  const unit = ex.unit === 's' ? 's' : (ex.unit === 'min' || ex.unit === 'seg') ? ex.unit : 'kg';
  const timeOnly = unit === 'min' || unit === 'seg', nSets = setsOf(ex, date);   // tempo: só minutos ou segundos, sem carga
  const card = h('div', { class: 'card' });
  const media = h('div', { class: 'media' + (openMedia.has(wk + i) ? ' open' : '') });
  const fillMedia = () => {
    if (media.dataset.ok) return; media.dataset.ok = 1;
    media.append(
      ex.img ? h('div', { class: 'imgs' }, [0, 1].map(n => h('img', { src: `${IMG_BASE}${ex.img}/${n}.jpg`, alt: `${ex.n} - posição ${n + 1}`, loading: 'lazy', onerror: e => e.target.style.visibility = 'hidden' }))) : null,
      h('ul', { class: 'cues' }, ex.cues.map(c => h('li', {}, c))),
      h('a', { class: 'vid', href: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(ex.yt), target: '_blank', rel: 'noopener noreferrer' }, '▶  Ver vídeo da execução'),
      h('div', { class: 'credit' }, 'Imagens: free-exercise-db (domínio público). Vídeo abre no YouTube.'));
  };
  if (openMedia.has(wk + i)) fillMedia();
  card.append(h('div', { class: 'exh' },
    h('div', {}, h('div', { class: 'exn' }, ex.n), h('div', { class: 'exm' }, `${nSets} × ${ex.reps}${unit === 's' || unit === 'seg' ? ' s' : unit === 'min' ? ' min' : ''}${timeOnly ? '' : ' · descanso ' + (ex.rest >= 120 ? (ex.rest / 60) + ' min' : ex.rest + ' s')}`)),
    h('button', { class: 'info', 'aria-label': 'Ver como fazer', onclick: () => { const o = media.classList.toggle('open'); o ? (openMedia.add(wk + i), fillMedia()) : openMedia.delete(wk + i); } }, '?')), media);
  if (prev) {
    const all = Object.values(prev.sets);
    const hit = all.length >= nSets && all.every(r => unit === 'kg' ? (r.reps ?? 0) >= topReps(ex.reps) : true);
    if (unit === 'kg' && hit) card.append(h('div', { class: 'hint' }, `Na última vez (${fmtShort(prev.date)}) você bateu o topo das repetições. Tente subir a carga um pouco hoje.`));
  }
  const sets = h('div', { class: 'sets' }, h('div', { class: 'srow head' + (timeOnly ? ' time' : '') }, h('span'), timeOnly ? null : h('span', {}, unit), h('span', {}, timeOnly ? (unit === 'seg' ? 'segundos' : 'minutos') : unit === 's' ? 'tempo' : 'reps'), h('span')));
  for (let s = 1; s <= nSets; s++) {
    const cur = S.logs[logKey(date, wk, i, s)], p = prev?.sets[s] || prev?.sets[1];
    const kg = h('input', { type: 'number', inputmode: 'decimal', step: '0.5', placeholder: p?.kg != null ? fmtKg(p.kg) : '–', value: cur?.kg ?? '' });
    const rp = h('input', { type: 'number', inputmode: 'numeric', placeholder: p?.reps ?? (timeOnly ? ex.reps.split('-')[0] : ex.reps.split('-').pop()), value: cur?.reps ?? '' });
    const row = h('div', { class: 'srow' + (timeOnly ? ' time' : '') + (cur?.done ? ' done' : '') }, h('div', { class: 'n' }, s), timeOnly ? null : kg, rp);
    const read = () => [timeOnly ? null : num(kg.value), num(rp.value)];
    const persist = done => { const [a, b] = read(); saveSet(date, wk, i, s, a, b, done); };
    const ck = h('button', { class: 'ck', 'aria-label': 'Concluir série', onclick: () => {
      const on = !row.classList.contains('done');
      if (on) { if (!timeOnly && !kg.value && kg.placeholder !== '–') kg.value = kg.placeholder.replace(',', '.'); if (!rp.value) rp.value = rp.placeholder; }
      row.classList.toggle('done', on); persist(on);
      if (on) { if (!timeOnly) startTimer(ex.rest, ex.n); } else stopTimer();
      refreshProg();
    } }, '✓');
    kg.addEventListener('change', () => persist(row.classList.contains('done')));
    rp.addEventListener('change', () => persist(row.classList.contains('done')));
    row.append(ck); sets.append(row);
  }
  card.append(sets);
  return card;
}
function refreshProg() {
  const el = $('#prog'); if (!el || !selWk) return;
  const t = todayStr(), P = PLAN[selWk];
  const done = P.ex.reduce((a, ex, i) => a + [...Array(setsOf(ex, t)).keys()].filter(s => S.logs[logKey(t, selWk, i, s + 1)]?.done).length, 0);
  el.textContent = `${done}/${P.ex.reduce((a, ex) => a + setsOf(ex, t), 0)}`;
  const m = $('#mins'); if (m && !m.dataset.edited) m.value = suggestMins(t, selWk);
}

/* ---------- cronômetro de descanso ---------- */
let tmr = null, audioCtx = null;
function startTimer(sec, label) {
  try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  stopTimer(true);
  tmr = { end: Date.now() + sec * 1000, total: sec, label };
  $('#timer').hidden = false; $('#tlabel').textContent = 'Descanso · ' + label;
  tmr.iv = setInterval(tick, 250); tick();
}
function tick() {
  if (!tmr) return;
  const left = Math.max(0, Math.ceil((tmr.end - Date.now()) / 1000));
  $('#tclock').textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0');
  $('#tbar').style.transform = `scaleX(${Math.max(0, (tmr.end - Date.now()) / (tmr.total * 1000))})`;
  if (left <= 0) { beep(); if (navigator.vibrate) navigator.vibrate([200, 100, 200]); $('#tlabel').textContent = 'Descanso terminou'; clearInterval(tmr.iv); setTimeout(() => { if (tmr && Date.now() >= tmr.end) stopTimer(); }, 4000); }
}
function stopTimer(keep) { if (tmr) { clearInterval(tmr.iv); tmr = null; } if (!keep) $('#timer').hidden = true; }
function beep() {
  try { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.frequency.value = 880; g.gain.value = .15; o.start(); o.stop(audioCtx.currentTime + .35); } catch (e) {}
}
$('#tplus').addEventListener('click', () => { if (tmr) { tmr.end += 15000; tmr.total += 15; } });
$('#tskip').addEventListener('click', () => stopTimer());

/* ---------- gráficos ---------- */
function chart(points, unit) {
  const W = 320, H = 150, P = { l: 34, r: 10, t: 12, b: 22 };
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const AC = css('--accent') || '#3ddc97', GRID = css('--line') || '#262e37';
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'chart');
  const add = (t, a, txt) => { const e = document.createElementNS(ns, t); for (const k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; svg.append(e); return e; };
  if (points.length < 2) { add('text', { x: W / 2, y: H / 2, 'text-anchor': 'middle', fill: '#8a96a3', 'font-size': 12 }, points.length ? 'Registre mais um dia para ver a linha' : 'Sem dados ainda'); return svg; }
  let lo = Math.min(...points.map(p => p.y)), hi = Math.max(...points.map(p => p.y));
  if (hi - lo < 1) { hi += .5; lo -= .5; }
  const pad = (hi - lo) * .15; lo -= pad; hi += pad;
  const X = i => P.l + i * (W - P.l - P.r) / (points.length - 1), Y = y => P.t + (hi - y) * (H - P.t - P.b) / (hi - lo);
  [lo + pad, (lo + hi) / 2, hi - pad].forEach(g => { add('line', { x1: P.l, x2: W - P.r, y1: Y(g), y2: Y(g), stroke: GRID }); add('text', { x: P.l - 5, y: Y(g) + 4, 'text-anchor': 'end', fill: '#8a96a3', 'font-size': 10 }, fmtKg(g)); });
  add('polyline', { points: points.map((p, i) => `${X(i)},${Y(p.y)}`).join(' '), fill: 'none', stroke: AC, 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
  points.forEach((p, i) => { add('circle', { cx: X(i), cy: Y(p.y), r: 3.5, fill: AC }); if (i === 0 || i === points.length - 1 || points.length <= 6) add('text', { x: X(i), y: H - 6, 'text-anchor': 'middle', fill: '#8a96a3', 'font-size': 10 }, p.x); });
  return svg;
}

/* ---------- aba Corpo ---------- */
function viewCorpo(v) {
  const t = todayStr(), dates = Object.keys(S.body).sort();
  const inp = h('input', { type: 'number', inputmode: 'decimal', step: '0.1', placeholder: 'ex.: 80,4', value: S.body[t]?.kg ?? '' });
  v.append(h('div', { class: 'card' }, h('label', { for: 'x' }, 'Peso de hoje (kg), de preferência em jejum'), inp,
    h('div', { style: 'height:10px' }), h('button', { class: 'btn', onclick: () => {
      const n = num(inp.value); if (n == null || n < 30 || n > 300) { inp.focus(); return; }
      S.body[t] = { date: t, kg: n, ts: Date.now() }; markPending('b:' + t); render();
    } }, 'Salvar peso')));
  if (dates.length) {
    const last = S.body[dates[dates.length - 1]].kg, weekAgo = dates.filter(d => (parseD(t) - parseD(d)) / 864e5 >= 6);
    const ref = weekAgo.length ? S.body[weekAgo[weekAgo.length - 1]].kg : null, diff = ref != null ? last - ref : null;
    v.append(h('div', { class: 'grid2' },
      h('div', { class: 'stat' }, h('div', { class: 'muted' }, 'Atual'), h('div', { class: 'v' }, fmtKg(last) + ' kg')),
      h('div', { class: 'stat' }, h('div', { class: 'muted' }, 'Últimos 7 dias'), h('div', { class: 'v ' + (diff == null || GOAL !== 'massa' ? '' : diff >= .2 && diff <= .6 ? 'up' : 'down') }, diff == null ? '–' : (diff > 0 ? '+' : '') + fmtKg(diff) + ' kg'))));
    v.append(h('div', { class: 'small', style: 'margin:8px 2px' }, GOAL === 'massa' ? 'Meta para ganho de massa: +0,25 a +0,5 kg por semana. Abaixo disso por 2-3 semanas, aumente ~100 kcal/dia; acima, reduza.' : (P0.bodyNote || 'Pese-se uma vez por semana, no mesmo horário e com a mesma roupa. Oscilações pequenas são normais.')));
    v.append(h('div', { class: 'card' }, chart(dates.map(d => ({ x: fmtShort(d), y: S.body[d].kg })))));
    v.append(h('h2', {}, 'Histórico'), h('div', { class: 'card list' }, dates.slice().reverse().map((d, i, a) => {
      const prev = a[i + 1] ? S.body[a[i + 1]].kg : null, dv = prev != null ? S.body[d].kg - prev : null;
      return h('div', { class: 'it' }, h('span', {}, fmtShort(d)), h('span', {}, fmtKg(S.body[d].kg) + ' kg', dv != null ? h('span', { class: 'small' }, `  (${dv > 0 ? '+' : ''}${fmtKg(dv)})`) : null));
    })));
  }
}

/* ---------- aba Evolução ---------- */
function viewProg(v) {
  const t = todayStr(), mon = new Date(parseD(t)); mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));
  const monS = mon.toLocaleDateString('sv-SE'), sessions = new Set();
  for (const r of Object.values(S.logs)) if (r.done && r.date >= monS) sessions.add(r.date + r.wk);
  let all = new Set(); for (const r of Object.values(S.logs)) if (r.done) all.add(r.date + r.wk);
  v.append(h('div', { class: 'grid2' },
    h('div', { class: 'stat' }, h('div', { class: 'muted' }, 'Treinos esta semana'), h('div', { class: 'v' }, sessions.size + ' / 4')),
    h('div', { class: 'stat' }, h('div', { class: 'muted' }, 'Treinos no total'), h('div', { class: 'v' }, all.size))));
  const names = [...new Set(Object.values(PLAN).flatMap(p => p.ex.filter(e => !e.unit).map(e => e.n)))];
  if (!progEx || !names.includes(progEx)) progEx = names[0];
  const sel = h('select', { onchange: e => { progEx = e.target.value; render(); } }, names.map(n => h('option', { value: n, selected: n === progEx }, n)));
  v.append(h('label', {}, 'Exercício'), sel);
  const byDate = {};
  for (const r of Object.values(S.logs)) if (r.done && r.exName === progEx && r.kg != null) {
    const o = byDate[r.date] = byDate[r.date] || { best: 0, vol: 0, sets: [] };
    o.best = Math.max(o.best, r.kg); o.vol += r.kg * (r.reps || 0); o.sets.push(r);
  }
  const ds = Object.keys(byDate).sort();
  v.append(h('div', { class: 'card' }, h('div', { class: 'muted' }, 'Maior carga por treino (kg)'), chart(ds.map(d => ({ x: fmtShort(d), y: byDate[d].best })))));
  if (ds.length) v.append(h('div', { class: 'card list' }, ds.slice().reverse().map(d =>
    h('div', { class: 'it' }, h('span', {}, fmtShort(d)), h('span', {}, byDate[d].sets.sort((a, b) => a.set - b.set).map(s => `${fmtKg(s.kg)}×${s.reps ?? '?'}`).join('  '))))));
  else v.append(h('div', { class: 'small' }, 'Conclua séries na aba Treino para ver a evolução aqui.'));
}

/* ---------- aba Ajustes ---------- */
function viewConfig(v) {
  const url = h('input', { type: 'url', placeholder: 'https://script.google.com/macros/s/.../exec', value: S.cfg.url, autocapitalize: 'off', autocorrect: 'off' });
  const tok = h('input', { type: 'password', placeholder: 'mesma senha do script', value: S.cfg.token, autocapitalize: 'off' });
  const msg = h('div', { class: 'small', style: 'margin-top:10px;min-height:20px' });
  v.append(h('div', { class: 'card' },
    h('b', {}, 'Planilha do Google Drive'), h('div', { class: 'small' }, 'Cole o link do app do Google (Apps Script) e a senha. Sem isso, tudo fica salvo só neste aparelho.'),
    h('label', {}, 'Link do script'), url, h('label', {}, 'Senha'), tok, h('div', { style: 'height:12px' }),
    h('button', { class: 'btn', onclick: async () => { S.cfg.url = url.value.trim(); S.cfg.token = tok.value.trim(); save(); msg.textContent = 'Sincronizando…'; msg.textContent = await sync(true); updateStatus(); } }, 'Salvar e sincronizar'),
    h('button', { class: 'btn sec', onclick: async () => { S.cfg.url = url.value.trim(); S.cfg.token = tok.value.trim(); save(); msg.textContent = 'Baixando…'; msg.textContent = await pull(); render0(); } }, 'Baixar dados da planilha'), msg));
  const sc = h('input', { type: 'text', value: S.cfg.shortcut || SHORTCUT_NAME, autocapitalize: 'off', autocorrect: 'off' });
  sc.addEventListener('change', () => { S.cfg.shortcut = sc.value.trim() || SHORTCUT_NAME; save(); });
  if (GYMRATS) v.append(h('div', { class: 'card' }, h('b', {}, 'Gymrats (via Apple Health)'),
    h('div', { class: 'small' }, 'O Gymrats não tem integração direta: ele lê treinos do Apple Health. Um Atalho do iPhone grava o treino lá.'),
    h('label', {}, 'Nome do atalho'), sc,
    h('details', {}, h('summary', {}, 'Como criar o atalho'),
      h('ol', {},
        h('li', {}, 'Abra o app Atalhos > + (novo atalho) e dê o nome exato acima.'),
        h('li', {}, 'Adicione "Obter texto da entrada" (recebe os minutos do app).'),
        h('li', {}, 'Adicione "Registrar treino". Tipo: Treinamento de força tradicional. Duração: a variável Texto, em minutos.'),
        h('li', {}, 'Data de início: adicione antes "Ajustar data" (data atual, subtrair os minutos) e use o resultado. Sem isso, o treino começa agora.'),
        h('li', {}, 'Na primeira vez, permita escrever treinos no app Saúde.'),
        h('li', {}, 'Gymrats > perfil > Apple Health: permita ler Treinos. Confira se o treino aparece no app Saúde.')))));
  v.append(h('div', { class: 'card' }, h('b', {}, 'Backup'), h('div', { class: 'small' }, 'Baixa um arquivo com todos os seus registros.'), h('div', { style: 'height:10px' }),
    h('button', { class: 'btn sec', onclick: () => {
      const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify({ logs: S.logs, body: S.body }, null, 2)], { type: 'application/json' })), download: `treino-backup-${todayStr()}.json` });
      document.body.append(a); a.click(); a.remove();
    } }, 'Exportar backup')));
  v.append(h('details', { class: 'card' }, h('summary', {}, 'Instalar no iPhone'),
    h('ol', {}, h('li', {}, 'Abra este site no Safari.'), h('li', {}, 'Toque no botão de compartilhar.'), h('li', {}, 'Escolha "Adicionar à Tela de Início".'), h('li', {}, 'Abra pelo ícone. Depois do primeiro acesso, funciona sem internet.'))));
  v.append(h('div', { class: 'card' }, h('b', {}, 'Lembretes'), h('div', { class: 'small' }, 'Em breve: lembretes de treino no calendário do iPhone, que tocam mesmo com o app fechado.')));
  if (typeof START_DATE === 'undefined' && !P0.rotation) {
    const di = h('input', { type: 'date', value: S.start });
    di.addEventListener('change', () => { if (di.value) { S.start = di.value; save(); render(); } });
    v.append(h('div', { class: 'card' }, h('b', {}, 'Início do plano'), h('div', { class: 'small' }, 'Muda a contagem das semanas.'), h('label', {}, 'Data de início'), di));
  }
  v.append(h('div', { class: 'small', style: 'text-align:center;margin:14px 0' }, 'Semana ' + weekNum(todayStr()) + ' do plano' + (P0.rotation ? ' · cada ' + P0.rotation.order.length + ' treinos concluídos avançam 1 semana' : ' · início em ' + fmtShort(startDate()))));
}
function render0() { render(); }

/* ---------- sincronização com a planilha (Apps Script) ---------- */
const online = () => navigator.onLine !== false;
function updateStatus() {
  const el = $('#status'), n = S.pending.length;
  el.className = 'status' + (!online() ? ' off' : n && S.cfg.url ? ' pend' : '');
  $('#stxt').textContent = !online() ? 'offline' : !S.cfg.url ? 'só neste aparelho' : n ? `${n} a enviar` : 'sincronizado';
}
let syncTimer = null;
function scheduleSync() { if (!S.cfg.url) return; clearTimeout(syncTimer); syncTimer = setTimeout(() => sync(false), 1500); }
let syncing = false;
async function sync(manual) {
  if (!S.cfg.url) return 'Cole o link do script primeiro.';
  if (!online()) return 'Sem internet. Os registros serão enviados quando voltar.';
  if (syncing) return 'Já sincronizando…'; syncing = true;
  try {
    const batch = S.pending.slice(), records = batch.map(p => {
      const kind = p[0], key = p.slice(2);
      if (kind === 'l') return S.logs[key] ? { kind: 'log', ...S.logs[key] } : null;
      if (kind === 'b') return S.body[key] ? { kind: 'body', ...S.body[key] } : null;
      return { kind: 'del', k: key };
    }).filter(Boolean);
    // sem nada a enviar, o botão manual ainda confere o link e a senha (antes dizia "sincronizado" mesmo com senha errada)
    if (!records.length && manual) { const m = await pull(); return m.startsWith('Baixado') ? 'Conectado: link e senha corretos, planilha ligada.' : m; }
    if (records.length) {
      const r = await fetch(S.cfg.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ token: S.cfg.token, profile: PID, records }) });
      const j = await r.json();
      if (!j.ok) return 'Erro: ' + (j.error || 'resposta inválida');
    }
    S.pending = S.pending.filter(p => !batch.includes(p)); S.lastSync = Date.now(); save();
    return records.length ? `Enviado: ${records.length} registro(s).` : 'Tudo já estava sincronizado.';
  } catch (e) { return 'Não consegui falar com o Google. Confira o link e a internet.'; }
  finally { syncing = false; updateStatus(); }
}
async function pull() {
  if (!S.cfg.url) return 'Cole o link do script primeiro.';
  try {
    // POST (e não GET) para a senha não ir na URL, que fica em histórico e logs
    const r = await fetch(S.cfg.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ token: S.cfg.token, profile: PID, action: 'pull' }) });
    const j = await r.json(); if (!j.ok) return 'Erro: ' + (j.error || 'resposta inválida');
    let n = 0;
    for (const x of j.logs || []) if (!S.logs[x.k] || S.logs[x.k].ts < x.ts) { S.logs[x.k] = x; n++; }
    for (const x of j.body || []) if (!S.body[x.date] || S.body[x.date].ts < x.ts) { S.body[x.date] = x; n++; }
    save(); return `Baixado: ${n} registro(s) novo(s) ou mais recentes.`;
  } catch (e) { return 'Não consegui baixar. Confira o link e a internet.'; }
}
window.addEventListener('online', () => { updateStatus(); scheduleSync(); });
window.addEventListener('offline', updateStatus);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { if (tab === 'hoje' && !tmr) {} scheduleSync(); } });

/* ---------- início ---------- */
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
if (P0.accent) document.documentElement.style.setProperty('--accent', P0.accent);   // cor própria de cada pessoa
if (P0.theme) for (const [k, v] of Object.entries(P0.theme)) document.documentElement.style.setProperty('--' + k, v);   // tema completo (fundo, cartões, etc.)
if (typeof START_DATE === 'undefined' && !S.start) { S.start = todayStr(); save(); }   // perfis sem data fixa começam no 1º uso
updateStatus(); render(); scheduleSync();
