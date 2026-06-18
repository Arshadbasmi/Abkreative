'use strict';

// ── UTC Clock ──────────────────────────────────────────────────
const utcEl = document.getElementById('utc-clock');
function tickUTC() {
  const now = new Date();
  const h = String(now.getUTCHours()).padStart(2,'0');
  const m = String(now.getUTCMinutes()).padStart(2,'0');
  const s = String(now.getUTCSeconds()).padStart(2,'0');
  utcEl.textContent = `UTC ${h}:${m}:${s}`;
}
setInterval(tickUTC, 1000);
tickUTC();


// ── World Clocks ───────────────────────────────────────────────
const CITIES = [
  { name: 'NEW YORK',    tz: 'America/New_York',     offset: -5 },
  { name: 'LONDON',      tz: 'Europe/London',         offset:  0 },
  { name: 'PARIS',       tz: 'Europe/Paris',          offset:  1 },
  { name: 'DUBAI',       tz: 'Asia/Dubai',            offset:  4 },
  { name: 'MUMBAI',      tz: 'Asia/Kolkata',          offset:  5.5 },
  { name: 'SINGAPORE',   tz: 'Asia/Singapore',        offset:  8 },
  { name: 'TOKYO',       tz: 'Asia/Tokyo',            offset:  9 },
  { name: 'SYDNEY',      tz: 'Australia/Sydney',      offset: 10 },
  { name: 'LOS ANGELES', tz: 'America/Los_Angeles',   offset: -8 },
  { name: 'SAO PAULO',   tz: 'America/Sao_Paulo',     offset: -3 },
];

const clocksGrid = document.getElementById('clocks-grid');
CITIES.forEach(city => {
  const el = document.createElement('div');
  el.className = 'clock-item';
  el.innerHTML = `
    <div class="clock-city">${city.name}</div>
    <div class="clock-time" id="ct-${city.name.replace(/ /g,'_')}">00:00:00</div>
    <div class="clock-date" id="cd-${city.name.replace(/ /g,'_')}"></div>
    <div class="clock-offset">UTC${city.offset >= 0 ? '+' : ''}${city.offset}</div>
  `;
  clocksGrid.appendChild(el);
});

