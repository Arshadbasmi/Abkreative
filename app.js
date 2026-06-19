'use strict';

// ── Star Field ────────────────────────────────────────────────
const starsCv = document.getElementById('stars-bg');
starsCv.width = window.innerWidth;
starsCv.height = window.innerHeight;
const sctx = starsCv.getContext('2d');
const STARS = Array.from({ length: 220 }, () => ({
  x: Math.random(), y: Math.random(),
  r: Math.random() * 1.1 + 0.25,
  base: Math.random() * 0.55 + 0.15,
  phase: Math.random() * Math.PI * 2,
}));
function drawStars(ts) {
  sctx.clearRect(0, 0, starsCv.width, starsCv.height);
  STARS.forEach(s => {
    const a = s.base + 0.18 * Math.sin(ts * 0.0007 + s.phase);
    sctx.beginPath();
    sctx.arc(s.x * starsCv.width, s.y * starsCv.height, s.r, 0, Math.PI * 2);
    sctx.fillStyle = `rgba(180,220,255,${a.toFixed(2)})`;
    sctx.fill();
  });
  requestAnimationFrame(drawStars);
}
requestAnimationFrame(drawStars);
window.addEventListener('resize', () => {
  starsCv.width = window.innerWidth;
  starsCv.height = window.innerHeight;
});

// ── Nav Tabs ──────────────────────────────────────────────────
document.querySelectorAll('.nav-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ── UTC Clock ──────────────────────────────────────────────────
const utcEl = document.getElementById('utc-clock');
function tickUTC() {
  const n = new Date();
  utcEl.textContent = `UTC ${pad(n.getUTCHours())}:${pad(n.getUTCMinutes())}:${pad(n.getUTCSeconds())}`;
}
function pad(n) { return String(n).padStart(2, '0'); }
setInterval(tickUTC, 1000);
tickUTC();


// ── Status Bar ─────────────────────────────────────────────────
const STATUS = {
  flights:    { el: document.getElementById('s-flights'),    base: 8241, noise: 30 },
  satellites: { el: document.getElementById('s-satellites'), base: 8377, noise: 2  },
  alerts:     { el: document.getElementById('s-alerts'),     base: 3,    noise: 0  },
};
let quakesToday = 0;
function updateStatus() {
  Object.values(STATUS).forEach(s => {
    const val = Math.round(s.base + (Math.random() - 0.5) * s.noise).toLocaleString();
    s.el.textContent = val;
  });
  document.getElementById('s-quakes').textContent = quakesToday;
  // Update left-panel status cards
  const scF = document.getElementById('sc-flights');
  const scS = document.getElementById('sc-satellites');
  const scQ = document.getElementById('sc-quakes');
  const scA = document.getElementById('sc-alerts');
  if (scF) scF.textContent = STATUS.flights.el.textContent;
  if (scS) scS.textContent = STATUS.satellites.el.textContent;
  if (scQ) scQ.textContent = quakesToday;
  if (scA) scA.textContent = STATUS.alerts.el.textContent;
}
setInterval(updateStatus, 5000);
updateStatus();


// ── World Clocks ───────────────────────────────────────────────
const CITIES = [
  { name: 'NEW YORK',    tz: 'America/New_York',   offset: -5,   lat: 40.71,  lon: -74.00 },
  { name: 'LONDON',      tz: 'Europe/London',       offset:  0,   lat: 51.51,  lon: -0.13  },
  { name: 'PARIS',       tz: 'Europe/Paris',        offset:  1,   lat: 48.85,  lon:  2.35  },
  { name: 'DUBAI',       tz: 'Asia/Dubai',          offset:  4,   lat: 25.20,  lon: 55.27  },
  { name: 'MUMBAI',      tz: 'Asia/Kolkata',        offset:  5.5, lat: 19.08,  lon: 72.88  },
  { name: 'SINGAPORE',   tz: 'Asia/Singapore',      offset:  8,   lat:  1.35,  lon: 103.82 },
  { name: 'TOKYO',       tz: 'Asia/Tokyo',          offset:  9,   lat: 35.68,  lon: 139.69 },
  { name: 'SYDNEY',      tz: 'Australia/Sydney',    offset: 10,   lat: -33.87, lon: 151.21 },
  { name: 'LOS ANGELES', tz: 'America/Los_Angeles', offset: -8,   lat: 34.05,  lon: -118.24},
  { name: 'SAO PAULO',   tz: 'America/Sao_Paulo',   offset: -3,   lat: -23.55, lon: -46.63 },
];

const WX_CODE = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '🌥️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌦️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '❄️', 73: '❄️', 75: '❄️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  95: '⛈️', 96: '⛈️', 99: '⛈️',
};

const clocksGrid = document.getElementById('clocks-grid');
CITIES.forEach(city => {
  const key = city.name.replace(/ /g, '_');
  const abbr = city.name.split(' ')[0].slice(0, 7);
  const el = document.createElement('div');
  el.className = 'clock-row';
  el.innerHTML = `
    <span class="clock-city">${abbr}</span>
    <span class="clock-time" id="ct-${key}">--:--</span>
    <span class="clock-wx" id="cw-${key}"></span>
  `;
  clocksGrid.appendChild(el);
});

