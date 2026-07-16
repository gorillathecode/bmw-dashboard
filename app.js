/* ============================================================
   Template Planner — Interaktion
   Alle Kennzahlen stammen aus data.js (Analyse im R-Notebook).
   ============================================================ */

const nf = new Intl.NumberFormat('de-DE');
const pf = (x, d = 0) =>
  new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: d, maximumFractionDigits: d
  }).format(x * 100) + '\u2009%';

/* Ist-Zustand ohne Templates: distinkte Konfigurationen im Datensatz */
const IST_KONFIGURATIONEN = 14064;

/* ---------------- Tabs ---------------- */

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('is-active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('is-active'));
    tab.classList.add('is-active');
    document.getElementById('view-' + tab.dataset.view).classList.add('is-active');
  });
});

/* ---------------- 01 Portfolio ---------------- */

const curve = DATA.curve;               // [{t, cov}]
const total = DATA.total_vehicles;

const covAt = t => {
  const hit = curve.find(p => p.t === t);
  if (hit) return hit.cov;
  const below = curve.filter(p => p.t <= t).pop();
  return below ? below.cov : 0;
};

/* --- Kurve zeichnen (einmalig) --- */

const SVG_W = 900, SVG_H = 380;
const PAD = { l: 56, r: 24, t: 20, b: 42 };
const PLOT_W = SVG_W - PAD.l - PAD.r;
const PLOT_H = SVG_H - PAD.t - PAD.b;
const T_MAX = 400;

const sx = t => PAD.l + (t / T_MAX) * PLOT_W;
const sy = c => PAD.t + (1 - c) * PLOT_H;

function drawCurve() {
  const svg = document.getElementById('curve');
  const el = (tag, attrs, txt) => {
    const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (txt !== undefined) n.textContent = txt;
    return n;
  };

  /* Gitter + Y-Achse */
  [0, .25, .5, .75, 1].forEach(c => {
    svg.appendChild(el('line', {
      class: 'grid-line', x1: PAD.l, x2: SVG_W - PAD.r, y1: sy(c), y2: sy(c)
    }));
    svg.appendChild(el('text', {
      class: 'axis-txt', x: PAD.l - 10, y: sy(c) + 4, 'text-anchor': 'end'
    }, pf(c)));
  });

  /* X-Achse */
  svg.appendChild(el('line', {
    class: 'axis-line', x1: PAD.l, x2: SVG_W - PAD.r, y1: sy(0), y2: sy(0)
  }));
  [0, 100, 200, 300, 400].forEach(t => {
    svg.appendChild(el('text', {
      class: 'axis-txt', x: sx(t), y: sy(0) + 20, 'text-anchor': 'middle'
    }, t));
  });
  svg.appendChild(el('text', {
    class: 'axis-txt', x: PAD.l, y: SVG_H - 6
  }, 'Anzahl Templates im Portfolio'));

  /* Fläche + Linie */
  const pts = curve.map(p => `${sx(p.t)},${sy(p.cov)}`).join(' ');
  svg.appendChild(el('polygon', {
    class: 'curve-area',
    points: `${sx(0)},${sy(0)} ${pts} ${sx(T_MAX)},${sy(0)}`
  }));
  svg.appendChild(el('polyline', { class: 'curve-path', points: pts }));

  /* Marker (wird bewegt) */
  const g = el('g', { id: 'marker' });
  g.appendChild(el('line', { class: 'marker-line', id: 'mk-line' }));
  g.appendChild(el('circle', { class: 'marker-dot', id: 'mk-dot', r: 5 }));
  g.appendChild(el('text', { class: 'marker-txt', id: 'mk-txt' }));
  svg.appendChild(g);
}

function moveMarker(t, cov) {
  const x = sx(t), y = sy(cov);
  document.getElementById('mk-line').setAttribute('x1', x);
  document.getElementById('mk-line').setAttribute('x2', x);
  document.getElementById('mk-line').setAttribute('y1', y);
  document.getElementById('mk-line').setAttribute('y2', sy(0));
  document.getElementById('mk-dot').setAttribute('cx', x);
  document.getElementById('mk-dot').setAttribute('cy', y);
  const txt = document.getElementById('mk-txt');
  txt.setAttribute('x', x < SVG_W - 130 ? x + 12 : x - 12);
  txt.setAttribute('y', y - 12);
  txt.setAttribute('text-anchor', x < SVG_W - 130 ? 'start' : 'end');
  txt.textContent = pf(cov);
}

/* --- Empfehlungstext: sagt, was die Zahl bedeutet --- */