function updateClocks() {
  CITIES.forEach(city => {
    try {
      const now = new Date();
      const opts = { timeZone: city.tz, hour12: false,
        hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const dateOpts = { timeZone: city.tz, weekday: 'short',
        month: 'short', day: 'numeric' };
      const key = city.name.replace(/ /g,'_');
      document.getElementById(`ct-${key}`).textContent =
        now.toLocaleTimeString('en-GB', opts);
      document.getElementById(`cd-${key}`).textContent =
        now.toLocaleDateString('en-US', dateOpts).toUpperCase();
    } catch(e) {}
  });
}
setInterval(updateClocks, 1000);
updateClocks();


// ── Global Stats ───────────────────────────────────────────────
const STATS = [
  {
    id: 'population',
    label: 'WORLD POPULATION',
    icon: '🌍',
    color: 'blue',
    base: 8_200_000_000,
    rate: 2.6,
    format: v => formatBig(v),
  },
  {
    id: 'internet',
    label: 'INTERNET USERS',
    icon: '🌐',
    color: 'blue',
    base: 5_500_000_000,
    rate: 1.7,
    format: v => formatBig(v),
  },
  {
    id: 'emails',
    label: 'EMAILS SENT TODAY',
    icon: '✉️',
    color: 'green',
    base: 0,
    rate: 3_500_000 / 60,
    format: v => formatBig(v),
    resetDaily: true,
  },
  {
    id: 'tweets',
    label: 'SOCIAL POSTS TODAY',
    icon: '📡',
    color: 'green',
    base: 0,
    rate: 12_000 / 60,
    format: v => formatBig(v),
    resetDaily: true,
  },
  {
    id: 'co2',
    label: 'CO₂ EMITTED TODAY (kt)',
    icon: '🏭',
    color: 'red',
    base: 0,
    rate: 1_200 / 3600,
    format: v => Math.floor(v).toLocaleString(),
    resetDaily: true,
  },
  {
    id: 'energy',
    label: 'ENERGY USED TODAY (GWh)',
    icon: '⚡',
    color: 'yellow',
    base: 0,
    rate: 29_000 / 86400,
    format: v => v.toFixed(1),
    resetDaily: true,
  },
];

const statsEl = document.getElementById('stats-list');
const statState = {};

const secondsToday = () => {
  const now = new Date();
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
};

STATS.forEach(s => {
  const div = document.createElement('div');
  div.className = `stat-item ${s.color === 'green' ? 'green' : s.color === 'red' ? 'red' : s.color === 'yellow' ? 'yellow' : ''}`;
  div.innerHTML = `
    <span class="stat-icon">${s.icon}</span>
    <div class="stat-info">
      <div class="stat-label">${s.label}</div>
      <div>
        <span class="stat-value" id="sv-${s.id}">—</span>
        <span class="stat-delta" id="sd-${s.id}"></span>
      </div>
      <div class="stat-bar-wrap">
        <div class="stat-bar" id="sb-${s.id}" style="width:0%"></div>
      </div>
    </div>
  `;
  statsEl.appendChild(div);

  const seed = s.resetDaily ? s.rate * secondsToday() : s.base;
  statState[s.id] = { val: seed, prev: seed };
});

const statsBarMaxes = {};

function updateStats() {
  STATS.forEach(s => {
    const st = statState[s.id];
    const noise = (Math.random() - 0.48) * s.rate * 0.4;
    st.prev = st.val;
    st.val += s.rate + noise;
    if (st.val < 0) st.val = 0;

    const delta = st.val - st.prev;
    document.getElementById(`sd-${s.id}`).textContent = `+${s.format(delta)}/s`;
    document.getElementById(`sv-${s.id}`).textContent = s.format(st.val);

    if (!statsBarMaxes[s.id]) statsBarMaxes[s.id] = st.val * 2;
    const pct = Math.min(100, (st.val / statsBarMaxes[s.id]) * 100);
    document.getElementById(`sb-${s.id}`).style.width = pct + '%';
  });
}

setInterval(updateStats, 1000);
updateStats();

function formatBig(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(3) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}


// ── Internet Activity Chart ────────────────────────────────────
const SERIES = [
  { label: 'TRAFFIC (Tbps)',  color: '#00d4ff', base: 820, amp: 80  },
  { label: 'ATTACKS/min',     color: '#ff3e6c', base: 340, amp: 120 },
  { label: 'NEW SITES/min',   color: '#00ff9d', base: 12,  amp: 6   },
];
const CHART_POINTS = 60;
const seriesData = SERIES.map(s => Array.from({ length: CHART_POINTS },
  () => s.base + (Math.random() - 0.5) * s.amp));

const chartCanvas = document.getElementById('activity-chart');
const ctx = chartCanvas.getContext('2d');

function pushChart() {
  SERIES.forEach((s, i) => {
    seriesData[i].shift();
    const last = seriesData[i][seriesData[i].length - 1];
    const next = last + (Math.random() - 0.48) * s.amp * 0.4;
    seriesData[i].push(Math.max(s.base * 0.3, next));
  });
}

function drawChart() {
  const W = chartCanvas.offsetWidth * devicePixelRatio;
  const H = 140 * devicePixelRatio;
  chartCanvas.width = W;
  chartCanvas.height = H;

  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = '#0e3a5c55';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = (H / 4) * i;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  SERIES.forEach((s, si) => {
    const data = seriesData[si];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const pts = data.map((v, i) => ({
      x: (i / (CHART_POINTS - 1)) * W,
      y: H - ((v - min) / range) * H * 0.82 - H * 0.05,
    }));

    ctx.beginPath();
    ctx.moveTo(pts[0].x, H);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, H);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, s.color + '44');
    grad.addColorStop(1, s.color + '00');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 1.5 * devicePixelRatio;
    ctx.stroke();

    const lp = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(lp.x, lp.y, 3 * devicePixelRatio, 0, Math.PI * 2);
    ctx.fillStyle = s.color;
    ctx.fill();
  });
}

