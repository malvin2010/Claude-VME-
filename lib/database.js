// lib/database.js — In-Memory Store (swap for MongoDB if needed)

const store = {
  groups: {},    // groupId -> settings
  users: {},     // userId -> settings
  chatbot: {},   // groupId/userId -> true/false
  banned: [],    // banned numbers
  sudo: [],      // sudo users
  warns: {},     // userId -> count
};

// ─── Group Settings ──────────────────────────────────────────
function getGroup(id) {
  if (!store.groups[id]) {
    store.groups[id] = {
      antilink: false,
      antidelete: false,
      antiSpam: false,
      welcome: true,
      goodbye: true,
      chatbot: false,
      autoread: false,
      autotyping: false,
      autorecording: false,
      autoreact: false,
      muted: false,
      mode: 'public',
    };
  }
  return store.groups[id];
}

function setGroup(id, key, value) {
  const g = getGroup(id);
  g[key] = value;
  return g;
}

// ─── User Settings ───────────────────────────────────────────
function getUser(id) {
  if (!store.users[id]) {
    store.users[id] = { warns: 0, banned: false };
  }
  return store.users[id];
}

// ─── Sudo ────────────────────────────────────────────────────
function addSudo(num) { if (!store.sudo.includes(num)) store.sudo.push(num); }
function removeSudo(num) { store.sudo = store.sudo.filter(s => s !== num); }
function isSudo(num) { return store.sudo.includes(num); }
function listSudo() { return store.sudo; }

// ─── Ban ─────────────────────────────────────────────────────
function banUser(num) { if (!store.banned.includes(num)) store.banned.push(num); }
function unbanUser(num) { store.banned = store.banned.filter(b => b !== num); }
function isBanned(num) { return store.banned.includes(num); }
function listBanned() { return store.banned; }

// ─── Warns ───────────────────────────────────────────────────
function warnUser(num) {
  if (!store.warns[num]) store.warns[num] = 0;
  store.warns[num]++;
  return store.warns[num];
}
function getWarns(num) { return store.warns[num] || 0; }
function resetWarns(num) { store.warns[num] = 0; }

module.exports = {
  store,
  getGroup, setGroup,
  getUser,
  addSudo, removeSudo, isSudo, listSudo,
  banUser, unbanUser, isBanned, listBanned,
  warnUser, getWarns, resetWarns,
};