function verdict(t, cov, marginal) {
  if (t < 50) {
    return `Bei <b>${t} Templates</b> bleiben ${pf(1 - cov)} der Nachfrage ` +
      `außerhalb des Standardangebots. Jedes weitere Template bringt hier noch ` +
      `<b>${pf(marginal, 2)}</b> zusätzliche Abdeckung — der Ausbau lohnt klar.`;
  }
  if (t <= 130) {
    return `<b>${t} Templates</b> decken ${pf(cov)} der Nachfrage ab. In diesem ` +
      `Bereich knickt die Kurve: Der Grenznutzen ist auf <b>${pf(marginal, 2)}</b> ` +
      `je Template gefallen. Das ist der empfohlene Betriebspunkt — ` +
      `<b>rund 100 Templates</b> ersetzen ${nf.format(IST_KONFIGURATIONEN)} ` +
      `heutige Konfigurationen.`;
  }
  return `<b>${t} Templates</b> decken ${pf(cov)} ab, aber der Grenznutzen liegt ` +
    `nur noch bei <b>${pf(marginal, 2)}</b> je Template. Jede weitere Variante ` +
    `kostet mehr Planungs- und Teilekomplexität, als sie an Nachfrage einbringt. ` +
    `Der Rest der Nachfrage ist echte Individualisierung — dafür bleibt der ` +
    `Konfigurator.`;
}

function update(t) {
  const cov = covAt(t);
  const covNext = covAt(Math.min(t + 5, T_MAX));
  const marginal = Math.max((covNext - cov) / 5, 0);

  document.getElementById('slider-out').textContent = t;
  document.getElementById('m-cov').textContent = pf(cov);
  document.getElementById('m-cov-sub').textContent =
    `${nf.format(Math.round(cov * total))} von ${nf.format(total)} Bestellungen`;
  document.getElementById('m-red').textContent =
    pf(1 - t / IST_KONFIGURATIONEN, 1);
  document.getElementById('m-marg').textContent = '+' + pf(marginal, 2);
  document.getElementById('verdict-txt').innerHTML = verdict(t, cov, marginal);

  moveMarker(t, cov);
}

drawCurve();
const slider = document.getElementById('slider');
slider.addEventListener('input', e => update(+e.target.value));
update(+slider.value);

/* ---------------- Externe Faktoren je Modell ---------------- */

const cf = c =>
  (c > 0 ? '+' : '\u2212') +
  new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  }).format(Math.abs(c));

function renderExternals(name) {
  const rows = EXT.models[name];
  const box = document.getElementById('ext-bars');

  if (!rows || !rows.length) {
    box.innerHTML = `<p class="ext-none">
      Dieses Modell kommt in weniger als 10 Märkten vor. Eine Korrelation mit
      Ländermerkmalen wäre hier nicht belastbar &mdash; sie würde im Wesentlichen
      abbilden, in welchem einzelnen Markt das Modell verkauft wird.
      ${EXT.excluded_models} von 52 Modellen sind aus diesem Grund ausgeschlossen.
    </p>`;
    return;
  }

  box.innerHTML = rows.map(r => {
    const pct = Math.abs(r.c) * 50;          // 50 % = volle Halbbreite
    const sign = r.c >= 0 ? 'pos' : 'neg';
    return `<div class="xrow">
      <span class="xrow-name">${r.f}</span>
      <span class="xtrack">
        <span class="xbar ${sign}" style="width:${pct}%"></span>
      </span>
      <span class="xval ${sign}">${cf(r.c)}</span>
    </div>`;
  }).join('') + `
    <div class="xscale">
      <span></span>
      <span class="xscale-inner"><span>\u22121,0</span><span>0</span><span>+1,0</span></span>
      <span></span>
    </div>`;
}

/* Korrelation einer einzelnen Option (für die Template-Karten) */
function optExt(optName) {
  const key = optName.replace('\u2014', '-');   // Em-Dash zurück
  const hit = EXT.options[key] || EXT.options[optName];
  if (!hit || !hit.length) return '';
  const t = hit[0];
  return `<p class="opt-ext">Stärkster Ländereinfluss:
    ${t.f} <b>${cf(t.c)}</b></p>`;
}


/* ---------------- 02 Modell-Detail ---------------- */

/* Nur die S 1000 R ist qualitativ ausgewertet (Deep-Dive im Notebook).
   Für die übrigen Modelle liegt die Cover-Analyse vor, aber keine
   benannten Blöcke — das wird ehrlich angezeigt statt erfunden. */