const legendEl = document.getElementById('activity-legend');
SERIES.forEach(s => {
  const item = document.createElement('div');
  item.className = 'legend-item';
  item.innerHTML = `<div class="legend-dot" style="background:${s.color}"></div>${s.label}`;
  legendEl.appendChild(item);
});

setInterval(() => { pushChart(); drawChart(); }, 1000);
drawChart();
window.addEventListener('resize', drawChart);


// ── Seismic Feed ───────────────────────────────────────────────
const LOCATIONS = [
  'Honshu, Japan','California, USA','Sumatra, Indonesia','Chile','Turkey',
  'Philippines','New Zealand','Alaska, USA','Italy','Mexico','Iran','Greece',
  'Peru','Tonga','Taiwan','Papua New Guinea','Nepal','Afghanistan','Pakistan',
  'Vanuatu','Solomon Islands','Fiji','Colombia','Argentina','Myanmar'
];

function magLevel(m) {
  if (m >= 7.0) return 'major';
  if (m >= 5.5) return 'strong';
  if (m >= 4.0) return 'moderate';
  return 'minor';
}

function genSeismic() {
  const mag = (Math.random() * 6.5 + 1.5).toFixed(1);
  const depth = Math.floor(Math.random() * 200 + 5);
  const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const level = magLevel(parseFloat(mag));
  const time = new Date().toUTCString().slice(17, 25);
  return { mag, depth, loc, level, time };
}

function addSeismicItem(ev) {
  const feed = document.getElementById('seismic-feed');
  const el = document.createElement('div');
  el.className = 'seismic-item';
  el.dataset.level = ev.level;
  el.innerHTML = `
    <span class="seismic-mag">M${ev.mag}</span>
    <div class="seismic-info">
      <div class="seismic-place">${ev.loc}</div>
      <div class="seismic-meta">UTC ${ev.time} · ${ev.level.toUpperCase()}</div>
    </div>
    <span class="seismic-depth">${ev.depth}km</span>
  `;
  feed.insertBefore(el, feed.firstChild);
  while (feed.children.length > 6) feed.removeChild(feed.lastChild);
}

for (let i = 0; i < 5; i++) addSeismicItem(genSeismic());

function scheduleSeismic() {
  setTimeout(() => { addSeismicItem(genSeismic()); scheduleSeismic(); },
    7000 + Math.random() * 8000);
}
scheduleSeismic();

async function loadRealSeismic() {
  try {
    const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
    const data = await res.json();
    const feed = document.getElementById('seismic-feed');
    feed.innerHTML = '';
    data.features.slice(0, 6).reverse().forEach(f => {
      const mag = f.properties.mag?.toFixed(1) ?? '?';
      const place = f.properties.place ?? 'Unknown';
      const depth = Math.round(f.geometry.coordinates[2]);
      const level = magLevel(parseFloat(mag));
      const time = new Date(f.properties.time).toUTCString().slice(17, 25);
      const el = document.createElement('div');
      el.className = 'seismic-item';
      el.dataset.level = level;
      el.innerHTML = `
        <span class="seismic-mag">M${mag}</span>
        <div class="seismic-info">
          <div class="seismic-place">${place}</div>
          <div class="seismic-meta">UTC ${time} · ${level.toUpperCase()} · USGS LIVE</div>
        </div>
        <span class="seismic-depth">${depth}km</span>
      `;
      feed.insertBefore(el, feed.firstChild);
    });
  } catch(e) { /* simulated fallback running */ }
}
loadRealSeismic();
setInterval(loadRealSeismic, 60_000);