function updateClocks() {
  const now = new Date();
  CITIES.forEach(city => {
    try {
      const key = city.name.replace(/ /g, '_');
      const el = document.getElementById(`ct-${key}`);
      if (el) el.textContent =
        now.toLocaleTimeString('en-GB', { timeZone: city.tz, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch(e) {}
  });
}
setInterval(updateClocks, 1000);
updateClocks();

async function fetchWeather() {
  for (const city of CITIES) {
    try {
      const r = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code`
      );
      const d = await r.json();
      const temp = Math.round(d.current.temperature_2m);
      const icon = WX_CODE[d.current.weather_code] ?? '🌡️';
      const key = city.name.replace(/ /g, '_');
      const el = document.getElementById(`cw-${key}`);
      if (el) el.textContent = `${icon} ${temp}°C`;
    } catch(e) {}
    await new Promise(res => setTimeout(res, 200));
  }
}
fetchWeather();
setInterval(fetchWeather, 600_000);


// ── Global Stats ───────────────────────────────────────────────
const STATS = [
  { id: 'population', label: 'WORLD POPULATION', icon: '🌍', color: '',       base: 8_200_000_000, rate: 2.6,            fmt: v => formatBig(v) },
  { id: 'internet',   label: 'INTERNET USERS',   icon: '🌐', color: '',       base: 5_500_000_000, rate: 1.7,            fmt: v => formatBig(v) },
  { id: 'emails',     label: 'EMAILS SENT TODAY', icon: '✉️', color: 'green', base: 0, rate: 3_500_000/60,  fmt: v => formatBig(v), daily: true },
  { id: 'posts',      label: 'SOCIAL POSTS TODAY',icon: '📡', color: 'green', base: 0, rate: 12_000/60,     fmt: v => formatBig(v), daily: true },
  { id: 'co2',        label: 'CO₂ TODAY (kt)',    icon: '🏭', color: 'red',   base: 0, rate: 1_200/3600,    fmt: v => Math.floor(v).toLocaleString(), daily: true },
  { id: 'energy',     label: 'ENERGY TODAY (GWh)',icon: '⚡', color: 'yellow',base: 0, rate: 29_000/86400,  fmt: v => v.toFixed(1), daily: true },
];

const secToday = () => { const n = new Date(); return n.getHours()*3600 + n.getMinutes()*60 + n.getSeconds(); };
const statEl = document.getElementById('stats-list');
const statState = {};
const barMax = {};

STATS.forEach(s => {
  const div = document.createElement('div');
  div.className = `stat-item${s.color ? ' ' + s.color : ''}`;
  div.innerHTML = `
    <span class="stat-icon">${s.icon}</span>
    <div class="stat-info">
      <div class="stat-label">${s.label}</div>
      <div><span class="stat-value" id="sv-${s.id}">—</span><span class="stat-delta" id="sd-${s.id}"></span></div>
      <div class="stat-bar-wrap"><div class="stat-bar" id="sb-${s.id}" style="width:0%"></div></div>
    </div>`;
  statEl.appendChild(div);
  statState[s.id] = { val: s.daily ? s.rate * secToday() : s.base };
});

function updateStats() {
  STATS.forEach(s => {
    const st = statState[s.id];
    const prev = st.val;
    st.val += s.rate + (Math.random() - 0.48) * s.rate * 0.3;
    if (st.val < 0) st.val = 0;
    const delta = st.val - prev;
    document.getElementById(`sd-${s.id}`).textContent = `+${s.fmt(delta)}/s`;
    document.getElementById(`sv-${s.id}`).textContent = s.fmt(st.val);
    if (!barMax[s.id]) barMax[s.id] = st.val * 2;
    document.getElementById(`sb-${s.id}`).style.width = Math.min(100, st.val / barMax[s.id] * 100) + '%';
  });
}
setInterval(updateStats, 1000);
updateStats();

function formatBig(n) {
  if (n >= 1e9) return (n/1e9).toFixed(3) + 'B';
  if (n >= 1e6) return (n/1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}


// ── Markets ────────────────────────────────────────────────────
const MARKETS = [
  { id: 'btc',  label: 'BTC / USD', price: 67_450,  fmt: p => '$' + Math.round(p).toLocaleString(), vol: 350 },
  { id: 'eth',  label: 'ETH / USD', price: 3_855,   fmt: p => '$' + Math.round(p).toLocaleString(), vol: 45  },
  { id: 'sp',   label: 'S&P 500',   price: 5_280,   fmt: p => Math.round(p).toLocaleString(),        vol: 12  },
  { id: 'gold', label: 'XAU / USD', price: 2_328,   fmt: p => '$' + p.toFixed(1),                   vol: 5   },
  { id: 'oil',  label: 'WTI OIL',   price: 82.4,   fmt: p => '$' + p.toFixed(2),                   vol: 0.4 },
  { id: 'eur',  label: 'EUR / USD', price: 1.0882, fmt: p => p.toFixed(4),                          vol: 0.0008 },
];

const SPARK_PTS = 40;
const mktState = {};
const mktList = document.getElementById('markets-list');

MARKETS.forEach(m => {
  mktState[m.id] = {
    price: m.price,
    open: m.price,
    history: Array.from({ length: SPARK_PTS }, () => m.price + (Math.random() - 0.5) * m.vol * 10),
  };

  const div = document.createElement('div');
  div.className = 'market-item';
  div.id = `mi-${m.id}`;
  div.innerHTML = `
    <div class="market-top">
      <span class="market-label">${m.label}</span>
      <span class="market-change" id="mc-${m.id}">+0.00%</span>
    </div>
    <div class="market-price" id="mp-${m.id}"></div>
    <svg class="market-sparkline" id="ms-${m.id}" viewBox="0 0 100 22" preserveAspectRatio="none"></svg>
  `;
  mktList.appendChild(div);
});

function renderSparkline(id, history, color) {
  const svg = document.getElementById(`ms-${id}`);
  if (!svg) return;
  const H = 22;
  const min = Math.min(...history), max = Math.max(...history);
  const range = max - min || 1;
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * 100;
    const y = H - ((v - min) / range) * (H - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const lastY = (H - ((history[history.length - 1] - min) / range) * (H - 2) - 1).toFixed(1);

  svg.innerHTML = `
    <defs>
      <linearGradient id="sg-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.28"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="0,${H} ${pts} 100,${H}" fill="url(#sg-${id})"/>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.5"/>
    <circle cx="100" cy="${lastY}" r="2" fill="${color}"/>
  `;
}

function updateMarkets() {
  MARKETS.forEach(m => {
    const st = mktState[m.id];
    const drift = (Math.random() - 0.495) * m.vol;
    st.price = Math.max(st.price * 0.95, st.price + drift);
    st.history.push(st.price);
    if (st.history.length > SPARK_PTS) st.history.shift();

    const pct = ((st.price - st.open) / st.open) * 100;
    const up = pct >= 0;
    const color = up ? '#00ff9d' : '#ff3e6c';

    document.getElementById(`mp-${m.id}`).textContent = m.fmt(st.price);

    const chEl = document.getElementById(`mc-${m.id}`);
    chEl.textContent = (up ? '+' : '') + pct.toFixed(2) + '%';
    chEl.className = 'market-change' + (up ? '' : ' neg');

    const item = document.getElementById(`mi-${m.id}`);
    item.className = 'market-item ' + (up ? 'up' : 'down');

    renderSparkline(m.id, st.history, color);
  });
}

setInterval(updateMarkets, 1500);
updateMarkets();


// ── Internet Activity Chart ────────────────────────────────────
const SERIES = [
  { label: 'TRAFFIC (Tbps)',  color: '#00d4ff', base: 820, amp: 80  },
  { label: 'ATTACKS/min',     color: '#ff3e6c', base: 340, amp: 120 },
  { label: 'NEW SITES/min',   color: '#00ff9d', base: 12,  amp: 6   },
];
const CHART_PTS = 60;
const seriesData = SERIES.map(s =>
  Array.from({ length: CHART_PTS }, () => s.base + (Math.random() - 0.5) * s.amp));

const chartCanvas = document.getElementById('activity-chart');
const ctx = chartCanvas.getContext('2d');

function pushChart() {
  SERIES.forEach((s, i) => {
    seriesData[i].shift();
    const last = seriesData[i][seriesData[i].length - 1];
    seriesData[i].push(Math.max(s.base * 0.3, last + (Math.random() - 0.48) * s.amp * 0.35));
  });
}

function drawChart() {
  const W = chartCanvas.offsetWidth * devicePixelRatio;
  const H = 100 * devicePixelRatio;
  chartCanvas.width = W; chartCanvas.height = H;
  ctx.clearRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = '#0e3a5c44'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = (H / 4) * i;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  SERIES.forEach((s, si) => {
    const data = seriesData[si];
    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => ({
      x: (i / (CHART_PTS - 1)) * W,
      y: H - ((v - min) / range) * H * 0.82 - H * 0.06,
    }));

    // Fill
    ctx.beginPath();
    ctx.moveTo(pts[0].x, H);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, H);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, s.color + '33'); grad.addColorStop(1, s.color + '00');
    ctx.fillStyle = grad; ctx.fill();

    // Line
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = s.color; ctx.lineWidth = 1.5 * devicePixelRatio; ctx.stroke();

    // Dot
    const lp = pts[pts.length - 1];
    ctx.beginPath(); ctx.arc(lp.x, lp.y, 3 * devicePixelRatio, 0, Math.PI * 2);
    ctx.fillStyle = s.color; ctx.fill();

    // Current value label
    ctx.fillStyle = s.color; ctx.font = `${9 * devicePixelRatio}px Courier New`;
    ctx.fillText(data[data.length-1].toFixed(si === 2 ? 1 : 0), lp.x + 6 * devicePixelRatio, lp.y + 4 * devicePixelRatio);
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


// ── Seismic ────────────────────────────────────────────────────
const LOCS = [
  'Honshu, Japan','California, USA','Sumatra, Indonesia','Chile','Turkey',
  'Philippines','New Zealand','Alaska, USA','Italy','Mexico','Iran','Greece',
  'Peru','Tonga','Taiwan','Papua New Guinea','Nepal','Pakistan','Vanuatu',
  'Solomon Islands','Fiji','Colombia','Argentina','Myanmar','Iceland',
];

// Approx coords per location for globe pings
const LOC_COORDS = {
  'Honshu, Japan': [36, 138], 'California, USA': [36, -119], 'Sumatra, Indonesia': [0, 102],
  'Chile': [-30, -71], 'Turkey': [39, 35], 'Philippines': [12, 122],
  'New Zealand': [-42, 172], 'Alaska, USA': [62, -150], 'Italy': [42, 13],
  'Mexico': [19, -100], 'Iran': [33, 53], 'Greece': [38, 22],
  'Peru': [-10, -75], 'Tonga': [-20, -175], 'Taiwan': [24, 121],
  'Papua New Guinea': [-6, 147], 'Nepal': [28, 84], 'Pakistan': [30, 69],
  'Vanuatu': [-17, 168], 'Solomon Islands': [-9, 160], 'Fiji': [-18, 178],
  'Colombia': [4, -73], 'Argentina': [-35, -65], 'Myanmar': [20, 96], 'Iceland': [65, -18],
};

function magLevel(m) {
  if (m >= 7.0) return 'major';
  if (m >= 5.5) return 'strong';
  if (m >= 4.0) return 'moderate';
  return 'minor';
}

let seismicSrc = 'SIM';

function addSeismicItem(ev) {
  const feed = document.getElementById('seismic-feed');
  const el = document.createElement('div');
  el.className = 'seismic-item';
  el.dataset.level = ev.level;
  el.innerHTML = `
    <span class="seismic-mag">M${ev.mag}</span>
    <div class="seismic-info">
      <div class="seismic-place">${ev.place}</div>
      <div class="seismic-meta">UTC ${ev.time} · ${ev.level.toUpperCase()}${ev.src ? ' · ' + ev.src : ''}</div>
    </div>
    <span class="seismic-depth">${ev.depth}km</span>
  `;
  feed.insertBefore(el, feed.firstChild);
  while (feed.children.length > 7) feed.removeChild(feed.lastChild);

  // Add ping on globe
  const coords = LOC_COORDS[ev.place];
  if (coords) addPing(coords[0], coords[1], ev.level);
}

function genFakeSeismic() {
  const loc = LOCS[Math.floor(Math.random() * LOCS.length)];
  const mag = (Math.random() * 6.2 + 1.5).toFixed(1);
  const level = magLevel(parseFloat(mag));
  return {
    mag, level, place: loc,
    depth: Math.floor(Math.random() * 200 + 5),
    time: new Date().toUTCString().slice(17, 25),
  };
}

for (let i = 0; i < 5; i++) addSeismicItem(genFakeSeismic());

function scheduleSeismic() {
  setTimeout(() => { addSeismicItem(genFakeSeismic()); quakesToday++; scheduleSeismic(); },
    8000 + Math.random() * 9000);
}
scheduleSeismic();

async function loadUSGS() {
  try {
    const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
    const data = await res.json();
    const feed = document.getElementById('seismic-feed');
    feed.innerHTML = '';
    quakesToday = data.features.length;
    data.features.slice(0, 7).reverse().forEach(f => {
      const mag = f.properties.mag?.toFixed(1) ?? '?';
      const level = magLevel(parseFloat(mag));
      const coords = f.geometry.coordinates;
      addPing(coords[1], coords[0], level);
      addSeismicItem({
        mag, level, src: 'USGS',
        place: f.properties.place ?? 'Unknown',
        depth: Math.round(coords[2]),
        time: new Date(f.properties.time).toUTCString().slice(17, 25),
      });
    });
    document.getElementById('seismic-src').textContent = 'USGS LIVE';
    seismicSrc = 'USGS';
  } catch(e) {
    document.getElementById('seismic-src').textContent = 'SIMULATED';
  }
}
loadUSGS();
setInterval(loadUSGS, 60_000);


// ── Ticker ─────────────────────────────────────────────────────
const TICKERS = [
  { cat: 'CLIMATE',  text: 'Arctic sea ice extent 12% below 30-year average' },
  { cat: 'TECH',     text: 'Global AI compute capacity doubles for third year running' },
  { cat: 'HEALTH',   text: 'WHO monitoring novel respiratory variant in Southeast Asia' },
  { cat: 'ECONOMY',  text: 'IMF revises global growth forecast to 3.1% for current year' },
  { cat: 'SPACE',    text: 'ESA confirms Ariane 6 payload deployment successful' },
  { cat: 'ENERGY',   text: 'Solar generation hits new record — 4.2 TWh in single day' },
  { cat: 'SECURITY', text: 'Coordinated DDoS campaigns targeting financial infrastructure' },
  { cat: 'OCEAN',    text: 'Pacific surface temps 0.4°C above seasonal baseline' },
  { cat: 'SCIENCE',  text: 'CERN announces results from high-luminosity collision series' },
  { cat: 'TRADE',    text: 'Container shipping index up 8% week-on-week at major ports' },
  { cat: 'CLIMATE',  text: 'Amazon deforestation rate slows for second consecutive quarter' },
  { cat: 'TECH',     text: 'Quantum processor achieves 1,000-qubit milestone' },
  { cat: 'ECONOMY',  text: 'Gold crosses $3,200/oz amid currency volatility' },
  { cat: 'SPACE',    text: 'James Webb captures galaxy formation at record z > 14' },
  { cat: 'HEALTH',   text: 'Global antibiotic resistance database expanded to 194 nations' },
];

const tickerTrack = document.getElementById('ticker-track');
const doubled = [...TICKERS, ...TICKERS];
tickerTrack.innerHTML = doubled.map(t =>
  `<span class="ticker-item"><span class="ticker-cat">${t.cat}</span>${t.text}</span>`
).join('');


// ── Globe ──────────────────────────────────────────────────────
const globeCanvas = document.getElementById('globe');
const gc = globeCanvas.getContext('2d');
const R = 270, CX = 300, CY = 300;
let rotY = 0, rotX = 0.25;
let isDragging = false, lastMouseX = 0, lastMouseY = 0, velX = 0, velY = 0;

// Ping system for seismic events
const pings = [];
function addPing(lat, lon, level) {
  pings.push({ lat, lon, level, age: 0, maxAge: 80 });
  if (pings.length > 20) pings.shift();
}
const PING_COLOR = { minor: '#00ff9d', moderate: '#ffd600', strong: '#ff3e6c', major: '#ff0040' };

// Animated arc system for data flows
const ARCS_DEF = [
  { a: [40.7,-74.0], b: [51.5,-0.1]  },
  { a: [51.5,-0.1],  b: [48.9, 2.4]  },
  { a: [51.5,-0.1],  b: [35.7,139.7] },
  { a: [35.7,139.7], b: [1.3,103.8]  },
  { a: [1.3,103.8],  b: [25.2, 55.3] },
  { a: [25.2,55.3],  b: [48.9, 2.4]  },
  { a: [40.7,-74.0], b: [-23.5,-46.6]},
  { a: [39.9,116.4], b: [35.7,139.7] },
];
let arcPhase = 0;

function slerp(lat1, lon1, lat2, lon2, t) {
  const toR = Math.PI / 180;
  const x1 = Math.cos(lat1*toR)*Math.cos(lon1*toR), y1 = Math.cos(lat1*toR)*Math.sin(lon1*toR), z1 = Math.sin(lat1*toR);
  const x2 = Math.cos(lat2*toR)*Math.cos(lon2*toR), y2 = Math.cos(lat2*toR)*Math.sin(lon2*toR), z2 = Math.sin(lat2*toR);
  const dot = Math.max(-1, Math.min(1, x1*x2 + y1*y2 + z1*z2));
  const theta = Math.acos(dot);
  if (theta < 0.001) return { lat: lat1, lon: lon1 };
  const s1 = Math.sin((1-t)*theta)/Math.sin(theta), s2 = Math.sin(t*theta)/Math.sin(theta);
  const x = s1*x1+s2*x2, y = s1*y1+s2*y2, z = s1*z1+s2*z2;
  return { lat: Math.asin(z)/toR, lon: Math.atan2(y,x)/toR };
}

function getSunPosition() {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000);
  const dec = -23.45 * Math.cos((2*Math.PI/365)*(dayOfYear+10));
  const utcH = now.getUTCHours() + now.getUTCMinutes()/60 + now.getUTCSeconds()/3600;
  return { lat: dec, lon: (utcH - 12) * -15 };
}

function project(lat, lon) {
  const toR = Math.PI/180;
  const x = Math.cos(lat*toR)*Math.sin(lon*toR + rotY);
  const y = -Math.sin(lat*toR)*Math.cos(rotX) + Math.cos(lat*toR)*Math.cos(lon*toR + rotY)*Math.sin(rotX);
  const z =  Math.sin(lat*toR)*Math.sin(rotX) + Math.cos(lat*toR)*Math.cos(lon*toR + rotY)*Math.cos(rotX);
  return { x: CX + x*R, y: CY + y*R, z };
}

const LAND = buildLandData();
const CITY_COORDS = [
  [40.7,-74.0,'NYC'],[51.5,-0.1,'LON'],[48.9,2.4,'PAR'],[35.7,139.7,'TYO'],
  [1.3,103.8,'SIN'],[-33.9,151.2,'SYD'],[25.2,55.3,'DXB'],[19.1,72.9,'BOM'],
  [-23.5,-46.6,'SAO'],[34.1,-118.2,'LAX'],[55.8,37.6,'MOW'],[39.9,116.4,'BEI'],
  [-1.3,36.8,'NBO'],[6.5,3.4,'LAG'],[30.0,31.2,'CAI'],
];

function drawGlobe() {
  gc.clearRect(0, 0, globeCanvas.width, globeCanvas.height);

  // Sphere
  const bg = gc.createRadialGradient(CX-60,CY-60,20,CX,CY,R);
  bg.addColorStop(0,'#0b2438'); bg.addColorStop(0.6,'#061520'); bg.addColorStop(1,'#020b12');
  gc.beginPath(); gc.arc(CX,CY,R,0,Math.PI*2); gc.fillStyle = bg; gc.fill();

  // Night shading (day/night terminator)
  const sun = getSunPosition();
  const nightLat = -sun.lat, nightLon = sun.lon + 180;
  const nc = project(nightLat, nightLon);
  gc.save();
  gc.beginPath(); gc.arc(CX, CY, R, 0, Math.PI*2); gc.clip();
  if (nc.z > 0) {
    const ng = gc.createRadialGradient(nc.x,nc.y,0,nc.x,nc.y,R*1.6);
    ng.addColorStop(0,'rgba(0,3,12,0.72)'); ng.addColorStop(0.65,'rgba(0,3,12,0.38)'); ng.addColorStop(1,'rgba(0,3,12,0)');
    gc.fillStyle = ng; gc.fillRect(0,0,globeCanvas.width,globeCanvas.height);
  } else {
    const sg = gc.createRadialGradient(CX*2-nc.x,CY*2-nc.y,0,CX*2-nc.x,CY*2-nc.y,R*1.6);
    sg.addColorStop(0,'rgba(0,3,12,0.72)'); sg.addColorStop(0.65,'rgba(0,3,12,0.38)'); sg.addColorStop(1,'rgba(0,3,12,0)');
    gc.fillStyle = sg; gc.fillRect(0,0,globeCanvas.width,globeCanvas.height);
  }
  gc.restore();

  // Grid
  gc.strokeStyle = '#0e3a5c44'; gc.lineWidth = 0.5;
  for (let lat = -80; lat <= 80; lat += 20) {
    gc.beginPath(); let first = true;
    for (let lon = -180; lon <= 180; lon += 3) {
      const p = project(lat, lon);
      if (p.z < 0) { first = true; continue; }
      first ? gc.moveTo(p.x,p.y) : gc.lineTo(p.x,p.y); first = false;
    } gc.stroke();
  }
  for (let lon = -180; lon < 180; lon += 20) {
    gc.beginPath(); let first = true;
    for (let lat = -90; lat <= 90; lat += 3) {
      const p = project(lat, lon);
      if (p.z < 0) { first = true; continue; }
      first ? gc.moveTo(p.x,p.y) : gc.lineTo(p.x,p.y); first = false;
    } gc.stroke();
  }

  // Land
  gc.fillStyle = '#00d4ff1e'; gc.strokeStyle = '#00d4ffaa'; gc.lineWidth = 0.8;
  LAND.forEach(poly => {
    const pts = poly.map(([la,lo]) => project(la,lo));
    if (pts.filter(p => p.z > 0).length < 3) return;
    gc.beginPath(); let s = false;
    pts.forEach(p => { if (p.z < 0) { s=false; return; } s ? gc.lineTo(p.x,p.y) : gc.moveTo(p.x,p.y); s=true; });
    gc.closePath(); gc.fill(); gc.stroke();
  });

  // Data arcs
  arcPhase = (arcPhase + 0.008) % 1;
  gc.lineWidth = 1.2;
  ARCS_DEF.forEach((arc, i) => {
    const phase = (arcPhase + i/ARCS_DEF.length) % 1;
    const tail = 0.25;
    const head = phase, start = Math.max(0, phase - tail);
    gc.beginPath();
    let started = false;
    for (let t = start; t <= head; t += 0.025) {
      const m = slerp(arc.a[0],arc.a[1],arc.b[0],arc.b[1],t);
      const p = project(m.lat, m.lon);
      if (p.z < 0.05) { started = false; continue; }
      started ? gc.lineTo(p.x,p.y) : gc.moveTo(p.x,p.y); started = true;
    }
    const alpha = 0.3 + 0.2 * Math.sin(arcPhase * Math.PI * 6 + i);
    gc.strokeStyle = `rgba(0,212,255,${alpha})`; gc.stroke();
  });

  // City dots
  CITY_COORDS.forEach(([lat,lon,label]) => {
    const p = project(lat, lon);
    if (p.z < 0.05) return;
    gc.beginPath(); gc.arc(p.x,p.y,2.5,0,Math.PI*2);
    gc.fillStyle = '#00ff9d'; gc.shadowColor = '#00ff9d'; gc.shadowBlur = 7;
    gc.fill(); gc.shadowBlur = 0;
    gc.fillStyle = '#00ff9dbb'; gc.font = '8px Courier New';
    gc.fillText(label, p.x+4, p.y-3);
  });

  // Seismic pings
  for (let i = pings.length - 1; i >= 0; i--) {
    const ping = pings[i];
    ping.age++;
    if (ping.age >= ping.maxAge) { pings.splice(i,1); continue; }
    const p = project(ping.lat, ping.lon);
    if (p.z < 0.05) continue;
    const t = ping.age / ping.maxAge;
    const color = PING_COLOR[ping.level] ?? '#00d4ff';
    gc.beginPath(); gc.arc(p.x, p.y, t * 22, 0, Math.PI*2);
    gc.strokeStyle = color; gc.globalAlpha = (1-t) * 0.8;
    gc.lineWidth = 1.5 - t; gc.stroke();
    gc.globalAlpha = 1;
    if (t < 0.15) {
      gc.beginPath(); gc.arc(p.x,p.y,3,0,Math.PI*2);
      gc.fillStyle = color; gc.shadowColor = color; gc.shadowBlur = 8;
      gc.fill(); gc.shadowBlur = 0;
    }
  }

  // Atmosphere
  const atm = gc.createRadialGradient(CX,CY,R-8,CX,CY,R+10);
  atm.addColorStop(0,'transparent'); atm.addColorStop(0.5,'#00d4ff14'); atm.addColorStop(1,'transparent');
  gc.beginPath(); gc.arc(CX,CY,R+5,0,Math.PI*2); gc.fillStyle = atm; gc.fill();

  // Specular
  const spec = gc.createRadialGradient(CX-70,CY-70,5,CX-50,CY-50,R*0.7);
  spec.addColorStop(0,'#ffffff15'); spec.addColorStop(1,'transparent');
  gc.beginPath(); gc.arc(CX,CY,R,0,Math.PI*2); gc.fillStyle = spec; gc.fill();

  // Sun position indicator
  const sunP = project(sun.lat, sun.lon);
  if (sunP.z > 0) {
    gc.beginPath(); gc.arc(sunP.x,sunP.y,4,0,Math.PI*2);
    gc.fillStyle = '#fff176'; gc.shadowColor = '#fff176'; gc.shadowBlur = 12;
    gc.fill(); gc.shadowBlur = 0;
  }
  const sunPosEl = document.getElementById('sun-pos');
  if (sunPosEl) sunPosEl.textContent = `SUN ${sun.lat.toFixed(1)}°N ${sun.lon.toFixed(0)}°E`;
  const hudRot = document.getElementById('hud-rot');
  if (hudRot) hudRot.textContent = `LON ${(((rotY * 180 / Math.PI) % 360 + 360) % 360).toFixed(1)}°`;
}

function animateGlobe() {
  if (!isDragging) {
    velX *= 0.94; velY *= 0.94;
    rotY += 0.003 + velX;
    rotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, rotX + velY));
  }
  drawGlobe();
  requestAnimationFrame(animateGlobe);
}
animateGlobe();

globeCanvas.addEventListener('mousedown', e => { isDragging=true; lastMouseX=e.clientX; lastMouseY=e.clientY; velX=velY=0; });
window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  velX = (e.clientX - lastMouseX) * 0.005; velY = (e.clientY - lastMouseY) * 0.005;
  rotY += velX; rotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, rotX + velY));
  lastMouseX = e.clientX; lastMouseY = e.clientY;
});
window.addEventListener('mouseup', () => { isDragging = false; });
globeCanvas.addEventListener('touchstart', e => { isDragging=true; lastMouseX=e.touches[0].clientX; lastMouseY=e.touches[0].clientY; }, { passive: true });
globeCanvas.addEventListener('touchmove', e => {
  if (!isDragging) return;
  velX = (e.touches[0].clientX-lastMouseX)*0.005; velY = (e.touches[0].clientY-lastMouseY)*0.005;
  rotY += velX; rotX = Math.max(-Math.PI/2, Math.min(Math.PI/2, rotX + velY));
  lastMouseX = e.touches[0].clientX; lastMouseY = e.touches[0].clientY;
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
     [63,-42],[60,-44],[62,-50],[65,-55],[70,-52],[74,-60],[76,-55],[78,-40],[78,-25],[77,-18]],
    // South America
    [[10,-73],[8,-63],[5,-52],[2,-50],[0,-50],[-5,-35],[-10,-37],[-15,-39],
     [-20,-40],[-23,-43],[-30,-50],[-33,-52],[-35,-57],[-38,-62],[-42,-65],
     [-45,-67],[-50,-69],[-55,-68],[-55,-65],[-52,-59],[-50,-55],[-45,-53],
     [-40,-62],[-35,-58],[-28,-49],[-20,-40],[-10,-36],[-5,-35],[0,-48],
     [3,-52],[5,-57],[7,-60],[8,-63],[10,-62],[11,-70],[10,-75],[8,-77],
     [7,-73],[6,-68],[5,-62],[4,-55],[5,-52],[10,-60],[10,-73]],
    // Europe
    [[36,-9],[38,-9],[40,-8],[43,-9],[44,-8],[46,-2],[48,2],[51,2],[53,4],
     [55,8],[56,10],[58,6],[60,5],[62,5],[64,14],[70,18],[71,26],[70,30],
     [65,25],[61,24],[60,22],[59,24],[57,22],[55,21],[54,19],[55,15],[54,14],
     [54,10],[57,8],[58,8],[55,14],[52,14],[50,18],[48,17],[48,22],[46,24],
     [44,29],[42,28],[41,29],[38,26],[37,23],[36,28],[39,20],[42,19],[44,15],
     [46,13],[44,8],[43,5],[42,3],[40,-4],[38,-9],[36,-6],[36,-9]],
    // Africa
    [[37,10],[37,13],[32,12],[30,10],[27,14],[20,16],[15,16],[12,15],[10,13],
     [5,2],[5,8],[2,10],[0,8],[-5,12],[-10,14],[-15,12],[-20,35],[-25,33],
     [-30,30],[-34,26],[-34,19],[-30,17],[-25,15],[-20,13],[-15,12],[-10,15],
     [-5,12],[0,10],[5,2],[10,0],[15,-17],[18,-16],[20,-17],[22,-17],[25,-15],
     [28,-13],[30,-10],[32,-5],[33,0],[35,5],[37,8],[37,10]],
    // Asia
    [[70,30],[72,55],[73,75],[70,95],[65,100],[60,105],[55,100],[50,90],
     [48,87],[45,80],[40,68],[38,57],[38,47],[35,36],[38,26],[42,28],[44,39],
     [42,47],[45,52],[48,58],[52,58],[55,60],[58,60],[60,65],[62,70],[60,75],
     [55,73],[52,76],[50,80],[45,82],[45,75],[42,70],[38,65],[35,61],[30,60],
     [25,57],[22,59],[18,57],[12,45],[10,44],[12,42],[15,40],[18,38],[22,37],
     [25,37],[30,34],[32,35],[35,36],[38,41],[40,47],[44,42],[47,40],[48,44],
     [52,48],[55,55],[60,58],[65,60],[68,68],[70,68],[72,70],[75,82],[78,90],
     [75,100],[72,110],[68,120],[65,130],[62,138],[62,144],[65,140],[68,130],
     [65,110],[60,102],[55,95],[50,87],[48,80],[45,75],[48,72],[50,80],
     [55,85],[60,90],[65,100],[70,110],[72,120],[75,130],[72,140],[65,145],
     [60,150],[55,140],[52,135],[50,130],[47,135],[45,132],[42,130],[40,127],
     [38,128],[35,129],[34,130],[30,122],[26,120],[22,114],[20,110],[18,108],
     [15,108],[10,105],[8,104],[5,103],[1,104],[3,100],[5,98],[8,98],[10,100],
     [12,100],[14,102],[15,104],[16,108],[18,106],[20,110],[22,113],[25,120],
     [28,122],[30,122],[35,120],[38,122],[40,126],[42,130],[45,136],[48,135],
     [50,140],[55,135],[60,140],[62,150],[60,155],[58,155],[55,155],[52,150],
     [50,142],[48,136],[45,130],[42,125],[40,122],[38,117],[35,115],[32,110],
     [28,108],[25,102],[22,98],[18,95],[15,92],[12,92],[10,92],[8,90],[5,80],
     [8,77],[10,78],[12,80],[18,83],[22,88],[25,90],[25,85],[22,80],[20,73],
     [18,72],[15,73],[12,74],[8,77],[5,80],[0,73],[-2,73],[0,73],[2,72],
     [5,80],[8,77],[10,78],[12,80],[18,73],[22,68],[25,61],[30,62],[35,60],
     [38,56],[38,48],[35,38],[32,35],[30,34],[27,34],[25,37],[20,38],[16,40],
     [12,42],[10,44],[12,48],[15,48],[18,50],[22,58],[25,56],[28,52],[30,48],
     [35,38],[38,36],[42,36],[44,33],[42,29],[44,32],[46,36],[48,40],[50,42],
     [52,45],[55,50],[58,55],[60,60],[65,62],[68,65],[72,66],[75,70],[78,78],
     [75,90],[72,100],[70,110],[68,125],[70,140],[72,150],[70,155],[65,150],
     [60,150],[55,140],[50,135],[47,140],[45,137],[43,132],[40,128],[38,128],
     [36,128],[34,130],[32,130],[30,122],[25,121],[22,114],[18,110],[15,108],
     [12,109],[10,105],[8,100],[5,100],[4,103],[2,103],[1,104],[0,104],[0,100],
     [2,100],[4,98],[6,98],[8,98],[10,100],[12,98],[14,100],[16,102],[18,102],
     [20,106],[22,110],[25,116],[28,118],[30,120],[32,118],[35,115],[38,115],
     [40,118],[42,120],[44,126],[46,130],[48,135],[50,140],[52,142],[54,138],
     [56,135],[58,130],[56,126],[54,122],[52,120],[50,116],[48,112],[45,108],
     [42,104],[40,98],[38,88],[36,76],[34,72],[32,68],[30,62],[28,56],[26,50],
     [24,46],[22,42],[20,38],[18,35],[16,38],[14,42],[12,44],[10,44],[12,46],
     [14,48],[16,50],[18,54],[20,58],[22,60],[24,58],[26,56],[28,52],[30,48],
     [32,45],[35,38],[38,36],[40,36],[42,34],[44,34],[46,38],[48,40],[50,44],
     [52,48],[55,55],[58,58],[60,62],[62,68],[64,70],[66,72],[68,70],[70,65],
     [70,60],[68,56],[66,52],[65,48],[63,42],[62,40],[60,36],[58,32],[56,28],
     [55,25],[55,22],[58,22],[60,22],[62,24],[64,26],[66,28],[68,28],[70,25],[70,30]],
    // Australia
    [[-10,142],[-12,136],[-15,130],[-18,122],[-20,114],[-25,114],[-30,115],
     [-33,116],[-35,118],[-37,120],[-38,146],[-37,150],[-33,152],[-28,154],
     [-24,152],[-20,148],[-15,145],[-12,143],[-10,142]],
    // Japan
    [[30,130],[32,130],[34,131],[35,134],[36,136],[37,138],[38,141],[40,141],
     [42,140],[44,144],[43,145],[42,143],[40,140],[39,141],[38,140],[36,136],[34,135],[32,131],[30,130]],
    // UK
    [[50,-5],[51,-1],[52,1],[54,0],[55,-2],[57,-2],[58,-4],[58,-6],[56,-6],[54,-5],[52,-4],[50,-5]],
    // Iceland
    [[63,-22],[64,-18],[65,-14],[65,-13],[64,-18],[63,-24],[63,-22]],
  ];
}