const S1000R_TEMPLATES = [
  {
    name: 'T1 — Connected Basis',
    badge: 'In die Serie', badgeClass: 'badge-serie',
    opts: ['KEYLESS RIDE', 'TYRE PRESSURE INDICATOR (RDC)',
           'INTELLIGENT EMERGENCY CALL', 'TELESERVICES'],
    support: 0.790, kohaesion: 0.90,
    why: 'Vier von fünf Kundinnen und Kunden bestellen diesen Block vollständig. ' +
         'Bei dieser Durchdringung ist er faktisch keine Wahl mehr. ' +
         '<b>Empfehlung: in die Serienausstattung überführen</b> und aus dem ' +
         'Konfigurator streichen — spart vier Optionspositionen ohne einen ' +
         'einzigen Kunden zu verlieren.'
  },
  {
    name: 'T3 — Licht & Komfort',
    badge: 'Neues Paket', badgeClass: 'badge-new',
    opts: ['HEADLIGHT PRO', 'ADAPTIVE HEADLIGHTS', 'DAYTIME RUNNING LAMP',
           'USB CHARGING SOCKET', 'MSR — DYNAMIC ENGINE BRAKE CONTROL'],
    support: 0.293, kohaesion: 0.98,
    why: 'Der zentrale Fund. Diese fünf Optionen korrelieren untereinander mit ' +
         '<b>0,99 bis 1,00</b> — wer eine bestellt, bestellt praktisch immer alle. ' +
         '<b>BMW Motorrad bietet dafür bis heute kein Paket an.</b> ' +
         'Ein Template, das ohne Nachfrageverlust sofort eingeführt werden kann.'
  },
  {
    name: 'T2 — M Performance',
    badge: 'Wahlfrei lassen', badgeClass: 'badge-keep',
    opts: ['M ENDURANCE CHAIN', 'M LIGHTWEIGHT BATTERY', 'M FORGED WHEELS',
           'M GPS-LAPTRIGGER', 'M SPORT SEAT'],
    support: 0.238, kohaesion: 0.55,
    why: 'Mit 55&nbsp;% die schwächste Bindung im Modell: Kunden greifen hier ' +
         'gezielt einzelne Teile heraus. <b>Hier ist Individualisierung echter ' +
         'Kundennutzen</b>, kein Wildwuchs. Ein starres Paket würde Nachfrage ' +
         'abschneiden — die Optionen bleiben einzeln wählbar.'
  }
];

const S1000R_FLAGS = { katalog: 70, serie: 7, gefiltert: 40, frei: 23 };

const sel = document.getElementById('model-select');
DATA.models.forEach(m => {
  const o = document.createElement('option');
  o.value = m.name;
  o.textContent = `${m.name}  (${nf.format(m.n)} Fahrzeuge)`;
  sel.appendChild(o);
});
sel.value = 'S 1000 R';

function bar(label, val, blue) {
  return `<div class="bar-row">
    <div class="bar-label"><span>${label}</span><b>${pf(val)}</b></div>
    <div class="bar-track">
      <div class="bar-fill${blue ? ' is-blue' : ''}" style="width:${val * 100}%"></div>
    </div>
  </div>`;
}

function renderModel(name) {
  const m = DATA.models.find(x => x.name === name);
  const isDeepDive = name === 'S 1000 R';

  /* Kopfzahlen */
  document.getElementById('model-stats').innerHTML = `
    <div class="ms"><b>${nf.format(m.n)}</b><span>Fahrzeuge</span></div>
    <div class="ms${m.t80 > 20 ? ' is-flag' : ''}">
      <b>${m.t80 ?? '—'}</b><span>Templates für 80&thinsp;%</span></div>
    <div class="ms"><b>${pf(m.maxcov)}</b><span>max. Abdeckung</span></div>
  `;

  renderExternals(name);

  document.getElementById('model-detail').hidden = !isDeepDive;
  document.getElementById('model-generic').hidden = isDeepDive;

  if (!isDeepDive) return;

  const f = S1000R_FLAGS;
  document.querySelectorAll('.funnel-step b')[0].textContent = f.katalog;
  document.querySelectorAll('.funnel-step b')[1].textContent = '−' + f.serie;
  document.querySelectorAll('.funnel-step b')[2].textContent = '−' + f.gefiltert;
  document.querySelectorAll('.funnel-step b')[3].textContent = f.frei;

  document.getElementById('template-cards').innerHTML =
    S1000R_TEMPLATES.map(t => `
      <article class="card">
        <div class="card-id">
          <h3>${t.name}</h3>
          <span class="card-badge ${t.badgeClass}">${t.badge}</span>
        </div>
        <div class="card-opts">
          <ul>${t.opts.map(o => `<li>${o}</li>`).join('')}</ul>
          <p class="card-why">${t.why}</p>
          ${t.opts.map(optExt).filter(Boolean)[0] || ''}
        </div>
        <div class="card-nums">
          ${bar('Bestellt (vollständig)', t.support, true)}
          ${bar('Kohäsion', t.kohaesion, false)}
        </div>
      </article>
    `).join('');
}

sel.addEventListener('change', e => renderModel(e.target.value));
renderModel('S 1000 R');


/* ---------------- 03 Märkte ---------------- */

const wrap = document.getElementById('markets');
DATA.markets.slice(0, 12).forEach(mk => {
  const tops = DATA.top_by_market[mk.id] || [];
  const max = tops.length ? tops[0].n : 1;
  const div = document.createElement('div');
  div.className = 'mkt';
  div.innerHTML = `
    <div class="mkt-head">
      <span class="mkt-id">${mk.id}</span>
      <span class="mkt-n">${nf.format(mk.n)}</span>
    </div>
    <ul class="mkt-list">
      ${tops.map(t => `
        <li>
          <span class="mk-name">${t.name}</span>
          <span class="mk-bar"><i style="width:${(t.n / max) * 100}%"></i></span>
          <span class="mk-n">${nf.format(t.n)}</span>
        </li>`).join('')}
    </ul>`;
  wrap.appendChild(div);
});
