const os = require('os');
const path = require('path');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;
const MIN_NUMBER = 1;
const MAX_NUMBER = 99;
const CARD_SIZE = 5;
const FREE_ROW = 2;
const FREE_COL = 2;
const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/network-info', (req, res) => {
  res.json({ addresses: localNetworkAddresses(), port: PORT });
});

const httpServer = createServer(app);
const io = new Server(httpServer);

/** @type {Map<string, Room>} */
const rooms = new Map();

function shuffledPool() {
  const pool = [];
  for (let n = MIN_NUMBER; n <= MAX_NUMBER; n++) pool.push(n);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

function makeCard() {
  const numbers = shuffledPool().slice(0, CARD_SIZE * CARD_SIZE - 1);
  const grid = [];
  let cursor = 0;
  for (let r = 0; r < CARD_SIZE; r++) {
    const row = [];
    for (let c = 0; c < CARD_SIZE; c++) {
      if (r === FREE_ROW && c === FREE_COL) {
        row.push(null);
      } else {
        row.push(numbers[cursor++]);
      }
    }
    grid.push(row);
  }
  return grid;
}

function generateRoomCode() {
  let code;
  do {
    code = Array.from({ length: 4 }, () => ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)]).join('');
  } while (rooms.has(code));
  return code;
}

function createRoom(hostSocketId) {
  const code = generateRoomCode();
  const room = {
    code,
    hostSocketId,
    status: 'lobby', // lobby | playing | ended
    players: new Map(), // socketId -> { name, card }
    calledNumbers: [],
    pool: [],
    autoCallTimer: null,
    autoCallIntervalMs: null,
    winner: null,
  };
  rooms.set(code, room);
  return room;
}

function publicPlayerList(room) {
  return Array.from(room.players.values()).map((p) => p.name);
}

function stopAutoCall(room) {
  if (room.autoCallTimer) {
    clearInterval(room.autoCallTimer);
    room.autoCallTimer = null;
    room.autoCallIntervalMs = null;
  }
}

function callNextNumber(room) {
  if (room.status !== 'playing' || room.pool.length === 0) return null;
  const number = room.pool.pop();
  room.calledNumbers.push(number);
  io.to(room.code).emit('number:called', {
    number,
    calledNumbers: room.calledNumbers,
    remaining: room.pool.length,
  });
  if (room.pool.length === 0) {
    stopAutoCall(room);
    io.to(room.code).emit('pool:exhausted');
  }
  return number;
}

function cardHasWin(card, calledSet) {
  const isMarked = (r, c) => (r === FREE_ROW && c === FREE_COL) || calledSet.has(card[r][c]);

  for (let r = 0; r < CARD_SIZE; r++) {
    if ([0, 1, 2, 3, 4].every((c) => isMarked(r, c))) return `Row ${r + 1}`;
  }
  for (let c = 0; c < CARD_SIZE; c++) {
    if ([0, 1, 2, 3, 4].every((r) => isMarked(r, c))) return `Column ${c + 1}`;
  }
  if ([0, 1, 2, 3, 4].every((i) => isMarked(i, i))) return 'Diagonal';
  if ([0, 1, 2, 3, 4].every((i) => isMarked(i, 4 - i))) return 'Diagonal';
  return null;
}

function roomSummary(room) {
  return {
    code: room.code,
    status: room.status,
    players: publicPlayerList(room),
    calledNumbers: room.calledNumbers,
    winner: room.winner,
    autoCallIntervalMs: room.autoCallIntervalMs,
  };
}

