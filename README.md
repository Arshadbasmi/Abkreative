# Bingo 1–99 🎱

Play Bingo with friends over the same Wi-Fi network — one person hosts, everyone
else joins from their phone or laptop browser with a 4-letter room code.

## How to play

1. **Host** installs and starts the server on their computer:

   ```bash
   npm install
   npm start
   ```

   The terminal prints a room-shareable address, e.g.:

   ```
   For friends on the same Wi-Fi:
     http://192.168.1.23:3000
   ```

2. On the host's screen, open that address (or `http://localhost:3000`) in a
   browser and click **Host a Game**. Share the 4-letter room code with friends.

3. Everyone else, while connected to the **same Wi-Fi network**, opens the
   printed address in their own browser, clicks **Join a Game**, and enters
   their name and the room code.

4. Once everyone has joined, the host clicks **Start Game**. The host can call
   numbers manually (🎲 Call Next Number) or turn on auto-call to draw a new
   number every few seconds.

5. Numbers are marked automatically on every player's card as they're called.
   The first player to complete a row, column, or diagonal clicks **BINGO!**
   to win. The host can then start a **New Game** for another round.

The host can also check "I want to play too" before starting to get their own
card and join in.

## Requirements

- [Node.js](https://nodejs.org/) 18+
- All players must be on the same local network (same Wi-Fi/router) as the host.

## Tech

Plain HTML/CSS/JS frontend, no build step. Backend is a small Express +
Socket.IO server that keeps game state in memory (rooms disappear once the
host closes the server).