// ── News Ticker ────────────────────────────────────────────────
const TICKER_ITEMS = [
  { cat: 'CLIMATE',  text: 'Arctic sea ice extent tracks 12% below 30-year average' },
  { cat: 'TECH',     text: 'Global AI compute capacity doubles for third consecutive year' },
  { cat: 'HEALTH',   text: 'WHO monitoring novel respiratory variant in Southeast Asia' },
  { cat: 'ECONOMY',  text: 'IMF revises global growth forecast to 3.1% for current year' },
  { cat: 'SPACE',    text: 'ESA confirms Ariane 6 payload deployment successful' },
  { cat: 'ENERGY',   text: 'Solar generation hits new record — 4.2 TWh in single day' },
  { cat: 'SECURITY', text: 'Coordinated DDoS campaigns targeting financial infrastructure' },
  { cat: 'OCEAN',    text: 'Pacific Ocean surface temps 0.4°C above seasonal baseline' },
  { cat: 'SCIENCE',  text: 'CERN announces results from high-luminosity collision series' },
  { cat: 'TRADE',    text: 'Container shipping index up 8% week-on-week at major ports' },
  { cat: 'CLIMATE',  text: 'Amazon basin deforestation rate slows for second consecutive quarter' },
  { cat: 'TECH',     text: 'Quantum processor achieves 1000-qubit milestone' },
  { cat: 'ECONOMY',  text: 'Gold crosses $3,200/oz amid currency volatility' },
  { cat: 'SPACE',    text: 'James Webb captures earliest galaxy formation at z > 14' },
  { cat: 'HEALTH',   text: 'Global antibiotic resistance database expanded to 194 nations' },
];

function buildTicker() {
  const track = document.getElementById('ticker-track');
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  track.innerHTML = doubled.map(item =>
    `<span class="ticker-item"><span class="ticker-cat">${item.cat}</span>${item.text}</span>`
  ).join('');
}
buildTicker();


// ── Globe (Canvas 2D) ──────────────────────────────────────────
const globeCanvas = document.getElementById('globe');
const gc = globeCanvas.getContext('2d');
const R = 220, CX = 240, CY = 240;
let rotY = 0, rotX = 0.3;
let isDragging = false, lastX = 0, lastY = 0, velX = 0, velY = 0;

const LAND = buildLandData();

function project(lat, lon, rY, rX) {
  const latR = lat * Math.PI / 180;
  const lonR = lon * Math.PI / 180;
  const x = Math.cos(latR) * Math.sin(lonR + rY);
  const y = -Math.sin(latR) * Math.cos(rX) + Math.cos(latR) * Math.cos(lonR + rY) * Math.sin(rX);
  const z =  Math.sin(latR) * Math.sin(rX) + Math.cos(latR) * Math.cos(lonR + rY) * Math.cos(rX);
  return { x: CX + x * R, y: CY + y * R, z };
}