io.on('connection', (socket) => {
  socket.on('host:create', (_payload, callback) => {
    const room = createRoom(socket.id);
    socket.join(room.code);
    socket.data.role = 'host';
    socket.data.code = room.code;
    callback({ ok: true, ...roomSummary(room) });
  });

  socket.on('player:join', ({ code, name }, callback) => {
    const room = rooms.get(String(code || '').toUpperCase());
    if (!room) return callback({ ok: false, error: 'Room not found. Check the code.' });
    if (room.status !== 'lobby') return callback({ ok: false, error: 'This game has already started.' });
    const trimmedName = String(name || '').trim().slice(0, 24) || 'Player';

    const card = makeCard();
    room.players.set(socket.id, { name: trimmedName, card });
    socket.join(room.code);
    socket.data.role = 'player';
    socket.data.code = room.code;

    callback({ ok: true, code: room.code, name: trimmedName, card });
    io.to(room.code).emit('lobby:update', { players: publicPlayerList(room) });
  });

  socket.on('host:start', () => {
    const room = rooms.get(socket.data.code);
    if (!room || room.hostSocketId !== socket.id) return;
    if (room.players.size === 0) return;
    room.status = 'playing';
    room.calledNumbers = [];
    room.pool = shuffledPool();
    room.winner = null;
    io.to(room.code).emit('game:started');
  });

  socket.on('host:callNumber', () => {
    const room = rooms.get(socket.data.code);
    if (!room || room.hostSocketId !== socket.id) return;
    callNextNumber(room);
  });

  socket.on('host:autoCall', ({ enabled, intervalMs }) => {
    const room = rooms.get(socket.data.code);
    if (!room || room.hostSocketId !== socket.id) return;
    stopAutoCall(room);
    if (enabled && room.status === 'playing') {
      const ms = Math.min(Math.max(Number(intervalMs) || 5000, 2000), 30000);
      room.autoCallIntervalMs = ms;
      room.autoCallTimer = setInterval(() => callNextNumber(room), ms);
    }
    io.to(room.code).emit('autocall:state', { enabled: Boolean(room.autoCallTimer), intervalMs: room.autoCallIntervalMs });
  });

  socket.on('player:claimBingo', () => {
    const room = rooms.get(socket.data.code);
    if (!room || room.status !== 'playing') return;
    const player = room.players.get(socket.id);
    if (!player) return;

    const calledSet = new Set(room.calledNumbers);
    const pattern = cardHasWin(player.card, calledSet);
    if (!pattern) {
      socket.emit('claim:rejected', { reason: 'Not a winning card yet — keep playing!' });
      return;
    }
    room.status = 'ended';
    room.winner = { name: player.name, pattern };
    stopAutoCall(room);
    io.to(room.code).emit('game:won', { name: player.name, pattern });
  });

  socket.on('host:newGame', () => {
    const room = rooms.get(socket.data.code);
    if (!room || room.hostSocketId !== socket.id) return;
    stopAutoCall(room);
    room.status = 'lobby';
    room.calledNumbers = [];
    room.pool = [];
    room.winner = null;
    for (const [id, player] of room.players.entries()) {
      player.card = makeCard();
      io.to(id).emit('your:newCard', { card: player.card });
    }
    io.to(room.code).emit('game:reset');
    io.to(room.code).emit('lobby:update', { players: publicPlayerList(room) });
  });

  socket.on('disconnect', () => {
    const code = socket.data.code;
    if (!code) return;
    const room = rooms.get(code);
    if (!room) return;

    if (room.hostSocketId === socket.id) {
      stopAutoCall(room);
      io.to(room.code).emit('host:left');
      rooms.delete(code);
      return;
    }

    if (room.players.delete(socket.id)) {
      io.to(room.code).emit('lobby:update', { players: publicPlayerList(room) });
    }
  });
});

function localNetworkAddresses() {
  const nets = os.networkInterfaces();
  const addresses = [];
  for (const iface of Object.values(nets)) {
    for (const net of iface || []) {
      if (net.family === 'IPv4' && !net.internal) addresses.push(net.address);
    }
  }
  return addresses;
}

httpServer.listen(PORT, () => {
  console.log(`\nBingo server running!`);
  console.log(`  On this computer: http://localhost:${PORT}`);
  const addresses = localNetworkAddresses();
  if (addresses.length) {
    console.log(`  For friends on the same Wi-Fi:`);
    addresses.forEach((addr) => console.log(`    http://${addr}:${PORT}`));
  } else {
    console.log('  Could not detect a LAN address — check your network connection.');
  }
  console.log('');
});
