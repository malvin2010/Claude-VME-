// lib/utils.js — Helper utilities for Malvin C VME

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('../config/config');

// ─── Format phone numbers ─────────────────────────────────────
function formatPhone(num) {
  return num.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
}

function getNumber(jid) {
  return jid.split('@')[0];
}

// ─── Check if sender is owner ─────────────────────────────────
function isOwner(sender) {
  const num = getNumber(sender);
  return num === config.ownerNumber.replace(/[^0-9]/g, '');
}

// ─── Runtime formatter ───────────────────────────────────────
function runtime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

// ─── Random array item ───────────────────────────────────────
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Random number in range ──────────────────────────────────
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Download file from URL ──────────────────────────────────
async function downloadFile(url, dest) {
  const res = await axios({ url, method: 'GET', responseType: 'stream' });
  const writer = fs.createWriteStream(dest);
  res.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// ─── Sleep ───────────────────────────────────────────────────
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Get buffer from URL ─────────────────────────────────────
async function getBuffer(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(res.data);
}

// ─── Pretty time ─────────────────────────────────────────────
function timeNow() {
  return new Date().toLocaleTimeString('en-ZW', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: 'Africa/Harare',
  });
}

function dateNow() {
  return new Date().toLocaleDateString('en-ZW', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Africa/Harare',
  });
}

// ─── Greeting by time ────────────────────────────────────────
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return '🌅 Good Morning';
  if (hour < 17) return '☀️ Good Afternoon';
  if (hour < 21) return '🌆 Good Evening';
  return '🌙 Good Night';
}

// ─── Clean temp files ────────────────────────────────────────
function cleanTmp() {
  const tmpDir = path.join(__dirname, '../tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const files = fs.readdirSync(tmpDir);
  const now = Date.now();
  files.forEach(file => {
    const filePath = path.join(tmpDir, file);
    const stat = fs.statSync(filePath);
    if (now - stat.mtimeMs > 5 * 60 * 1000) { // 5 min
      fs.unlinkSync(filePath);
    }
  });
}

// ─── Get file extension ──────────────────────────────────────
function getExt(filename) {
  return path.extname(filename).slice(1).toLowerCase();
}

// ─── Is URL ──────────────────────────────────────────────────
function isUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}

// ─── Mentions from message ───────────────────────────────────
function getMentions(text) {
  const matches = text.match(/@\d+/g) || [];
  return matches.map(m => m.slice(1) + '@s.whatsapp.net');
}

// ─── Capitalize ──────────────────────────────────────────────
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Shorten text ────────────────────────────────────────────
function shorten(str, len = 100) {
  return str.length > len ? str.substring(0, len) + '...' : str;
}

// ─── Temp path ───────────────────────────────────────────────
function tmpPath(ext = 'tmp') {
  const dir = path.join(__dirname, '../tmp');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, `${Date.now()}.${ext}`);
}

module.exports = {
  formatPhone, getNumber, isOwner,
  runtime, pickRandom, randInt,
  downloadFile, sleep, getBuffer,
  timeNow, dateNow, getGreeting,
  cleanTmp, getExt, isUrl,
  getMentions, capitalize, shorten, tmpPath,
};