function drawGlobe() {
  gc.clearRect(0, 0, globeCanvas.width, globeCanvas.height);

  const bg = gc.createRadialGradient(CX - 60, CY - 60, 20, CX, CY, R);
  bg.addColorStop(0, '#0a2233');
  bg.addColorStop(0.6, '#061520');
  bg.addColorStop(1, '#020a10');
  gc.beginPath(); gc.arc(CX, CY, R, 0, Math.PI * 2); gc.fillStyle = bg; gc.fill();

  gc.strokeStyle = '#0e3a5c55'; gc.lineWidth = 0.5;
  for (let lat = -80; lat <= 80; lat += 20) {
    gc.beginPath(); let first = true;
    for (let lon = -180; lon <= 180; lon += 3) {
      const p = project(lat, lon, rotY, rotX);
      if (p.z < 0) { first = true; continue; }
      first ? gc.moveTo(p.x, p.y) : gc.lineTo(p.x, p.y); first = false;
    } gc.stroke();
  }
  for (let lon = -180; lon < 180; lon += 20) {
    gc.beginPath(); let first = true;
    for (let lat = -90; lat <= 90; lat += 3) {
      const p = project(lat, lon, rotY, rotX);
      if (p.z < 0) { first = true; continue; }
      first ? gc.moveTo(p.x, p.y) : gc.lineTo(p.x, p.y); first = false;
    } gc.stroke();
  }

  gc.fillStyle = '#00d4ff22'; gc.strokeStyle = '#00d4ff'; gc.lineWidth = 1;
  LAND.forEach(polygon => {
    const pts = polygon.map(([la, lo]) => project(la, lo, rotY, rotX));
    if (pts.filter(p => p.z > 0).length < 3) return;
    gc.beginPath(); let started = false;
    pts.forEach(p => {
      if (p.z < 0) { started = false; return; }
      started ? gc.lineTo(p.x, p.y) : gc.moveTo(p.x, p.y); started = true;
    });
    gc.closePath(); gc.fill(); gc.stroke();
  });

  const cityCoords = [
    [40.7,-74.0,'NYC'],[51.5,-0.1,'LON'],[48.9,2.4,'PAR'],[35.7,139.7,'TYO'],
    [1.3,103.8,'SIN'],[-33.9,151.2,'SYD'],[25.2,55.3,'DXB'],[19.1,72.9,'BOM'],
    [-23.5,-46.6,'SAO'],[34.1,-118.2,'LAX'],[55.8,37.6,'MOW'],[39.9,116.4,'BEI'],
    [-1.3,36.8,'NBO'],[6.5,3.4,'LAG'],[30.0,31.2,'CAI'],
  ];
  cityCoords.forEach(([lat, lon, label]) => {
    const p = project(lat, lon, rotY, rotX);
    if (p.z < 0.05) return;
    gc.beginPath(); gc.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
    gc.fillStyle = '#00ff9d'; gc.shadowColor = '#00ff9d'; gc.shadowBlur = 6;
    gc.fill(); gc.shadowBlur = 0;
    gc.fillStyle = '#00ff9d99'; gc.font = '8px Courier New';
    gc.fillText(label, p.x + 4, p.y - 3);
  });

  const atm = gc.createRadialGradient(CX, CY, R - 10, CX, CY, R + 8);
  atm.addColorStop(0, 'transparent'); atm.addColorStop(0.4, '#00d4ff18'); atm.addColorStop(1, 'transparent');
  gc.beginPath(); gc.arc(CX, CY, R + 4, 0, Math.PI * 2); gc.fillStyle = atm; gc.fill();

  const spec = gc.createRadialGradient(CX - 70, CY - 70, 5, CX - 50, CY - 50, R * 0.7);
  spec.addColorStop(0, '#ffffff18'); spec.addColorStop(1, 'transparent');
  gc.beginPath(); gc.arc(CX, CY, R, 0, Math.PI * 2); gc.fillStyle = spec; gc.fill();
}

function animateGlobe() {
  if (!isDragging) {
    velX *= 0.95; velY *= 0.95;
    rotY += 0.003 + velX; rotX += velY;
    rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
  }
  drawGlobe();
  requestAnimationFrame(animateGlobe);
}
animateGlobe();

globeCanvas.addEventListener('mousedown', e => {
  isDragging = true; lastX = e.clientX; lastY = e.clientY; velX = 0; velY = 0;
});
window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  velX = (e.clientX - lastX) * 0.005; velY = (e.clientY - lastY) * 0.005;
  rotY += velX; rotX += velY;
  rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
  lastX = e.clientX; lastY = e.clientY;
});
window.addEventListener('mouseup', () => { isDragging = false; });
globeCanvas.addEventListener('touchstart', e => {
  isDragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
}, { passive: true });
globeCanvas.addEventListener('touchmove', e => {
  if (!isDragging) return;
  velX = (e.touches[0].clientX - lastX) * 0.005; velY = (e.touches[0].clientY - lastY) * 0.005;
  rotY += velX; rotX += velY;
  rotX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotX));
  lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
}, { passive: true });
globeCanvas.addEventListener('touchend', () => { isDragging = false; });


