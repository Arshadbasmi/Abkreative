const socket = io();

const state = {
  role: null, // 'host' | 'player'
  code: null,
  name: null,
  card: null,
  calledSet: new Set(),
};

const $ = (id) => document.getElementById(id);

const screens = {
  home: $('screen-home'),
  hostLobby: $('screen-host-lobby'),
  playerWaiting: $('screen-player-waiting'),
  game: $('screen-game'),
};

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.add('hidden'));
  screens[name].classList.remove('hidden');
}

function toast(message, ms = 3000) {
  const el = $('toast');
  el.textContent = message;
  el.classList.remove('hidden');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add('hidden'), ms);
}

// ---------- Home screen ----------

$('btn-host').addEventListener('click', () => {
  socket.emit('host:create', {}, (res) => {
    if (!res.ok) return toast('Could not create room. Try again.');
    state.role = 'host';
    state.code = res.code;
    $('host-room-code').textContent = res.code;
    renderPlayerLists([]);
    loadNetworkHint();
    showScreen('hostLobby');
  });
});

$('btn-show-join').addEventListener('click', () => {
  $('join-form').classList.toggle('hidden');
});

$('join-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('join-name').value.trim();
  const code = $('join-code').value.trim().toUpperCase();
  $('join-error').classList.add('hidden');
  socket.emit('player:join', { code, name }, (res) => {
    if (!res.ok) {
      $('join-error').textContent = res.error;
      $('join-error').classList.remove('hidden');
      return;
    }
    state.role = 'player';
    state.code = res.code;
    state.name = res.name;
    state.card = res.card;
    showScreen('playerWaiting');
  });
});

// ---------- Host lobby ----------

async function loadNetworkHint() {
  try {
    const res = await fetch('/api/network-info');
    const data = await res.json();
    if (data.addresses.length) {
      $('host-share-hint').textContent =
        `Ask friends to join the same Wi-Fi and open: ` +
        data.addresses.map((a) => `http://${a}:${data.port}`).join(' or ');
    } else {
      $('host-share-hint').textContent = 'Ask friends on the same Wi-Fi to open this app and enter the code below.';
    }
  } catch {
    $('host-share-hint').textContent = 'Ask friends on the same Wi-Fi to open this app and enter the code below.';
  }
}

$('host-play-along').addEventListener('change', (e) => {
  if (!e.target.checked) return;
  const name = window.prompt('Your name?', 'Host')?.trim() || 'Host';
  socket.emit('player:join', { code: state.code, name }, (res) => {
    if (!res.ok) {
      toast(res.error);
      e.target.checked = false;
      return;
    }
    state.name = res.name;
    state.card = res.card;
    e.target.disabled = true;
  });
});

$('btn-host-start').addEventListener('click', () => {
  socket.emit('host:start');
});

// ---------- Player list rendering (shared) ----------

function renderPlayerLists(players) {
  const count = players.length;
  const countText = `(${count})`;
  [$('host-player-count'), $('wait-player-count'), $('game-player-count')].forEach((el) => (el.textContent = countText));

  const rows = players.length
    ? players.map((p) => `<li>${escapeHtml(p)}</li>`).join('')
    : '<li class="empty-row">Waiting for players…</li>';

  $('host-player-list').innerHTML = rows;
  $('wait-player-list').innerHTML = rows;
  $('game-player-list').innerHTML = rows;

  $('btn-host-start').disabled = players.length === 0;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

socket.on('lobby:update', ({ players }) => renderPlayerLists(players));

// ---------- Game screen ----------

function buildNumberBoard() {
  const board = $('number-board');
  board.innerHTML = '';
  for (let n = 1; n <= 99; n++) {
    const cell = document.createElement('div');
    cell.className = 'board-cell';
    cell.id = `num-${n}`;
    cell.textContent = n;
    board.appendChild(cell);
  }
}

function renderCard() {
  const panel = $('player-card-panel');
  if (!state.card) {
    panel.classList.add('hidden');
    $('btn-claim-bingo').classList.add('hidden');
    return;
  }
  panel.classList.remove('hidden');
  $('btn-claim-bingo').classList.remove('hidden');

  const cardEl = $('player-card');
  cardEl.innerHTML = '';
  state.card.forEach((row, r) => {
    row.forEach((value, c) => {
      const cell = document.createElement('div');
      cell.className = 'card-cell';
      const isFree = r === 2 && c === 2;
      if (isFree) {
        cell.classList.add('free');
        cell.textContent = 'FREE';
      } else {
        cell.textContent = value;
        if (state.calledSet.has(value)) cell.classList.add('marked');
      }
      cardEl.appendChild(cell);
    });
  });
}

socket.on('game:started', () => {
  state.calledSet = new Set();
  $('current-number').textContent = '–';
  $('called-count').textContent = '(0/99)';
  $('game-room-code').textContent = state.code;
  $('host-controls').classList.toggle('hidden', state.role !== 'host');
  buildNumberBoard();
  renderCard();
  showScreen('game');
});

socket.on('number:called', ({ number, calledNumbers }) => {
  state.calledSet = new Set(calledNumbers);
  $('current-number').textContent = number;
  $('called-count').textContent = `(${calledNumbers.length}/99)`;
  const cell = $(`num-${number}`);
  if (cell) cell.classList.add('called');
  renderCard();
});

socket.on('pool:exhausted', () => toast('All 99 numbers have been called!'));

$('btn-call-number').addEventListener('click', () => socket.emit('host:callNumber'));

$('autocall-checkbox').addEventListener('change', (e) => {
  socket.emit('host:autoCall', {
    enabled: e.target.checked,
    intervalMs: Number($('autocall-interval').value),
  });
});
$('autocall-interval').addEventListener('change', () => {
  if ($('autocall-checkbox').checked) {
    socket.emit('host:autoCall', {
      enabled: true,
      intervalMs: Number($('autocall-interval').value),
    });
  }
});

$('btn-claim-bingo').addEventListener('click', () => socket.emit('player:claimBingo'));

socket.on('claim:rejected', ({ reason }) => toast(reason));

socket.on('game:won', ({ name, pattern }) => {
  $('win-title').textContent = name === state.name ? '🎉 You won!' : '🏆 We have a winner!';
  $('win-subtitle').textContent = `${name} completed a ${pattern}!`;
  $('overlay-win').classList.remove('hidden');
});

$('btn-win-close').addEventListener('click', () => $('overlay-win').classList.add('hidden'));

$('btn-new-game').addEventListener('click', () => socket.emit('host:newGame'));

socket.on('your:newCard', ({ card }) => {
  state.card = card;
});

socket.on('game:reset', () => {
  $('overlay-win').classList.add('hidden');
  $('autocall-checkbox').checked = false;
  if (state.role === 'host') {
    showScreen('hostLobby');
  } else {
    showScreen('playerWaiting');
  }
});

socket.on('host:left', () => {
  toast('The host ended the game.', 5000);
  setTimeout(() => window.location.reload(), 3000);
});
