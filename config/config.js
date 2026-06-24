// config/config.js — Malvin C VME Bot Config
require('dotenv').config();

module.exports = {
  ownerName: process.env.OWNER_NAME || 'Malvin C',         // ← change this
  ownerNumber: process.env.OWNER_NUMBER || '263xxxxxxxxx', // ← change this (your number)
  botName: process.env.BOT_NAME || 'Malvin C VME',         // ← change this
  prefix: process.env.PREFIX || '.',
  mode: process.env.MODE || 'public',
  sessionId: process.env.SESSION_ID || '',
  mongodbUri: process.env.MONGODB_URI || '',
  openaiKey: process.env.OPENAI_API_KEY || '',
  geminiKey: process.env.GEMINI_API_KEY || '',
  port: parseInt(process.env.PORT) || 3000,

  // Bot version
  version: '1.0.0',
  developer: 'Handsome Tech Zimbabwe 🇿🇼',

  // Feature toggles per group (stored in memory, use MongoDB for persistence)
  // These are defaults; commands can override per-group
  defaults: {
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
  },

  // Blocked extensions from anti-link
  allowedDomains: [],

  // Media limits
  maxVideoSizeMB: 50,
  maxAudioSizeMB: 30,

  // Color codes for terminal
  colors: {
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    magenta: '\x1b[35m',
  },
};