// ── Land Data ──────────────────────────────────────────────────
function buildLandData() {
  return [
    // North America
    [[70,-140],[72,-120],[70,-100],[68,-85],[72,-75],[60,-65],[50,-55],[45,-60],
     [44,-66],[41,-70],[35,-75],[30,-80],[25,-80],[22,-90],[18,-88],[15,-87],
     [10,-84],[8,-77],[10,-75],[12,-71],[20,-73],[26,-79],[30,-81],[35,-76],
     [40,-74],[43,-70],[47,-53],[50,-55],[60,-65],[65,-65],[70,-75],[72,-85],
     [74,-95],[72,-110],[68,-120],[67,-136],[60,-141],[58,-137],[55,-130],
     [48,-125],[42,-124],[38,-123],[34,-120],[32,-117],[30,-110],[25,-105],
     [20,-103],[15,-92],[18,-95],[23,-98],[28,-97],[30,-95],[32,-93],
     [35,-90],[38,-88],[42,-82],[45,-78],[48,-77],[50,-78],[55,-85],
     [60,-80],[65,-82],[68,-86],[70,-90],[72,-100],[70,-115],[68,-130],[70,-140]],
    // Greenland
    [[77,-18],[80,-25],[83,-35],[83,-50],[82,-60],[78,-68],[74,-70],[70,-52],
     [63,-42],[60,-44],[62,-50],[65,-55],[70,-52],[74,-60],[76,-55],[78,-40],
     [78,-25],[77,-18]],
    // South America
    [[10,-73],[8,-63],[5,-52],[2,-50],[0,-50],[-5,-35],[-10,-37],[-15,-39],
     [-20,-40],[-23,-43],[-30,-50],[-33,-52],[-35,-57],[-38,-62],[-42,-65],
     [-45,-67],[-50,-69],[-55,-68],[-55,-65],[-52,-59],[-50,-55],[-45,-53],
     [-40,-62],[-35,-58],[-28,-49],[-20,-40],[-10,-36],[-5,-35],[0,-48],
     [3,-52],[5,-57],[7,-60],[8,-63],[10,-62],[11,-70],[10,-75],[8,-77],
     [7,-73],[6,-68],[5,-62],[4,-55],[5,-52],[10,-60],[10,-73]],
    // Europe
    [[36,-9],[38,-9],[40,-8],[43,-9],[44,-8],[46,-2],[48,2],[51,2],[53,4],
     [55,8],[56,10],[58,6],[58,5],[60,5],[62,5],[64,14],[70,18],[71,26],
     [70,30],[65,25],[61,24],[60,22],[59,24],[57,22],[55,21],[54,19],
     [55,15],[54,14],[54,10],[57,8],[58,5],[58,8],[55,14],[52,14],[50,18],
     [48,17],[48,22],[46,24],[44,29],[42,28],[41,29],[38,26],[37,23],
     [36,28],[38,26],[39,20],[42,19],[44,15],[46,13],[44,8],[43,5],[42,3],
     [40,-4],[38,-9],[36,-6],[36,-9]],
    // Africa
    [[37,10],[37,13],[32,12],[30,10],[27,14],[20,16],[15,16],[12,15],[10,13],
     [5,2],[5,8],[2,10],[0,8],[-5,12],[-10,14],[-15,12],[-20,35],[-25,33],
     [-30,30],[-34,26],[-34,19],[-30,17],[-25,15],[-20,13],[-15,12],[-10,15],
     [-5,12],[0,10],[5,2],[10,0],[15,-17],[18,-16],[20,-17],[22,-17],[25,-15],
     [28,-13],[30,-10],[32,-5],[33,0],[35,5],[37,8],[37,10]],
    // Asia
    [[70,30],[72,55],[73,75],[70,95],[65,100],[60,105],[55,100],[50,90],
     [48,87],[45,80],[40,68],[38,57],[38,47],[35,36],[38,26],[42,28],
     [44,39],[42,47],[45,52],[48,58],[52,58],[55,60],[58,60],[60,65],
     [62,70],[60,75],[55,73],[52,76],[50,80],[45,82],[45,75],[42,70],
     [38,65],[35,61],[30,60],[25,57],[22,59],[18,57],[12,45],[10,44],
     [12,42],[15,40],[18,38],[22,37],[25,37],[30,34],[32,35],[35,36],
     [38,41],[40,47],[44,42],[47,40],[48,44],[52,48],[55,55],[60,58],
     [65,60],[68,68],[70,68],[72,70],[75,82],[78,90],[75,100],[72,110],
     [68,120],[65,130],[62,138],[62,144],[65,140],[68,130],[68,120],
     [65,110],[60,102],[55,95],[50,87],[48,80],[45,75],[48,72],[50,80],
     [55,85],[60,90],[65,100],[70,110],[72,120],[75,130],[72,140],[65,145],
     [60,150],[55,140],[52,135],[50,130],[47,135],[45,132],[42,130],
     [40,127],[38,128],[35,129],[34,130],[30,122],[26,120],[22,114],
     [20,110],[18,108],[15,108],[10,105],[8,104],[5,103],[1,104],[3,100],
     [5,98],[8,98],[10,100],[12,100],[14,102],[15,104],[16,108],[18,106],
     [20,110],[22,113],[25,120],[28,122],[30,122],[35,120],[38,122],
     [40,126],[42,130],[45,136],[48,135],[50,140],[55,135],[60,140],
     [62,150],[60,155],[58,155],[55,155],[52,150],[50,142],[48,136],
     [45,130],[42,125],[40,122],[38,117],[35,115],[32,110],[28,108],
     [25,102],[22,98],[18,95],[15,92],[12,92],[10,92],[8,90],[5,80],
     [8,77],[10,78],[12,80],[18,83],[22,88],[25,90],[25,85],[22,80],
     [20,73],[18,72],[15,73],[12,74],[8,77],[5,80],[0,73],[-2,73],
     [0,73],[2,72],[5,80],[8,77],[10,78],[12,80],[18,73],[22,68],
     [25,61],[30,62],[35,60],[38,56],[38,48],[35,38],[32,35],[30,34],
     [27,34],[25,37],[20,38],[16,40],[12,42],[10,44],[8,44],[10,44],
     [12,48],[15,48],[18,50],[22,58],[25,56],[28,52],[30,48],[35,38],
     [38,36],[42,36],[44,33],[42,29],[44,32],[46,36],[48,40],[50,42],
     [52,45],[55,50],[58,55],[60,60],[65,62],[68,65],[72,66],[75,70],
     [78,78],[75,90],[72,100],[70,110],[68,125],[70,140],[72,150],
     [70,155],[65,150],[60,150],[55,140],[50,135],[47,140],[45,137],
     [43,132],[40,128],[38,128],[36,128],[34,130],[32,130],[30,122],
     [25,121],[22,114],[18,110],[15,108],[12,109],[10,105],[8,100],
     [5,100],[4,103],[2,103],[1,104],[0,104],[0,100],[2,100],[4,98],
     [6,98],[8,98],[10,100],[12,98],[14,100],[16,102],[18,102],[20,106],
     [22,110],[25,116],[28,118],[30,120],[32,118],[35,115],[38,115],
     [40,118],[42,120],[44,126],[46,130],[48,135],[50,140],[52,142],
     [54,138],[56,135],[58,130],[56,126],[54,122],[52,120],[50,116],
     [48,112],[45,108],[42,104],[40,98],[38,88],[36,76],[34,72],
     [32,68],[30,62],[28,56],[26,50],[24,46],[22,42],[20,38],[18,35],
     [16,38],[14,42],[12,44],[10,44],[12,46],[14,48],[16,50],[18,54],
     [20,58],[22,60],[24,58],[26,56],[28,52],[30,48],[32,45],[35,38],
     [38,36],[40,36],[42,34],[44,34],[46,38],[48,40],[50,44],[52,48],
     [55,55],[58,58],[60,62],[62,68],[64,70],[66,72],[68,70],[70,65],
     [70,60],[68,56],[66,52],[65,48],[63,42],[62,40],[60,36],[58,32],
     [56,28],[55,25],[55,22],[58,22],[60,22],[62,24],[64,26],[66,28],
     [68,28],[70,25],[70,30]],
    // Australia
    [[-10,142],[-12,136],[-15,130],[-18,122],[-20,114],[-25,114],[-30,115],
     [-33,116],[-35,118],[-37,120],[-38,146],[-37,150],[-33,152],[-28,154],
     [-24,152],[-20,148],[-15,145],[-12,143],[-10,142]],
    // Japan
    [[30,130],[32,130],[34,131],[35,134],[36,136],[37,138],[38,141],[40,141],
     [42,140],[44,144],[43,145],[42,143],[40,140],[39,141],[38,140],
     [36,136],[34,135],[32,131],[30,130]],
  ];
}
