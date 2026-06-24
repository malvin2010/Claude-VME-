// index.js — Malvin C VME | Entry Point
// Handsome Tech Zimbabwe 🇿🇼

require('dotenv').config();
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express');
const path = require('path');
const fs = require('fs');

const config = require('./config/config');
const db = require('./lib/database');
const { handleCommand } = require('./commands/index');
const { isOwner, getNumber, sleep } = require('./lib/utils');

// ─── Express web server (keeps Railway/Render alive) ─────────
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Malvin C VME</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
          background: #0a0a0a;
          color: #00ff88;
          font-family: 'Courier New', monospace;
          display: flex; align-items: center; justify-content: center;
          min-height: 100vh; flex-direction: column; text-align: center;
          padding: 20px;
        }
        h1 { font-size: 2.5rem; margin-bottom: 10px; text-shadow: 0 0 20px #00ff88; }
        p { color: #aaa; margin: 6px 0; }
        .badge {
          background: #00ff8820; border: 1px solid #00ff88;
          border-radius: 20px; padding: 6px 18px; margin: 10px 4px;
          display: inline-block; font-size: 0.85rem;
        }
        .glow { animation: glow 2s infinite alternate; }
        @keyframes glow { from { text-shadow: 0 0 10px #00ff88; } to { text-shadow: 0 0 30px #00ff88, 0 0 60px #00ff44; } }
      </style>
    </head>
    <body>
      <h1 class="glow">🤖 Malvin C VME</h1>
      <p>WhatsApp Multi-Device Bot</p>
      <p style="color:#00ff88; margin-top:12px;">Status: <strong>✅ Online</strong></p>
      <br>
      <span class="badge">781+ Commands</span>
      <span class="badge">Version ${config.version}</span>
      <span class="badge">🇿🇼 Zimbabwe</span>
      <br><br>
      <p style="color:#555;">Handsome Tech Zimbabwe</p>
      <p style="color:#555; font-size:0.8rem; margin-top:8px;">Uptime: ${Math.floor(process.uptime() / 60)}m ${Math.floor(process.uptime() % 60)}s</p>
    </body>
    </html>
  `);
});
app.listen(config.port, () => {
  console.log(`${config.colors.cyan}[WEB]${config.colors.reset} Panel running on port ${config.port}`);
});

// ─── Session directory ────────────────────────────────────────
const SESSION_DIR = path.join(__dirname, 'session');
if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

// ─── Logger ──────────────────────────────────────────────────
const logger = pino({ level: 'silent' });

// ─── Bot startup ─────────────────────────────────────────────
async function startBot() {
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

  const sock = makeWASocket({
    version,
    logger,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser: Browsers.ubuntu('Chrome'),
    printQRInTerminal: false,
    syncFullHistory: false,
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
  });

  // ─── Pairing code flow ────────────────────────────────────
  if (!sock.authState.creds.registered) {
    const sessionId = config.sessionId || process.env.SESSION_ID;
    if (sessionId && sessionId.trim()) {
      // Session ID provided — restore session
      console.log(`${config.colors.green}[AUTH]${config.colors.reset} Session ID found. Restoring...`);
    } else {
      // Request pairing code
      const ownerNum = config.ownerNumber.replace(/[^0-9]/g, '');
      await sleep(2000);
      try {
        const code = await sock.requestPairingCode(ownerNum);
        console.log('\n' + '═'.repeat(50));
        console.log(`${config.colors.bold}${config.colors.cyan}  🔗 MALVIN C VME — PAIRING CODE${config.colors.reset}`);
        console.log('═'.repeat(50));
        console.log(`  📱 Number: +${ownerNum}`);
        console.log(`  🔐 Code:   ${config.colors.bold}${config.colors.green}${code}${config.colors.reset}`);
        console.log('─'.repeat(50));
        console.log('  Steps:');
        console.log('  1. Open WhatsApp on your phone');
        console.log('  2. Go to Settings → Linked Devices');
        console.log('  3. Tap "Link a Device"');
        console.log('  4. Enter the code above');
        console.log('═'.repeat(50) + '\n');
      } catch (e) {
        console.log(`${config.colors.red}[AUTH]${config.colors.reset} Pairing code error: ${e.message}`);
      }
    }
  }

  // ─── Connection updates ───────────────────────────────────
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (connection === 'open') {
      console.log('\n' + '═'.repeat(50));
      console.log(`${config.colors.bold}${config.colors.green}  ✅ MALVIN C VME CONNECTED!${config.colors.reset}`);
      console.log(`  🤖 Bot: ${config.botName}`);
      console.log(`  👑 Owner: ${config.ownerName}`);
      console.log(`  📦 Prefix: ${config.prefix}`);
      console.log(`  📜 Commands: 781+`);
      console.log(`  🇿🇼 Handsome Tech Zimbabwe`);
      console.log('═'.repeat(50) + '\n');

      // Send startup message to owner
      try {
        await sleep(3000);
        await sock.sendMessage(config.ownerNumber.replace(/[^0-9]/g, '') + '@s.whatsapp.net', {
          text:
            `╔══❰ ✅ *BOT CONNECTED* ❱══╗\n` +
            `║ 🤖 *${config.botName}* is now Online!\n` +
            `║ 📦 *Prefix:* ${config.prefix}\n` +
            `║ 📜 *Commands:* 781+\n` +
            `║ ⚡ *Version:* ${config.version}\n` +
            `║ 🇿🇼 *Handsome Tech Zimbabwe*\n` +
            `╚════════════════════╝\n\n` +
            `Type *${config.prefix}menu* to see all commands.`,
        });
      } catch {}
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(`${config.colors.yellow}[CONN]${config.colors.reset} Connection closed. Reconnecting: ${shouldReconnect}`);
      if (shouldReconnect) {
        await sleep(3000);
        startBot();
      } else {
        console.log(`${config.colors.red}[CONN]${config.colors.reset} Logged out. Delete session folder and restart.`);
        process.exit(1);
      }
    }
  });

  // ─── Save credentials ─────────────────────────────────────
  sock.ev.on('creds.update', saveCreds);

  // ─── Messages ─────────────────────────────────────────────
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      try {
        if (!msg.message) continue;
        if (msg.key.fromMe && msg.key.id.startsWith('BAE5')) continue; // skip status broadcasts

        const from = msg.key.remoteJid;
        const sender = msg.key.participant || msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const pushName = msg.pushName || 'User';

        // Get message body
        const body =
          msg.message?.conversation ||
          msg.message?.extendedTextMessage?.text ||
          msg.message?.imageMessage?.caption ||
          msg.message?.videoMessage?.caption ||
          msg.message?.documentMessage?.caption ||
          '';

        // Auto read
        if (config.defaults.autoread) {
          await sock.readMessages([msg.key]);
        }

        // Auto typing presence
        if (config.defaults.autotyping && body.startsWith(config.prefix)) {
          await sock.sendPresenceUpdate('composing', from);
        }

        // Auto recording presence
        if (config.defaults.autorecording && body.startsWith(config.prefix)) {
          await sock.sendPresenceUpdate('recording', from);
        }

        // Auto react
        if (config.defaults.autoreact && body.startsWith(config.prefix)) {
          const reacts = ['👍', '❤️', '🔥', '⚡', '😊', '🇿🇼'];
          await sock.sendMessage(from, {
            react: { text: reacts[Math.floor(Math.random() * reacts.length)], key: msg.key },
          });
        }

        // Check banned
        if (db.isBanned(getNumber(sender))) continue;

        // Anti-link (group)
        if (isGroup) {
          const grpSettings = db.getGroup(from);
          const hasLink = /(https?:\/\/|wa\.me\/|chat\.whatsapp\.com\/)/i.test(body);
          if (grpSettings.antilink && hasLink) {
            // Check if sender is admin
            try {
              const meta = await sock.groupMetadata(from);
              const isAdminSender = meta.participants.find(p => p.id === sender)?.admin;
              if (!isAdminSender && !isOwner(sender)) {
                await sock.sendMessage(from, {
                  delete: msg.key,
                });
                await sock.sendMessage(from, {
                  text: `⚠️ @${getNumber(sender)}, links are *not allowed* in this group!`,
                  mentions: [sender],
                }, { quoted: msg });
              }
            } catch {}
            continue;
          }
        }

        // Is owner
        const isOwnerMsg = isOwner(sender);
        const isSudoUser = db.isSudo(getNumber(sender));

        // Is group admin
        let isAdmin = false;
        let isBotAdmin = false;
        let mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

        if (isGroup) {
          try {
            const meta = await sock.groupMetadata(from);
            const botJid = sock.user.id.replace(/:\d+/, '') + '@s.whatsapp.net';
            isAdmin = !!meta.participants.find(p => p.id === sender && p.admin);
            isBotAdmin = !!meta.participants.find(p => p.id === botJid && p.admin);
          } catch {}
        }

        // Handle command
        await handleCommand(sock, msg, {
          body,
          sender,
          from,
          isGroup,
          isOwnerMsg,
          isSudo: isSudoUser,
          isAdmin,
          isBotAdmin,
          mentionedJid,
          pushName,
        });

      } catch (err) {
        console.error(`${config.colors.red}[MSG ERROR]${config.colors.reset}`, err.message);
      }
    }
  });

  // ─── Group participant updates (welcome/goodbye) ──────────
  sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
    try {
      const grpSettings = db.getGroup(id);
      const meta = await sock.groupMetadata(id);

      for (const jid of participants) {
        const num = getNumber(jid);

        if (action === 'add' && grpSettings.welcome) {
          await sock.sendMessage(id, {
            text:
              `╔══❰ 👋 *WELCOME* ❱══╗\n` +
              `║\n` +
              `║ Welcome to *${meta.subject}*!\n` +
              `║ @${num} 🎉\n` +
              `║\n` +
              `║ 👥 Members: ${meta.participants.length}\n` +
              `║ 🤖 Bot: ${config.botName}\n` +
              `║ 📦 Prefix: ${config.prefix}\n` +
              `╚════════════════════╝\n\n` +
              `Type *${config.prefix}menu* for commands.`,
            mentions: [jid],
          });
        }

        if (action === 'remove' && grpSettings.goodbye) {
          await sock.sendMessage(id, {
            text:
              `╔══❰ 👋 *GOODBYE* ❱══╗\n` +
              `║\n` +
              `║ @${num} has left the group.\n` +
              `║ We will miss you! 💔\n` +
              `║\n` +
              `║ 👥 Remaining: ${meta.participants.length}\n` +
              `╚════════════════════╝`,
            mentions: [jid],
          });
        }

        // Auto approve
        if (action === 'request' && grpSettings.autoapprove) {
          await sock.groupRequestParticipantsUpdate(id, [jid], 'approve');
        }
      }
    } catch {}
  });

  // ─── Anti-delete ──────────────────────────────────────────
  sock.ev.on('messages.update', async (updates) => {
    for (const update of updates) {
      try {
        if (!update.update?.messageStubType) continue;
        const from = update.key.remoteJid;
        if (!from) continue;

        const grpSettings = from.endsWith('@g.us') ? db.getGroup(from) : null;
        if (grpSettings?.antidelete) {
          // Message was deleted — notify
          await sock.sendMessage(from, {
            text: `🗑️ A message was deleted by @${getNumber(update.key.participant || update.key.remoteJid)}\n\n_Anti-delete is ON_`,
            mentions: [update.key.participant || update.key.remoteJid],
          });
        }
      } catch {}
    }
  });

  // ─── Call rejection ───────────────────────────────────────
  sock.ev.on('call', async (calls) => {
    for (const call of calls) {
      if (config.defaults.anticall && call.status === 'offer') {
        try {
          await sock.rejectCall(call.id, call.from);
          await sock.sendMessage(call.from, {
            text: `📵 Sorry, I don't accept calls!\nContact my owner @${config.ownerNumber} instead.\n\n🇿🇼 ${config.botName}`,
          });
        } catch {}
      }
    }
  });

  return sock;
}

// ─── Start ────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(50));
console.log(`  🚀 Starting ${config.colors.bold}Malvin C VME${config.colors.reset}...`);
console.log(`  🇿🇼 Handsome Tech Zimbabwe`);
console.log('═'.repeat(50));
startBot().catch(console.error);
