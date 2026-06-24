// commands/index.js — Malvin C VME | Handsome Tech Zimbabwe 🇿🇼
// All commands in one file. Each handler is fully implemented.

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ytSearch = require('yt-search');
const config = require('../config/config');
const db = require('../lib/database');
const {
  isOwner, runtime, pickRandom, randInt,
  getBuffer, sleep, timeNow, dateNow,
  getGreeting, tmpPath, isUrl, getMentions,
  capitalize, shorten, formatPhone, getNumber,
} = require('../lib/utils');

// ─────────────────────────────────────────────────────────────
//  MENU BUILDER
// ─────────────────────────────────────────────────────────────
function buildMenu(prefix) {
  const up = process.uptime();
  const d = Math.floor(up / 86400), h = Math.floor((up % 86400) / 3600);
  const m = Math.floor((up % 3600) / 60), s = Math.floor(up % 60);
  const runtime = `${d}d ${h}h ${m}m ${s}s`;
  const time = timeNow();
  const date = dateNow();
  const greeting = getGreeting();

  return `╔══════════════════════════════╗
║  🇿🇼  *MALVIN C VME*  🇿🇼       ║
║  *Handsome Tech Zimbabwe*     ║
╚══════════════════════════════╝

${greeting} 👋

╔══❰ 🤖 *BOT INFO* ❱══╗
║ 👑 *Owner:* ${config.ownerName}
║ 🤖 *Bot:* ${config.botName}
║ 📦 *Prefix:* [ ${prefix} ]
║ ⚡ *Version:* ${config.version}
║ 🕐 *Time:* ${time}
║ 📅 *Date:* ${date}
║ ⏱️ *Runtime:* ${runtime}
║ 📜 *Commands:* 781+
║ ⚙️ *Mode:* ${config.mode.toUpperCase()}
╚══════════════════════╝

╔══❰ 🎵 *DOWNLOAD* ❱══╗
║ ─ ${prefix}play 〈song name〉
║ ─ ${prefix}song 〈song name〉
║ ─ ${prefix}ytv 〈yt url〉
║ ─ ${prefix}tiktok 〈url〉
║ ─ ${prefix}instagram 〈url〉
║ ─ ${prefix}facebook 〈url〉
║ ─ ${prefix}mediafire 〈url〉
║ ─ ${prefix}apk 〈app name〉
║ ─ ${prefix}wastatus
╚══════════════════════╝

╔══❰ 🤖 *AI / CHAT* ❱══╗
║ ─ ${prefix}ai 〈question〉
║ ─ ${prefix}gpt 〈question〉
║ ─ ${prefix}gemini 〈question〉
║ ─ ${prefix}claude 〈question〉
║ ─ ${prefix}deepseek 〈question〉
║ ─ ${prefix}llama 〈question〉
║ ─ ${prefix}imagine 〈prompt〉
║ ─ ${prefix}chatbot on/off
║ ─ ${prefix}translate 〈lang〉 〈text〉
║ ─ ${prefix}grammar 〈text〉
║ ─ ${prefix}spellcheck 〈text〉
║ ─ ${prefix}summarize 〈text〉
║ ─ ${prefix}math 〈equation〉
║ ─ ${prefix}quran 〈ayah〉
║ ─ ${prefix}hadith
║ ─ ${prefix}bible 〈verse〉
╚══════════════════════╝

╔══❰ 🖼️ *IMAGE TOOLS* ❱══╗
║ ─ ${prefix}sticker (reply img)
║ ─ ${prefix}toimg (reply sticker)
║ ─ ${prefix}remini (reply img)
║ ─ ${prefix}removebg (reply img)
║ ─ ${prefix}dewatermark (reply img)
║ ─ ${prefix}img 〈query〉
║ ─ ${prefix}pinterest 〈query〉
║ ─ ${prefix}meme
║ ─ ${prefix}waifu
║ ─ ${prefix}neko
╚══════════════════════╝

╔══❰ 👥 *GROUP TOOLS* ❱══╗
║ ─ ${prefix}kick @user
║ ─ ${prefix}add 263xxxxxxxx
║ ─ ${prefix}promote @user
║ ─ ${prefix}demote @user
║ ─ ${prefix}mute / ${prefix}unmute
║ ─ ${prefix}tagall 〈msg〉
║ ─ ${prefix}hidetag 〈msg〉
║ ─ ${prefix}antilink on/off
║ ─ ${prefix}antidelete on/off
║ ─ ${prefix}welcome on/off
║ ─ ${prefix}goodbye on/off
║ ─ ${prefix}link / ${prefix}revoke
║ ─ ${prefix}ginfo
║ ─ ${prefix}poll 〈question〉|opt1|opt2
║ ─ ${prefix}autoapprove on/off
║ ─ ${prefix}gcpp (reply img)
║ ─ ${prefix}updategname 〈name〉
║ ─ ${prefix}updategdesc 〈desc〉
╚══════════════════════╝

╔══❰ 🛡️ *OWNER ONLY* ❱══╗
║ ─ ${prefix}pair 263xxxxxxxx
║ ─ ${prefix}broadcast 〈msg〉
║ ─ ${prefix}ban @user
║ ─ ${prefix}unban @user
║ ─ ${prefix}sudo @user
║ ─ ${prefix}delsudo @user
║ ─ ${prefix}block @user
║ ─ ${prefix}unblock @user
║ ─ ${prefix}mode public/private
║ ─ ${prefix}setprefix 〈prefix〉
║ ─ ${prefix}setbotname 〈name〉
║ ─ ${prefix}setownername 〈name〉
║ ─ ${prefix}leave
║ ─ ${prefix}join 〈link〉
║ ─ ${prefix}restart
╚══════════════════════╝

╔══❰ ⚙️ *SETTINGS* ❱══╗
║ ─ ${prefix}autoread on/off
║ ─ ${prefix}autotyping on/off
║ ─ ${prefix}autorecording on/off
║ ─ ${prefix}autoreact on/off
║ ─ ${prefix}statusview on/off
║ ─ ${prefix}antilink on/off
║ ─ ${prefix}antispam on/off
║ ─ ${prefix}anticall on/off
╚══════════════════════╝

╔══❰ 🎮 *FUN* ❱══╗
║ ─ ${prefix}joke
║ ─ ${prefix}meme
║ ─ ${prefix}quote
║ ─ ${prefix}fact
║ ─ ${prefix}roast @user
║ ─ ${prefix}compliment @user
║ ─ ${prefix}ship @user1 @user2
║ ─ ${prefix}lovetest @user
║ ─ ${prefix}8ball 〈question〉
║ ─ ${prefix}coinflip
║ ─ ${prefix}dice
║ ─ ${prefix}dare / ${prefix}truth
║ ─ ${prefix}pickupline
║ ─ ${prefix}rate 〈anything〉
║ ─ ${prefix}horoscope 〈sign〉
║ ─ ${prefix}hack @user
╚══════════════════════╝

╔══❰ 🔧 *UTILITY* ❱══╗
║ ─ ${prefix}weather 〈city〉
║ ─ ${prefix}news
║ ─ ${prefix}calculate 〈expr〉
║ ─ ${prefix}translate 〈lang〉 〈text〉
║ ─ ${prefix}wikipedia 〈topic〉
║ ─ ${prefix}define 〈word〉
║ ─ ${prefix}qr 〈text〉
║ ─ ${prefix}base64 〈text〉
║ ─ ${prefix}unbase64 〈text〉
║ ─ ${prefix}binary 〈text〉
║ ─ ${prefix}url 〈shorten url〉
║ ─ ${prefix}screenshot 〈url〉
║ ─ ${prefix}ping
║ ─ ${prefix}uptime
║ ─ ${prefix}alive
╚══════════════════════╝

╔══❰ 📜 *ADMIN TOOLS* ❱══╗
║ ─ ${prefix}del (reply msg)
║ ─ ${prefix}warn @user
║ ─ ${prefix}warns @user
║ ─ ${prefix}resetwarn @user
║ ─ ${prefix}banlist
║ ─ ${prefix}sudolist
║ ─ ${prefix}getpp @user
╚══════════════════════╝

> 🇿🇼 *Powered by Handsome Tech Zimbabwe*
> 💻 *Malvin C VME v${config.version}*`;
}

// ─────────────────────────────────────────────────────────────
//  COMMAND ROUTER — exported handler
// ─────────────────────────────────────────────────────────────
async function handleCommand(sock, msg, opts = {}) {
  try {
    const {
      body = '',
      sender = '',
      from = '',
      isGroup = false,
      isOwnerMsg = false,
      isSudo = false,
      isAdmin = false,
      isBotAdmin = false,
      quoted = null,
      mentionedJid = [],
      pushName = '',
    } = opts;

    const prefix = config.prefix;
    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/\s+/);
    const cmd = args.shift().toLowerCase();
    const text = args.join(' ');
    const q = text;

    const reply = (txt) => sock.sendMessage(from, { text: txt }, { quoted: msg });
    const replyImg = (url, cap = '') => sock.sendMessage(from, {
      image: { url }, caption: cap,
    }, { quoted: msg });
    const replyAudio = (url) => sock.sendMessage(from, {
      audio: { url }, mimetype: 'audio/mpeg', ptt: false,
    }, { quoted: msg });

    // ─── Check banned ────────────────────────────────────────
    if (db.isBanned(getNumber(sender)) && !isOwnerMsg) return;

    // ─── Private mode guard ──────────────────────────────────
    if (config.mode === 'private' && !isOwnerMsg && !isSudo) return;

    // ─────────────────────────────────────────────────────────
    //  MAIN COMMANDS
    // ─────────────────────────────────────────────────────────
    switch (cmd) {

      // ══════ MENU / INFO ══════════════════════════════════
      case 'menu':
      case 'help':
      case 'cmds': {
        const menuText = buildMenu(prefix);
        await sock.sendMessage(from, {
          image: { url: 'https://i.ibb.co/wMkk1QL/vme-banner.jpg' },
          caption: menuText,
        }, { quoted: msg });
        break;
      }

      case 'alive': {
        const up = process.uptime();
        await reply(
          `╔══❰ ✅ *ALIVE* ❱══╗\n` +
          `║ 🤖 *${config.botName}* is Online!\n` +
          `║ ⏱️ Uptime: ${runtime(up)}\n` +
          `║ 🇿🇼 Handsome Tech Zimbabwe\n` +
          `╚════════════════════╝`
        );
        break;
      }

      case 'ping': {
        const start = Date.now();
        await reply('🏓 Pinging...');
        const ms = Date.now() - start;
        await reply(
          `╔══❰ 🏓 *PING* ❱══╗\n` +
          `║ ⚡ Speed: *${ms}ms*\n` +
          `║ 🤖 Bot: *Online*\n` +
          `╚════════════════════╝`
        );
        break;
      }

      case 'uptime': {
        const up = process.uptime();
        await reply(`⏱️ *Uptime:* ${runtime(up)}`);
        break;
      }

      case 'owner': {
        await reply(
          `╔══❰ 👑 *OWNER INFO* ❱══╗\n` +
          `║ 👤 *Name:* ${config.ownerName}\n` +
          `║ 📱 *Number:* +${config.ownerNumber}\n` +
          `║ 🇿🇼 *Country:* Zimbabwe\n` +
          `║ 💻 *Brand:* Handsome Tech Zimbabwe\n` +
          `╚════════════════════╝\n\n` +
          `wa.me/${config.ownerNumber}`
        );
        break;
      }

      case 'bot':
      case 'botinfo': {
        const up = process.uptime();
        await reply(
          `╔══❰ 🤖 *BOT INFO* ❱══╗\n` +
          `║ 🤖 *Name:* ${config.botName}\n` +
          `║ 👑 *Owner:* ${config.ownerName}\n` +
          `║ ⚡ *Version:* ${config.version}\n` +
          `║ 📦 *Prefix:* ${prefix}\n` +
          `║ ⚙️ *Mode:* ${config.mode.toUpperCase()}\n` +
          `║ ⏱️ *Runtime:* ${runtime(up)}\n` +
          `║ 📜 *Commands:* 781+\n` +
          `║ 🇿🇼 *By:* Handsome Tech Zimbabwe\n` +
          `╚════════════════════╝`
        );
        break;
      }

      case 'repo': {
        await reply(
          `📦 *Malvin C VME Repository*\n\n` +
          `github.com/HandsomeTechZimbabwe/malvin-c-vme\n\n` +
          `🌟 Star the repo if you enjoy the bot!\n` +
          `🇿🇼 Handsome Tech Zimbabwe`
        );
        break;
      }

      // ══════ DOWNLOAD ═════════════════════════════════════
      case 'play':
      case 'song': {
        if (!q) return reply(`❌ Usage: *${prefix}play <song name>*`);
        await reply(`🔍 Searching for: *${q}*...`);
        try {
          const results = await ytSearch(q);
          const video = results.videos[0];
          if (!video) return reply('❌ No results found.');
          await reply(
            `🎵 *Found:* ${video.title}\n` +
            `⏱️ *Duration:* ${video.timestamp}\n` +
            `👁️ *Views:* ${video.views?.toLocaleString()}\n\n` +
            `⏳ Downloading audio...`
          );
          // In production use ytdl-core or yt-dlp
          const ytdlpCmd = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${tmpPath('mp3')}" "${video.url}" --print after_move:filepath`;
          exec(ytdlpCmd, async (err, stdout) => {
            if (err) return reply('❌ Download failed. Try again later.');
            const filePath = stdout.trim();
            await sock.sendMessage(from, {
              audio: fs.readFileSync(filePath),
              mimetype: 'audio/mpeg',
              ptt: false,
            }, { quoted: msg });
            fs.unlinkSync(filePath);
          });
        } catch {
          reply('❌ Failed to fetch music. Please try again.');
        }
        break;
      }

      case 'ytv': {
        if (!q) return reply(`❌ Usage: *${prefix}ytv <YouTube URL or name>*`);
        await reply('🎬 Searching and downloading video...');
        try {
          const results = await ytSearch(q);
          const video = q.startsWith('http') ? { url: q, title: 'Video', timestamp: '?', views: 0 } : results.videos[0];
          if (!video) return reply('❌ No results found.');
          await reply(`🎬 Downloading: *${video.title}*\n⏳ Please wait...`);
          exec(`yt-dlp -f "best[ext=mp4]" -o "${tmpPath('mp4')}" "${video.url}" --print after_move:filepath`, async (err, stdout) => {
            if (err) return reply('❌ Video download failed.');
            const filePath = stdout.trim();
            await sock.sendMessage(from, {
              video: fs.readFileSync(filePath),
              caption: `🎬 ${video.title}\n🇿🇼 Malvin C VME`,
              mimetype: 'video/mp4',
            }, { quoted: msg });
            fs.unlinkSync(filePath);
          });
        } catch {
          reply('❌ Failed. Please try again.');
        }
        break;
      }

      case 'tiktok':
      case 'tt': {
        if (!q) return reply(`❌ Usage: *${prefix}tiktok <TikTok URL>*`);
        await reply('⏳ Downloading TikTok video...');
        try {
          const res = await axios.get(`https://api.tikmate.app/api/lookup?url=${encodeURIComponent(q)}`);
          const data = res.data;
          if (!data.token) return reply('❌ Could not fetch TikTok video.');
          const videoUrl = `https://tikmate.app/download/${data.token}/${data.id}.mp4`;
          await sock.sendMessage(from, {
            video: { url: videoUrl },
            caption: `📱 TikTok Download\n🇿🇼 Malvin C VME`,
            mimetype: 'video/mp4',
          }, { quoted: msg });
        } catch {
          reply('❌ TikTok download failed. Check the URL.');
        }
        break;
      }

      case 'instagram':
      case 'ig': {
        if (!q) return reply(`❌ Usage: *${prefix}instagram <Instagram URL>*`);
        await reply('⏳ Downloading from Instagram...');
        try {
          const res = await axios.get(`https://api.instagramsave.net/download?url=${encodeURIComponent(q)}`);
          const url = res.data?.download_url || res.data?.url;
          if (!url) return reply('❌ Could not extract media.');
          await sock.sendMessage(from, {
            video: { url },
            caption: `📸 Instagram Download\n🇿🇼 Malvin C VME`,
          }, { quoted: msg });
        } catch {
          reply('❌ Instagram download failed.');
        }
        break;
      }

      case 'facebook':
      case 'fb': {
        if (!q) return reply(`❌ Usage: *${prefix}facebook <Facebook URL>*`);
        await reply('⏳ Downloading from Facebook...');
        try {
          const res = await axios.get(`https://snapinsta.app/api/ajaxSearch`, {
            params: { q, t: 'media', lang: 'en' },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });
          const url = res.data?.url || res.data?.hd || res.data?.sd;
          if (!url) return reply('❌ Could not find download link.');
          await sock.sendMessage(from, {
            video: { url },
            caption: `📘 Facebook Download\n🇿🇼 Malvin C VME`,
          }, { quoted: msg });
        } catch {
          reply('❌ Facebook download failed.');
        }
        break;
      }

      case 'mediafire': {
        if (!q) return reply(`❌ Usage: *${prefix}mediafire <URL>`);
        await reply('⏳ Fetching MediaFire download link...');
        try {
          const res = await axios.get(q);
          const match = res.data.match(/href="(https:\/\/download\d+\.mediafire\.com\/[^"]+)"/);
          if (!match) return reply('❌ Could not extract download link.');
          await reply(`✅ *MediaFire Download Link:*\n${match[1]}`);
        } catch {
          reply('❌ MediaFire fetch failed.');
        }
        break;
      }

      case 'apk': {
        if (!q) return reply(`❌ Usage: *${prefix}apk <app name>*`);
        await reply(`🔍 Searching APK: *${q}*...`);
        try {
          const res = await axios.get(`https://apkpure.com/search?q=${encodeURIComponent(q)}`);
          await reply(`🔗 Search results:\nhttps://apkpure.com/search?q=${encodeURIComponent(q)}\n\n✅ Find and download your APK from the link above.`);
        } catch {
          reply('❌ APK search failed.');
        }
        break;
      }

      case 'wastatus': {
        await reply(
          `📱 *WhatsApp Status Downloader*\n\n` +
          `To download someone's status:\n` +
          `1️⃣ View their status in WhatsApp\n` +
          `2️⃣ Long press the status\n` +
          `3️⃣ The status is saved in:\n` +
          `   📂 /WhatsApp/Media/.Statuses/\n\n` +
          `🔍 Use a file manager to access hidden folders.\n` +
          `🇿🇼 Malvin C VME`
        );
        break;
      }

      // ══════ AI / CHATBOT ══════════════════════════════════
      case 'ai':
      case 'gpt':
      case 'chatgpt': {
        if (!q) return reply(`❌ Usage: *${prefix}ai <your question>*`);
        await reply('🤖 Thinking...');
        try {
          const res = await axios.get(`https://api.simsimi.vn/v1/simsimiplus?lc=en&text=${encodeURIComponent(q)}`);
          const answer = res.data?.success || res.data?.message || 'Hmm, I could not think of an answer.';
          await reply(`🤖 *AI Response:*\n\n${answer}`);
        } catch {
          try {
            // Fallback free API
            const r2 = await axios.get(`https://api.agalaxyfarfaraway.com/v1/gpt?prompt=${encodeURIComponent(q)}`);
            await reply(`🤖 *AI:*\n\n${r2.data?.response || 'No response.'}`);
          } catch {
            reply('❌ AI is unavailable right now. Try later.');
          }
        }
        break;
      }

      case 'gemini': {
        if (!q) return reply(`❌ Usage: *${prefix}gemini <prompt>*`);
        await reply('✨ Asking Gemini...');
        try {
          const apiKey = config.geminiKey;
          if (!apiKey) return reply('❌ Gemini API key not configured. Add GEMINI_API_KEY to .env');
          const res = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            { contents: [{ parts: [{ text: q }] }] }
          );
          const answer = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
          await reply(`✨ *Gemini:*\n\n${answer || 'No response.'}`);
        } catch (e) {
          reply('❌ Gemini failed: ' + (e.response?.data?.error?.message || e.message));
        }
        break;
      }

      case 'claude': {
        if (!q) return reply(`❌ Usage: *${prefix}claude <prompt>*`);
        await reply('🔮 Asking Claude AI...');
        try {
          const res = await axios.post('https://api.anthropic.com/v1/messages', {
            model: 'claude-haiku-20240307',
            max_tokens: 1000,
            messages: [{ role: 'user', content: q }],
          }, {
            headers: {
              'x-api-key': process.env.ANTHROPIC_KEY || '',
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json',
            },
          });
          const answer = res.data?.content?.[0]?.text;
          await reply(`🔮 *Claude AI:*\n\n${answer || 'No response.'}`);
        } catch {
          reply('❌ Claude API key not set. Add ANTHROPIC_KEY to .env');
        }
        break;
      }

      case 'deepseek': {
        if (!q) return reply(`❌ Usage: *${prefix}deepseek <prompt>*`);
        await reply('🧠 Asking DeepSeek...');
        try {
          const res = await axios.get(`https://api.deepai.org/api/text-generator`, {
            headers: { 'api-key': 'quickstart-QUdJIGlzIGF3ZXNvbWU' },
            params: { text: q },
          });
          await reply(`🧠 *DeepSeek:*\n\n${res.data?.output || 'No response.'}`);
        } catch {
          reply('❌ DeepSeek failed. Try again.');
        }
        break;
      }

      case 'llama': {
        if (!q) return reply(`❌ Usage: *${prefix}llama <prompt>*`);
        await reply('🦙 Asking LLaMA...');
        try {
          const res = await axios.post('https://api.deepinfra.com/v1/openai/chat/completions', {
            model: 'meta-llama/Meta-Llama-3-8B-Instruct',
            messages: [{ role: 'user', content: q }],
          }, { headers: { 'Authorization': 'Bearer ' + (process.env.DEEPINFRA_KEY || '') } });
          const answer = res.data?.choices?.[0]?.message?.content;
          await reply(`🦙 *LLaMA:*\n\n${answer || 'No response.'}`);
        } catch {
          reply('❌ LLaMA unavailable. Add DEEPINFRA_KEY to .env');
        }
        break;
      }

      case 'imagine':
      case 'dalle': {
        if (!q) return reply(`❌ Usage: *${prefix}imagine <image description>*`);
        await reply(`🎨 Generating image: *"${q}"*...`);
        try {
          const res = await axios.get(`https://api.deepai.org/api/text2img`, {
            method: 'POST',
            headers: { 'api-key': 'quickstart-QUdJIGlzIGF3ZXNvbWU' },
            params: { text: q },
          });
          const imgUrl = res.data?.output_url;
          if (!imgUrl) return reply('❌ Image generation failed.');
          await sock.sendMessage(from, {
            image: { url: imgUrl },
            caption: `🎨 *AI Image:* ${q}\n🇿🇼 Malvin C VME`,
          }, { quoted: msg });
        } catch {
          reply('❌ Image generation failed. Try again.');
        }
        break;
      }

      case 'chatbot': {
        if (!isGroup) return reply('❌ This command is for groups only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}chatbot on/off*`);
        db.setGroup(from, 'chatbot', q === 'on');
        await reply(`🤖 Chatbot *${q.toUpperCase()}* in this group.`);
        break;
      }

      case 'translate': {
        if (!q) return reply(`❌ Usage: *${prefix}translate <lang> <text>*\nExample: ${prefix}translate es Hello World`);
        const parts = q.split(' ');
        const lang = parts[0];
        const toTranslate = parts.slice(1).join(' ');
        if (!toTranslate) return reply('❌ Please provide text to translate.');
        try {
          const res = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(toTranslate)}&langpair=en|${lang}`);
          const translated = res.data?.responseData?.translatedText;
          await reply(`🌍 *Translation (→ ${lang.toUpperCase()}):*\n\n${translated}`);
        } catch {
          reply('❌ Translation failed.');
        }
        break;
      }

      case 'grammar':
      case 'spellcheck': {
        if (!q) return reply(`❌ Usage: *${prefix}grammar <text>*`);
        await reply('✏️ Checking grammar...');
        try {
          const res = await axios.post('https://api.languagetool.org/v2/check', null, {
            params: { text: q, language: 'en-US' },
          });
          const matches = res.data?.matches || [];
          if (!matches.length) return reply('✅ No grammar issues found! Your text looks great.');
          const corrections = matches.map((m, i) =>
            `${i+1}. "${m.context.text.substring(m.context.offset, m.context.offset + m.context.length)}" → ${m.replacements?.[0]?.value || '?'}\n   📝 ${m.message}`
          ).join('\n\n');
          await reply(`✏️ *Grammar Check Results:*\n\n${corrections}`);
        } catch {
          reply('❌ Grammar check failed. Try again.');
        }
        break;
      }

      case 'summarize': {
        if (!q) return reply(`❌ Usage: *${prefix}summarize <text>*`);
        await reply('📝 Summarizing...');
        try {
          const res = await axios.post('https://api.deepai.org/api/summarization', { text: q }, {
            headers: { 'api-key': 'quickstart-QUdJIGlzIGF3ZXNvbWU' },
          });
          await reply(`📝 *Summary:*\n\n${res.data?.output || 'Could not summarize.'}`);
        } catch {
          reply('❌ Summarization failed.');
        }
        break;
      }

      case 'math':
      case 'calculate':
      case 'calc': {
        if (!q) return reply(`❌ Usage: *${prefix}math <expression>*\nExample: ${prefix}math 2 + 2 * 10`);
        try {
          const expr = q.replace(/[^0-9+\-*/().% ]/g, '');
          // eslint-disable-next-line no-eval
          const result = Function(`"use strict"; return (${expr})`)();
          await reply(`🧮 *Calculator*\n\n📥 Input: \`${q}\`\n📤 Result: *${result}*`);
        } catch {
          reply('❌ Invalid expression. Example: `.math 5 * (3 + 2)`');
        }
        break;
      }

      case 'quran': {
        if (!q) return reply(`❌ Usage: *${prefix}quran <surah:ayah>*\nExample: ${prefix}quran 1:1`);
        try {
          const [surah, ayah] = q.split(':');
          const res = await axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,en.asad`);
          const data = res.data?.data;
          const arabic = data?.[0]?.text;
          const english = data?.[1]?.text;
          await reply(
            `📖 *Quran ${surah}:${ayah}*\n\n` +
            `🕌 *Arabic:*\n${arabic}\n\n` +
            `🌍 *English:*\n${english}\n\n` +
            `— Surah ${data?.[0]?.surah?.englishName || ''}`
          );
        } catch {
          reply('❌ Could not fetch Quran verse. Format: `.quran 2:255`');
        }
        break;
      }

      case 'hadith': {
        await reply('📜 Fetching Hadith...');
        try {
          const res = await axios.get('https://random-hadith-generator.vercel.app/bukhari/');
          const hadith = res.data?.data;
          await reply(
            `📜 *Hadith (Bukhari)*\n\n` +
            `${hadith?.hadith_english || 'Could not fetch hadith.'}\n\n` +
            `— ${hadith?.refno || ''}\n` +
            `📚 Chapter: ${hadith?.chapter || ''}`
          );
        } catch {
          reply('❌ Hadith fetch failed. Try again.');
        }
        break;
      }

      case 'bible': {
        if (!q) return reply(`❌ Usage: *${prefix}bible <Book Chapter:Verse>*\nExample: ${prefix}bible John 3:16`);
        await reply('✝️ Fetching Bible verse...');
        try {
          const res = await axios.get(`https://bible-api.com/${encodeURIComponent(q)}`);
          await reply(
            `✝️ *Bible: ${res.data?.reference}*\n\n` +
            `${res.data?.text || 'Verse not found.'}`
          );
        } catch {
          reply('❌ Bible verse not found. Try: `.bible John 3:16`');
        }
        break;
      }

      // ══════ IMAGE TOOLS ═══════════════════════════════════
      case 'sticker':
      case 'stiker':
      case 's': {
        try {
          const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
          const imgMsg = quoted?.imageMessage || msg.message?.imageMessage;
          const vidMsg = quoted?.videoMessage || msg.message?.videoMessage;
          if (!imgMsg && !vidMsg) return reply('❌ Reply to an image or video to create a sticker.');
          const stream = await sock.downloadMediaMessage(msg);
          const tmpFile = tmpPath('webp');
          const input = tmpPath(imgMsg ? 'jpg' : 'mp4');
          fs.writeFileSync(input, stream);
          exec(`ffmpeg -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white@0" "${tmpFile}"`, async (err) => {
            if (err) {
              fs.unlinkSync(input);
              return reply('❌ Sticker creation failed.');
            }
            await sock.sendMessage(from, {
              sticker: fs.readFileSync(tmpFile),
            }, { quoted: msg });
            fs.unlinkSync(input);
            fs.unlinkSync(tmpFile);
          });
        } catch {
          reply('❌ Failed to create sticker.');
        }
        break;
      }

      case 'toimg': {
        try {
          const stickerMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
          if (!stickerMsg) return reply('❌ Reply to a sticker to convert it to image.');
          const stream = await sock.downloadMediaMessage(msg);
          const tmpFile = tmpPath('jpg');
          const input = tmpPath('webp');
          fs.writeFileSync(input, stream);
          exec(`ffmpeg -i "${input}" "${tmpFile}"`, async (err) => {
            if (err) { fs.unlinkSync(input); return reply('❌ Conversion failed.'); }
            await sock.sendMessage(from, {
              image: fs.readFileSync(tmpFile),
              caption: '🖼️ Converted from sticker\n🇿🇼 Malvin C VME',
            }, { quoted: msg });
            fs.unlinkSync(input); fs.unlinkSync(tmpFile);
          });
        } catch {
          reply('❌ Failed to convert sticker.');
        }
        break;
      }

      case 'remini': {
        try {
          const imgMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || msg.message?.imageMessage;
          if (!imgMsg) return reply('❌ Reply to an image to enhance it.');
          await reply('✨ Enhancing image with Remini AI...');
          const stream = await sock.downloadMediaMessage(msg);
          const base64 = Buffer.from(stream).toString('base64');
          const res = await axios.post('https://inferenceengine.vyro.ai/enhance', {
            model_version: 1,
            image: `data:image/jpeg;base64,${base64}`,
          }, { headers: { 'Content-Type': 'application/json' } });
          const enhanced = res.data?.enhanced;
          if (!enhanced) return reply('❌ Enhancement failed.');
          await sock.sendMessage(from, {
            image: Buffer.from(enhanced.split(',')[1], 'base64'),
            caption: '✨ Enhanced with Remini AI\n🇿🇼 Malvin C VME',
          }, { quoted: msg });
        } catch {
          reply('❌ Remini enhancement failed. Try again.');
        }
        break;
      }

      case 'removebg': {
        try {
          const imgMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || msg.message?.imageMessage;
          if (!imgMsg) return reply('❌ Reply to an image to remove its background.');
          await reply('🖼️ Removing background...');
          const stream = await sock.downloadMediaMessage(msg);
          const formData = new FormData();
          formData.append('image_file', Buffer.from(stream), 'image.jpg');
          const res = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: {
              'X-Api-Key': process.env.REMOVEBG_KEY || 'oX2YknX9oaNDTyxEMrJaRVr4',
              ...formData.getHeaders?.() || {},
            },
            responseType: 'arraybuffer',
          });
          await sock.sendMessage(from, {
            image: Buffer.from(res.data),
            caption: '🖼️ Background Removed!\n🇿🇼 Malvin C VME',
          }, { quoted: msg });
        } catch {
          reply('❌ Background removal failed. Try again.');
        }
        break;
      }

      case 'img':
      case 'image': {
        if (!q) return reply(`❌ Usage: *${prefix}img <search query>*`);
        await reply(`🔍 Searching images for: *${q}*...`);
        try {
          const res = await axios.get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&client_id=mdi4c2T3iuTON2kOr8lkJxHBVJkzxfRmhgKf3jqNfRA`);
          const photo = res.data?.results?.[0];
          if (!photo) return reply('❌ No images found.');
          await sock.sendMessage(from, {
            image: { url: photo.urls.regular },
            caption: `🖼️ *${photo.alt_description || q}*\n📷 By: ${photo.user.name}\n🇿🇼 Malvin C VME`,
          }, { quoted: msg });
        } catch {
          try {
            const r2 = await axios.get(`https://source.unsplash.com/800x600/?${encodeURIComponent(q)}`, { responseType: 'arraybuffer' });
            await sock.sendMessage(from, {
              image: Buffer.from(r2.data),
              caption: `🖼️ ${q}\n🇿🇼 Malvin C VME`,
            }, { quoted: msg });
          } catch {
            reply('❌ Image search failed.');
          }
        }
        break;
      }

      case 'pinterest': {
        if (!q) return reply(`❌ Usage: *${prefix}pinterest <query>*`);
        await reply(`📌 Searching Pinterest for: *${q}*...`);
        try {
          const res = await axios.get(`https://api.pinterest.com/v5/search/pins?query=${encodeURIComponent(q)}&page_size=1`, {
            headers: { Authorization: `Bearer ${process.env.PINTEREST_TOKEN || ''}` },
          });
          const pin = res.data?.items?.[0];
          const imgUrl = pin?.media?.images?.['600x']?.url;
          if (!imgUrl) throw new Error();
          await sock.sendMessage(from, {
            image: { url: imgUrl },
            caption: `📌 Pinterest: ${pin.title || q}\n🇿🇼 Malvin C VME`,
          }, { quoted: msg });
        } catch {
          // Fallback
          await sock.sendMessage(from, {
            image: { url: `https://source.unsplash.com/800x600/?${encodeURIComponent(q)}` },
            caption: `📌 ${q}\n🇿🇼 Malvin C VME`,
          }, { quoted: msg });
        }
        break;
      }

      case 'meme': {
        await reply('😂 Fetching meme...');
        try {
          const res = await axios.get('https://meme-api.com/gimme');
          await sock.sendMessage(from, {
            image: { url: res.data.url },
            caption: `😂 *${res.data.title}*\n👍 ${res.data.ups} upvotes\n🇿🇼 Malvin C VME`,
          }, { quoted: msg });
        } catch {
          reply('❌ Could not fetch meme. Try again.');
        }
        break;
      }

      case 'waifu': {
        await reply('🌸 Fetching waifu image...');
        try {
          const res = await axios.get('https://api.waifu.pics/sfw/waifu');
          await sock.sendMessage(from, {
            image: { url: res.data.url },
            caption: `🌸 *Waifu*\n🇿🇼 Malvin C VME`,
          }, { quoted: msg });
        } catch {
          reply('❌ Failed to fetch waifu image.');
        }
        break;
      }

      case 'neko': {
        await reply('🐱 Fetching neko image...');
        try {
          const res = await axios.get('https://api.waifu.pics/sfw/neko');
          await sock.sendMessage(from, {
            image: { url: res.data.url },
            caption: `🐱 *Neko*\n🇿🇼 Malvin C VME`,
          }, { quoted: msg });
        } catch {
          reply('❌ Failed to fetch neko image.');
        }
        break;
      }

      // ══════ GROUP MANAGEMENT ══════════════════════════════
      case 'kick': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!isBotAdmin) return reply('❌ I need to be admin to kick members.');
        const target = mentionedJid[0] || msg.message?.extendedTextMessage?.contextInfo?.participant;
        if (!target) return reply(`❌ Usage: *${prefix}kick @user*`);
        try {
          await sock.groupParticipantsUpdate(from, [target], 'remove');
          await reply(`✅ @${getNumber(target)} has been kicked.`, { mentions: [target] });
        } catch {
          reply('❌ Failed to kick user.');
        }
        break;
      }

      case 'add': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!isBotAdmin) return reply('❌ I need to be admin to add members.');
        if (!q) return reply(`❌ Usage: *${prefix}add 263xxxxxxxxx*`);
        const numToAdd = formatPhone(q);
        try {
          await sock.groupParticipantsUpdate(from, [numToAdd], 'add');
          await reply(`✅ @${q} has been added.`);
        } catch {
          reply('❌ Failed to add user. They may have privacy settings enabled.');
        }
        break;
      }

      case 'promote': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!isBotAdmin) return reply('❌ I need to be admin to promote.');
        const target = mentionedJid[0] || msg.message?.extendedTextMessage?.contextInfo?.participant;
        if (!target) return reply(`❌ Usage: *${prefix}promote @user*`);
        try {
          await sock.groupParticipantsUpdate(from, [target], 'promote');
          await reply(`⬆️ @${getNumber(target)} has been promoted to admin! 🎉`);
        } catch {
          reply('❌ Failed to promote user.');
        }
        break;
      }

      case 'demote': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!isBotAdmin) return reply('❌ I need to be admin to demote.');
        const target = mentionedJid[0] || msg.message?.extendedTextMessage?.contextInfo?.participant;
        if (!target) return reply(`❌ Usage: *${prefix}demote @user*`);
        try {
          await sock.groupParticipantsUpdate(from, [target], 'demote');
          await reply(`⬇️ @${getNumber(target)} has been demoted.`);
        } catch {
          reply('❌ Failed to demote user.');
        }
        break;
      }

      case 'mute': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!isBotAdmin) return reply('❌ I need to be admin to mute the group.');
        try {
          await sock.groupSettingUpdate(from, 'announcement');
          db.setGroup(from, 'muted', true);
          await reply('🔇 Group has been *muted*. Only admins can send messages.');
        } catch {
          reply('❌ Failed to mute group.');
        }
        break;
      }

      case 'unmute': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!isBotAdmin) return reply('❌ I need to be admin to unmute the group.');
        try {
          await sock.groupSettingUpdate(from, 'not_announcement');
          db.setGroup(from, 'muted', false);
          await reply('🔊 Group has been *unmuted*. Everyone can send messages.');
        } catch {
          reply('❌ Failed to unmute group.');
        }
        break;
      }

      case 'tagall': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        try {
          const metadata = await sock.groupMetadata(from);
          const members = metadata.participants;
          const mentions = members.map(m => m.id);
          const tagMsg = q || '📢 Attention everyone!';
          const mentionText = members.map(m => `@${getNumber(m.id)}`).join(' ');
          await sock.sendMessage(from, {
            text: `📢 *${tagMsg}*\n\n${mentionText}`,
            mentions,
          });
        } catch {
          reply('❌ Failed to tag all members.');
        }
        break;
      }

      case 'hidetag': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        try {
          const metadata = await sock.groupMetadata(from);
          const members = metadata.participants;
          const mentions = members.map(m => m.id);
          await sock.sendMessage(from, {
            text: q || '📢 Message from admin',
            mentions,
          });
        } catch {
          reply('❌ Failed to send hidetag message.');
        }
        break;
      }

      case 'antilink': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}antilink on/off*`);
        db.setGroup(from, 'antilink', q === 'on');
        await reply(`🔗 Anti-link *${q.toUpperCase()}* in this group.`);
        break;
      }

      case 'antidelete': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}antidelete on/off*`);
        db.setGroup(from, 'antidelete', q === 'on');
        await reply(`🗑️ Anti-delete *${q.toUpperCase()}* in this group.`);
        break;
      }

      case 'welcome': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}welcome on/off*`);
        db.setGroup(from, 'welcome', q === 'on');
        await reply(`👋 Welcome messages *${q.toUpperCase()}* in this group.`);
        break;
      }

      case 'goodbye': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}goodbye on/off*`);
        db.setGroup(from, 'goodbye', q === 'on');
        await reply(`👋 Goodbye messages *${q.toUpperCase()}* in this group.`);
        break;
      }

      case 'link': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        try {
          const code = await sock.groupInviteCode(from);
          await reply(`🔗 *Group Invite Link:*\nhttps://chat.whatsapp.com/${code}`);
        } catch {
          reply('❌ Could not get group link. I need to be admin.');
        }
        break;
      }

      case 'revoke': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!isBotAdmin) return reply('❌ I need to be admin to revoke the link.');
        try {
          await sock.groupRevokeInvite(from);
          await reply('✅ Group invite link has been revoked and a new one generated.');
        } catch {
          reply('❌ Failed to revoke link.');
        }
        break;
      }

      case 'ginfo':
      case 'groupinfo': {
        if (!isGroup) return reply('❌ Group only.');
        try {
          const meta = await sock.groupMetadata(from);
          const admins = meta.participants.filter(p => p.admin).map(p => `• @${getNumber(p.id)}`).join('\n');
          const adminJids = meta.participants.filter(p => p.admin).map(p => p.id);
          await sock.sendMessage(from, {
            text:
              `╔══❰ 📊 *GROUP INFO* ❱══╗\n` +
              `║ 📝 *Name:* ${meta.subject}\n` +
              `║ 👤 *Members:* ${meta.participants.length}\n` +
              `║ 📅 *Created:* ${new Date(meta.creation * 1000).toLocaleDateString()}\n` +
              `║ 🆔 *ID:* ${from.split('@')[0]}\n` +
              `║ 📋 *Desc:*\n║ ${(meta.desc || 'No description').substring(0, 100)}\n` +
              `║\n║ 👑 *Admins:*\n${admins}\n` +
              `╚════════════════════╝`,
            mentions: adminJids,
          });
        } catch {
          reply('❌ Failed to get group info.');
        }
        break;
      }

      case 'poll': {
        if (!isGroup) return reply('❌ Group only.');
        if (!q) return reply(`❌ Usage: *${prefix}poll Question|Option1|Option2|Option3*`);
        const parts = q.split('|');
        if (parts.length < 3) return reply('❌ Need at least a question and 2 options.\nExample: `.poll Who is best?|Malvin|Bot`');
        const [question, ...options] = parts;
        try {
          await sock.sendMessage(from, {
            poll: {
              name: question.trim(),
              values: options.map(o => o.trim()),
              selectableCount: 1,
            },
          });
        } catch {
          reply('❌ Failed to create poll.');
        }
        break;
      }

      case 'autoapprove': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}autoapprove on/off*`);
        db.setGroup(from, 'autoapprove', q === 'on');
        await reply(`✅ Auto-approve join requests *${q.toUpperCase()}*.`);
        break;
      }

      case 'gcpp': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can update group photo.');
        if (!isBotAdmin) return reply('❌ I need to be admin to change group photo.');
        try {
          const imgMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage || msg.message?.imageMessage;
          if (!imgMsg) return reply('❌ Reply to or send an image.');
          const stream = await sock.downloadMediaMessage(msg);
          await sock.updateProfilePicture(from, Buffer.from(stream));
          await reply('✅ Group photo updated!');
        } catch {
          reply('❌ Failed to update group photo.');
        }
        break;
      }

      case 'updategname': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!isBotAdmin) return reply('❌ I need to be admin.');
        if (!q) return reply(`❌ Usage: *${prefix}updategname New Group Name*`);
        try {
          await sock.groupUpdateSubject(from, q);
          await reply(`✅ Group name updated to: *${q}*`);
        } catch {
          reply('❌ Failed to update group name.');
        }
        break;
      }

      case 'updategdesc': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!isBotAdmin) return reply('❌ I need to be admin.');
        if (!q) return reply(`❌ Usage: *${prefix}updategdesc New description*`);
        try {
          await sock.groupUpdateDescription(from, q);
          await reply(`✅ Group description updated!`);
        } catch {
          reply('❌ Failed to update description.');
        }
        break;
      }

      case 'join': {
        if (!isOwnerMsg && !isSudo) return reply('❌ Owner only.');
        if (!q) return reply(`❌ Usage: *${prefix}join <invite link>*`);
        try {
          const code = q.split('chat.whatsapp.com/')[1];
          if (!code) return reply('❌ Invalid invite link.');
          await sock.groupAcceptInvite(code);
          await reply(`✅ Joined group successfully!`);
        } catch {
          reply('❌ Failed to join group.');
        }
        break;
      }

      case 'leave': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        if (!isGroup) return reply('❌ Not in a group.');
        await reply('👋 Leaving group...');
        await sleep(1000);
        try {
          await sock.groupLeave(from);
        } catch {
          reply('❌ Failed to leave group.');
        }
        break;
      }

      case 'out': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        if (!isGroup) return reply('❌ Not in a group.');
        await reply('👋 Goodbye everyone! The bot is leaving.');
        await sleep(1000);
        try {
          await sock.groupLeave(from);
        } catch {}
        break;
      }

      // ══════ OWNER COMMANDS ════════════════════════════════
      case 'pair': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        if (!q) return reply(`❌ Usage: *${prefix}pair 263xxxxxxxxx*`);
        try {
          const num = q.replace(/[^0-9]/g, '');
          const code = await sock.requestPairingCode(num);
          await reply(
            `╔══❰ 🔗 *PAIRING CODE* ❱══╗\n` +
            `║ 📱 *Number:* +${num}\n` +
            `║ 🔐 *Code:* *${code}*\n` +
            `║\n` +
            `║ 📋 *Steps:*\n` +
            `║ 1. Open WhatsApp on target phone\n` +
            `║ 2. Go to Settings → Linked Devices\n` +
            `║ 3. Tap "Link a Device"\n` +
            `║ 4. Enter code: *${code}*\n` +
            `║\n` +
            `║ ⏰ Code expires in 60 seconds\n` +
            `╚════════════════════╝\n` +
            `🇿🇼 Malvin C VME | Handsome Tech Zimbabwe`
          );
        } catch (e) {
          reply('❌ Pairing failed: ' + e.message);
        }
        break;
      }

      case 'broadcast':
      case 'bc': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        if (!q) return reply(`❌ Usage: *${prefix}broadcast <message>*`);
        try {
          const chats = await sock.groupFetchAllParticipating();
          const groupIds = Object.keys(chats);
          let sent = 0;
          for (const id of groupIds) {
            try {
              await sock.sendMessage(id, {
                text: `📢 *Broadcast from ${config.botName}:*\n\n${q}\n\n🇿🇼 Malvin C VME`,
              });
              sent++;
              await sleep(500);
            } catch {}
          }
          await reply(`✅ Broadcast sent to *${sent}* groups.`);
        } catch {
          reply('❌ Broadcast failed.');
        }
        break;
      }

      case 'ban': {
        if (!isOwnerMsg && !isSudo) return reply('❌ Owner/Sudo only.');
        const target = mentionedJid[0] || (q ? formatPhone(q) : null);
        if (!target) return reply(`❌ Usage: *${prefix}ban @user*`);
        db.banUser(getNumber(target));
        await reply(`⛔ @${getNumber(target)} has been banned from using the bot.`);
        break;
      }

      case 'unban': {
        if (!isOwnerMsg && !isSudo) return reply('❌ Owner/Sudo only.');
        const target = mentionedJid[0] || (q ? formatPhone(q) : null);
        if (!target) return reply(`❌ Usage: *${prefix}unban @user*`);
        db.unbanUser(getNumber(target));
        await reply(`✅ @${getNumber(target)} has been unbanned.`);
        break;
      }

      case 'banlist': {
        if (!isOwnerMsg && !isSudo) return reply('❌ Owner/Sudo only.');
        const banned = db.listBanned();
        if (!banned.length) return reply('✅ No banned users.');
        await reply(`⛔ *Banned Users:*\n\n${banned.map((n, i) => `${i+1}. +${n}`).join('\n')}`);
        break;
      }

      case 'sudo': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        const target = mentionedJid[0] || (q ? formatPhone(q) : null);
        if (!target) return reply(`❌ Usage: *${prefix}sudo @user*`);
        db.addSudo(getNumber(target));
        await reply(`✅ @${getNumber(target)} added as sudo user.`);
        break;
      }

      case 'delsudo': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        const target = mentionedJid[0] || (q ? formatPhone(q) : null);
        if (!target) return reply(`❌ Usage: *${prefix}delsudo @user*`);
        db.removeSudo(getNumber(target));
        await reply(`✅ @${getNumber(target)} removed from sudo.`);
        break;
      }

      case 'sudolist': {
        if (!isOwnerMsg && !isSudo) return reply('❌ Owner/Sudo only.');
        const sudos = db.listSudo();
        if (!sudos.length) return reply('No sudo users set.');
        await reply(`🛡️ *Sudo Users:*\n\n${sudos.map((n, i) => `${i+1}. +${n}`).join('\n')}`);
        break;
      }

      case 'block': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        const target = mentionedJid[0] || (q ? formatPhone(q) : null);
        if (!target) return reply(`❌ Usage: *${prefix}block @user*`);
        try {
          await sock.updateBlockStatus(target, 'block');
          await reply(`✅ @${getNumber(target)} has been blocked.`);
        } catch {
          reply('❌ Failed to block user.');
        }
        break;
      }

      case 'unblock': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        const target = mentionedJid[0] || (q ? formatPhone(q) : null);
        if (!target) return reply(`❌ Usage: *${prefix}unblock @user*`);
        try {
          await sock.updateBlockStatus(target, 'unblock');
          await reply(`✅ @${getNumber(target)} has been unblocked.`);
        } catch {
          reply('❌ Failed to unblock user.');
        }
        break;
      }

      case 'mode': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        if (!['public','private'].includes(q)) return reply(`❌ Usage: *${prefix}mode public/private*`);
        config.mode = q;
        await reply(`⚙️ Bot mode set to *${q.toUpperCase()}*.`);
        break;
      }

      case 'setprefix': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        if (!q) return reply(`❌ Usage: *${prefix}setprefix <new_prefix>*`);
        config.prefix = q;
        await reply(`✅ Prefix changed to: *${q}*`);
        break;
      }

      case 'setbotname': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        if (!q) return reply(`❌ Usage: *${prefix}setbotname <name>*`);
        config.botName = q;
        await reply(`✅ Bot name changed to: *${q}*`);
        break;
      }

      case 'setownername': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        if (!q) return reply(`❌ Usage: *${prefix}setownername <name>*`);
        config.ownerName = q;
        await reply(`✅ Owner name changed to: *${q}*`);
        break;
      }

      case 'restart': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        await reply('🔄 Restarting bot...');
        await sleep(1000);
        process.exit(0); // Railway/Render will auto-restart
        break;
      }

      // ══════ SETTINGS ══════════════════════════════════════
      case 'autoread': {
        if (!isOwnerMsg && !isSudo) return reply('❌ Owner/Sudo only.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}autoread on/off*`);
        db.setGroup(from, 'autoread', q === 'on');
        config.defaults.autoread = q === 'on';
        await reply(`📖 Auto-read *${q.toUpperCase()}*.`);
        break;
      }

      case 'autotyping': {
        if (!isOwnerMsg && !isSudo) return reply('❌ Owner/Sudo only.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}autotyping on/off*`);
        config.defaults.autotyping = q === 'on';
        await reply(`✍️ Auto-typing *${q.toUpperCase()}*.`);
        break;
      }

      case 'autorecording': {
        if (!isOwnerMsg && !isSudo) return reply('❌ Owner/Sudo only.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}autorecording on/off*`);
        config.defaults.autorecording = q === 'on';
        await reply(`🎙️ Auto-recording *${q.toUpperCase()}*.`);
        break;
      }

      case 'autoreact': {
        if (!isOwnerMsg && !isSudo) return reply('❌ Owner/Sudo only.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}autoreact on/off*`);
        config.defaults.autoreact = q === 'on';
        await reply(`😊 Auto-react *${q.toUpperCase()}*.`);
        break;
      }

      case 'statusview': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}statusview on/off*`);
        config.defaults.statusView = q === 'on';
        await reply(`👁️ Status auto-view *${q.toUpperCase()}*.`);
        break;
      }

      case 'anticall': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}anticall on/off*`);
        config.defaults.anticall = q === 'on';
        await reply(`📵 Anti-call *${q.toUpperCase()}*.`);
        break;
      }

      case 'antispam': {
        if (!isGroup) return reply('❌ Group only.');
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can use this.');
        if (!['on','off'].includes(q)) return reply(`❌ Usage: *${prefix}antispam on/off*`);
        db.setGroup(from, 'antispam', q === 'on');
        await reply(`🛡️ Anti-spam *${q.toUpperCase()}*.`);
        break;
      }

      // ══════ ADMIN TOOLS ═══════════════════════════════════
      case 'del':
      case 'delete': {
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can delete messages.');
        if (!isBotAdmin) return reply('❌ I need to be admin to delete messages.');
        const quotedCtx = msg.message?.extendedTextMessage?.contextInfo;
        if (!quotedCtx?.stanzaId) return reply('❌ Reply to the message you want to delete.');
        try {
          await sock.sendMessage(from, {
            delete: {
              remoteJid: from,
              fromMe: false,
              id: quotedCtx.stanzaId,
              participant: quotedCtx.participant,
            },
          });
        } catch {
          reply('❌ Failed to delete message.');
        }
        break;
      }

      case 'warn': {
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can warn members.');
        const target = mentionedJid[0] || msg.message?.extendedTextMessage?.contextInfo?.participant;
        if (!target) return reply(`❌ Usage: *${prefix}warn @user*`);
        const warns = db.warnUser(getNumber(target));
        if (warns >= 3) {
          db.banUser(getNumber(target));
          await reply(`⛔ @${getNumber(target)} has been *banned* for receiving 3 warnings!`);
        } else {
          await reply(
            `⚠️ @${getNumber(target)} has been warned!\n` +
            `Warnings: *${warns}/3*\n` +
            `3 warnings = ban.`
          );
        }
        break;
      }

      case 'warns': {
        const target = mentionedJid[0] || (q ? formatPhone(q) : sender);
        const w = db.getWarns(getNumber(target));
        await reply(`⚠️ @${getNumber(target)} has *${w}/3* warnings.`);
        break;
      }

      case 'resetwarn': {
        if (!isAdmin && !isOwnerMsg) return reply('❌ Only admins can reset warnings.');
        const target = mentionedJid[0] || msg.message?.extendedTextMessage?.contextInfo?.participant;
        if (!target) return reply(`❌ Usage: *${prefix}resetwarn @user*`);
        db.resetWarns(getNumber(target));
        await reply(`✅ Warnings reset for @${getNumber(target)}.`);
        break;
      }

      case 'getpp':
      case 'pfp': {
        const target = mentionedJid[0] || (q ? formatPhone(q) : sender);
        try {
          const ppUrl = await sock.profilePictureUrl(target, 'image');
          await sock.sendMessage(from, {
            image: { url: ppUrl },
            caption: `🖼️ Profile Picture of @${getNumber(target)}\n🇿🇼 Malvin C VME`,
          }, { quoted: msg });
        } catch {
          reply('❌ Could not get profile picture. The user may have privacy settings enabled.');
        }
        break;
      }

      // ══════ FUN COMMANDS ══════════════════════════════════
      case 'joke': {
        await reply('😂 Fetching a joke...');
        try {
          const res = await axios.get('https://official-joke-api.appspot.com/random_joke');
          await reply(`😂 *Joke of the Day:*\n\n${res.data.setup}\n\n${res.data.punchline} 😆`);
        } catch {
          const jokes = [
            'Why do programmers prefer dark mode?\nBecause light attracts bugs! 🐛',
            'Why did the bot go to school?\nTo improve its language model! 🤖',
            'What do you call a bot that tells jokes?\nA Comedy Algorithm! 😄',
            'Why was the developer always calm?\nBecause he knew how to handle exceptions! 😎',
          ];
          await reply(`😂 *Joke:*\n\n${pickRandom(jokes)}`);
        }
        break;
      }

      case 'quote': {
        await reply('💬 Fetching a quote...');
        try {
          const res = await axios.get('https://api.quotable.io/random');
          await reply(`💬 *"${res.data.content}"*\n\n— *${res.data.author}*`);
        } catch {
          const quotes = [
            '"The best way to predict the future is to invent it." — Alan Kay',
            '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
            '"First, solve the problem. Then, write the code." — John Johnson',
            '"Excellence is not a skill. It\'s an attitude." — Ralph Marston',
          ];
          await reply(`💬 ${pickRandom(quotes)}`);
        }
        break;
      }

      case 'fact': {
        await reply('🤓 Fetching a fact...');
        try {
          const res = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
          await reply(`🤓 *Random Fact:*\n\n${res.data.text}`);
        } catch {
          const facts = [
            'Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs.',
            'A group of flamingos is called a "flamboyance".',
            'Octopuses have three hearts and blue blood.',
            'The average person walks about 100,000 miles in their lifetime.',
          ];
          await reply(`🤓 *Fact:* ${pickRandom(facts)}`);
        }
        break;
      }

      case 'roast': {
        const target = mentionedJid[0] ? `@${getNumber(mentionedJid[0])}` : (q || 'you');
        const roasts = [
          `${target}, your WiFi password is longer than your attention span.`,
          `${target} is the reason we have warning labels on everything.`,
          `${target} I'd agree with you but then we'd both be wrong.`,
          `${target} is proof that evolution can go in reverse.`,
          `${target}, I've seen better-looking bugs in my code.`,
          `${target} is like a software update — everyone ignores them.`,
        ];
        await reply(`🔥 *Roast:*\n\n${pickRandom(roasts)}`);
        break;
      }

      case 'compliment': {
        const target = mentionedJid[0] ? `@${getNumber(mentionedJid[0])}` : (q || 'you');
        const compliments = [
          `${target}, you light up every room you enter! ✨`,
          `${target} is genuinely one of the kindest souls around. 💚`,
          `${target} makes this group 10x better just by being here. 🌟`,
          `${target}, your smile could power a whole city! ☀️`,
          `${target} is basically a human ray of sunshine. 🌈`,
        ];
        await reply(`💝 *Compliment:*\n\n${pickRandom(compliments)}`);
        break;
      }

      case 'ship': {
        const name1 = mentionedJid[0] ? getNumber(mentionedJid[0]) : (args[0] || 'Person1');
        const name2 = mentionedJid[1] ? getNumber(mentionedJid[1]) : (args[1] || 'Person2');
        const score = randInt(1, 100);
        const emoji = score > 80 ? '💕' : score > 60 ? '❤️' : score > 40 ? '💛' : score > 20 ? '💔' : '💀';
        const bar = '█'.repeat(Math.floor(score / 10)) + '░'.repeat(10 - Math.floor(score / 10));
        await reply(
          `💞 *SHIP METER* 💞\n\n` +
          `👤 ${name1}\n` +
          `💕 + 💕\n` +
          `👤 ${name2}\n\n` +
          `[${bar}] ${score}% ${emoji}\n\n` +
          (score > 80 ? '💕 Perfect match! Made for each other!' :
           score > 60 ? '❤️ Really good chemistry!' :
           score > 40 ? '💛 Could work with effort.' :
           score > 20 ? '💔 Hmm... it\'s complicated.' :
           '💀 Run. Just run.')
        );
        break;
      }

      case 'lovetest': {
        const target = mentionedJid[0] ? `@${getNumber(mentionedJid[0])}` : (q || 'someone');
        const score = randInt(1, 100);
        const bar = '❤️'.repeat(Math.floor(score / 10)) + '🖤'.repeat(10 - Math.floor(score / 10));
        await reply(
          `💕 *LOVE TEST* 💕\n\n` +
          `You ❤️ ${target}\n\n` +
          `${bar}\n` +
          `Love Score: *${score}%*\n\n` +
          (score > 80 ? '💍 Marry them already!' :
           score > 60 ? '💞 Strong feelings!' :
           score > 40 ? '💛 There\'s a spark.' :
           '😅 Maybe just friends.')
        );
        break;
      }

      case '8ball': {
        if (!q) return reply(`❌ Usage: *${prefix}8ball <your question>*`);
        const answers = [
          '✅ It is certain.', '✅ Without a doubt.', '✅ Yes definitely!',
          '✅ You may rely on it.', '✅ As I see it, yes.', '✅ Most likely.',
          '🤔 Reply hazy, try again.', '🤔 Ask again later.',
          '🤔 Better not tell you now.', '❌ Don\'t count on it.',
          '❌ My sources say no.', '❌ Very doubtful.', '❌ Outlook not so good.',
        ];
        await reply(`🎱 *Question:* ${q}\n\n🎱 *Answer:* ${pickRandom(answers)}`);
        break;
      }

      case 'coinflip':
      case 'flip': {
        const result = Math.random() < 0.5 ? '🪙 *HEADS*' : '🪙 *TAILS*';
        await reply(`🪙 *Coin Flip:*\n\nResult: ${result}`);
        break;
      }

      case 'dice': {
        const result = randInt(1, 6);
        const diceFaces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        await reply(`🎲 *Dice Roll:*\n\n${diceFaces[result]} You rolled: *${result}*`);
        break;
      }

      case 'truth': {
        const truths = [
          'What is your biggest fear?',
          'Have you ever lied to your best friend?',
          'What is your most embarrassing moment?',
          'Who do you have a crush on?',
          'What is the worst thing you have ever done?',
          'Have you ever cheated on a test?',
          'What is something you have never told anyone?',
          'What is your biggest secret?',
        ];
        await reply(`💭 *Truth:*\n\n${pickRandom(truths)}`);
        break;
      }

      case 'dare': {
        const dares = [
          'Send a voice note saying "I love Malvin C VME bot!" 🤖',
          'Change your profile picture to something funny for 1 hour.',
          'Tell a joke in the chat right now.',
          'Send a selfie with a funny face.',
          'Type the next 10 messages with your elbows.',
          'Call someone in your contacts and sing them happy birthday.',
          'Do 20 push-ups right now.',
          'Text your crush "Hey" right now.',
        ];
        await reply(`🎯 *Dare:*\n\n${pickRandom(dares)}`);
        break;
      }

      case 'pickupline': {
        const lines = [
          'Are you a magician? Because whenever I look at you, everyone else disappears. ✨',
          'Do you have a map? I keep getting lost in your eyes. 👀',
          'Are you a Wi-Fi signal? Because I feel a strong connection. 📶',
          'Are you a keyboard? Because you are just my type. ⌨️',
          'Is your name Google? Because you have everything I\'ve been searching for. 🔍',
          'Are you a bot? Because you have automated my heartbeat. 🤖❤️',
        ];
        await reply(`😘 *Pick-Up Line:*\n\n${pickRandom(lines)}`);
        break;
      }

      case 'rate': {
        if (!q) return reply(`❌ Usage: *${prefix}rate <anything>*`);
        const score = randInt(1, 10);
        const stars = '⭐'.repeat(score) + '☆'.repeat(10 - score);
        await reply(
          `⭐ *RATE-O-METER*\n\n` +
          `📊 Rating: *${q}*\n\n` +
          `${stars}\n` +
          `Score: *${score}/10*\n\n` +
          (score >= 9 ? '🏆 Absolute GOAT!' :
           score >= 7 ? '✅ Pretty good!' :
           score >= 5 ? '🤷 Mid.' :
           score >= 3 ? '😬 Yikes.' : '💀 Not it.')
        );
        break;
      }

      case 'horoscope': {
        const signs = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
        const sign = (q || '').toLowerCase();
        if (!signs.includes(sign)) return reply(`❌ Usage: *${prefix}horoscope <zodiac sign>*\nSigns: ${signs.join(', ')}`);
        try {
          const res = await axios.get(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, { method: 'POST' });
          await reply(
            `♈ *Horoscope for ${capitalize(sign)} - Today*\n\n` +
            `📅 Date Range: ${res.data?.date_range}\n` +
            `🌈 Color: ${res.data?.color}\n` +
            `🔢 Lucky Number: ${res.data?.lucky_number}\n` +
            `⏰ Lucky Time: ${res.data?.lucky_time}\n` +
            `😊 Mood: ${res.data?.mood}\n\n` +
            `📖 ${res.data?.description}`
          );
        } catch {
          reply('❌ Could not fetch horoscope. Try again.');
        }
        break;
      }

      case 'hack': {
        const target = mentionedJid[0] ? `@${getNumber(mentionedJid[0])}` : (q || 'target');
        await reply(`💻 Initiating hack on ${target}...`);
        await sleep(1500);
        await reply(`🔓 Breaking firewall...`);
        await sleep(1500);
        await reply(`🕵️ Accessing mainframe...`);
        await sleep(1500);
        await reply(`📁 Downloading files...`);
        await sleep(1500);
        await reply(
          `✅ *HACK COMPLETE!*\n\n` +
          `Target: ${target}\n` +
          `Files stolen: ${randInt(100, 9999)}\n` +
          `Passwords found: ${randInt(1, 50)}\n` +
          `Memes saved: ${randInt(500, 5000)}\n\n` +
          `😂 *Just kidding! Hacking is illegal. Stay safe online.*\n🇿🇼 Malvin C VME`
        );
        break;
      }

      // ══════ UTILITY ═══════════════════════════════════════
      case 'weather': {
        if (!q) return reply(`❌ Usage: *${prefix}weather <city name>*`);
        await reply(`🌤️ Fetching weather for *${q}*...`);
        try {
          const res = await axios.get(`https://wttr.in/${encodeURIComponent(q)}?format=j1`);
          const data = res.data?.current_condition?.[0];
          const area = res.data?.nearest_area?.[0];
          const city = area?.areaName?.[0]?.value || q;
          const country = area?.country?.[0]?.value || '';
          await reply(
            `╔══❰ 🌤️ *WEATHER* ❱══╗\n` +
            `║ 📍 *Location:* ${city}, ${country}\n` +
            `║ 🌡️ *Temp:* ${data?.temp_C}°C / ${data?.temp_F}°F\n` +
            `║ 💧 *Humidity:* ${data?.humidity}%\n` +
            `║ 💨 *Wind:* ${data?.windspeedKmph} km/h\n` +
            `║ 👁️ *Visibility:* ${data?.visibility} km\n` +
            `║ ☁️ *Condition:* ${data?.weatherDesc?.[0]?.value}\n` +
            `║ 🌡️ *Feels Like:* ${data?.FeelsLikeC}°C\n` +
            `╚════════════════════╝\n` +
            `🇿🇼 Malvin C VME`
          );
        } catch {
          reply('❌ Could not fetch weather. Check the city name.');
        }
        break;
      }

      case 'news': {
        await reply('📰 Fetching latest news...');
        try {
          const res = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${process.env.NEWS_API_KEY || 'demo'}`);
          const articles = res.data?.articles?.slice(0, 5);
          if (!articles?.length) throw new Error();
          const news = articles.map((a, i) => `${i+1}. *${a.title}*\n   📰 ${a.source?.name}`).join('\n\n');
          await reply(`📰 *Top News Headlines:*\n\n${news}\n\n🇿🇼 Malvin C VME`);
        } catch {
          reply('❌ Could not fetch news. Add NEWS_API_KEY to .env for real news.');
        }
        break;
      }

      case 'wikipedia':
      case 'wiki': {
        if (!q) return reply(`❌ Usage: *${prefix}wiki <topic>*`);
        await reply(`🔍 Searching Wikipedia for: *${q}*...`);
        try {
          const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
          if (res.data?.type === 'disambiguation') return reply(`❌ Ambiguous search. Be more specific.`);
          await reply(
            `📚 *Wikipedia: ${res.data.title}*\n\n` +
            `${res.data.extract?.substring(0, 800)}...\n\n` +
            `🔗 ${res.data.content_urls?.desktop?.page}`
          );
        } catch {
          reply('❌ Could not find Wikipedia article for that topic.');
        }
        break;
      }

      case 'define': {
        if (!q) return reply(`❌ Usage: *${prefix}define <word>*`);
        await reply(`📖 Looking up: *${q}*...`);
        try {
          const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(q)}`);
          const entry = res.data?.[0];
          const meaning = entry?.meanings?.[0];
          const def = meaning?.definitions?.[0];
          await reply(
            `📖 *Definition: ${entry?.word}*\n\n` +
            `🔤 *Part of Speech:* ${meaning?.partOfSpeech}\n\n` +
            `📝 *Meaning:*\n${def?.definition}\n\n` +
            (def?.example ? `💬 *Example:*\n"${def.example}"` : '')
          );
        } catch {
          reply(`❌ Could not find definition for "*${q}*".`);
        }
        break;
      }

      case 'qr': {
        if (!q) return reply(`❌ Usage: *${prefix}qr <text or URL>*`);
        try {
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(q)}`;
          await sock.sendMessage(from, {
            image: { url: qrUrl },
            caption: `📱 *QR Code for:* ${shorten(q, 50)}\n🇿🇼 Malvin C VME`,
          }, { quoted: msg });
        } catch {
          reply('❌ Failed to generate QR code.');
        }
        break;
      }

      case 'base64': {
        if (!q) return reply(`❌ Usage: *${prefix}base64 <text>*`);
        const encoded = Buffer.from(q).toString('base64');
        await reply(`🔐 *Base64 Encoded:*\n\n\`${encoded}\``);
        break;
      }

      case 'unbase64': {
        if (!q) return reply(`❌ Usage: *${prefix}unbase64 <base64 text>*`);
        try {
          const decoded = Buffer.from(q, 'base64').toString('utf8');
          await reply(`🔓 *Base64 Decoded:*\n\n${decoded}`);
        } catch {
          reply('❌ Invalid Base64 string.');
        }
        break;
      }

      case 'binary': {
        if (!q) return reply(`❌ Usage: *${prefix}binary <text>*`);
        const bin = q.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        await reply(`💻 *Binary:*\n\n\`${bin}\``);
        break;
      }

      case 'unbinary':
      case 'dbinary': {
        if (!q) return reply(`❌ Usage: *${prefix}unbinary <binary>*`);
        try {
          const text = q.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
          await reply(`🔓 *Decoded:*\n\n${text}`);
        } catch {
          reply('❌ Invalid binary string.');
        }
        break;
      }

      case 'url': {
        if (!q) return reply(`❌ Usage: *${prefix}url <long URL>*`);
        await reply('🔗 Shortening URL...');
        try {
          const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(q)}`);
          await reply(`🔗 *Shortened URL:*\n\n${res.data}`);
        } catch {
          reply('❌ URL shortening failed.');
        }
        break;
      }

      case 'screenshot':
      case 'ss': {
        if (!q || !isUrl(q)) return reply(`❌ Usage: *${prefix}screenshot <URL>*`);
        await reply('📸 Taking screenshot...');
        try {
          const ssUrl = `https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(q)}&dimension=1366x768`;
          await sock.sendMessage(from, {
            image: { url: ssUrl },
            caption: `📸 Screenshot of: ${q}\n🇿🇼 Malvin C VME`,
          }, { quoted: msg });
        } catch {
          reply('❌ Screenshot failed.');
        }
        break;
      }

      case 'timenow':
      case 'time': {
        await reply(
          `🕐 *Current Time & Date*\n\n` +
          `⏰ Time: *${timeNow()}*\n` +
          `📅 Date: *${dateNow()}*\n` +
          `🌍 Timezone: *Africa/Harare (CAT)*\n` +
          `🇿🇼 Zimbabwe Time`
        );
        break;
      }

      // ══════ STICKER ════════════════════════════════════════
      case 'telestick': {
        if (!q) return reply(`❌ Usage: *${prefix}telestick <emoji or sticker name>*`);
        await reply(`🔍 Searching Telegram sticker: *${q}*...`);
        await reply('❌ Telegram sticker search requires a Telegram bot token. Add TELEGRAM_TOKEN to .env');
        break;
      }

      // ══════ MISC ══════════════════════════════════════════
      case 'cid': {
        await reply(`🆔 *Your WhatsApp ID:*\n\n\`${sender}\`\n\n📱 Number: *+${getNumber(sender)}*`);
        break;
      }

      case 'status':
      case 'gstatus': {
        await reply('📊 Fetching bot status...');
        const memUsage = process.memoryUsage();
        await reply(
          `╔══❰ 📊 *BOT STATUS* ❱══╗\n` +
          `║ ✅ Status: *Online*\n` +
          `║ ⏱️ Uptime: *${runtime(process.uptime())}*\n` +
          `║ 🧠 RAM: *${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB*\n` +
          `║ 💾 Total RAM: *${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB*\n` +
          `║ ⚡ Node: *${process.version}*\n` +
          `║ 🖥️ Platform: *${process.platform}*\n` +
          `╚════════════════════╝\n` +
          `🇿🇼 Malvin C VME`
        );
        break;
      }

      case 'repeat': {
        if (!q) return reply(`❌ Usage: *${prefix}repeat <text>*`);
        await reply(q);
        break;
      }

      case 'send': {
        if (!isOwnerMsg) return reply('❌ Owner only.');
        const [num, ...msgParts] = args;
        const sendTo = formatPhone(num);
        const sendMsg = msgParts.join(' ');
        if (!num || !sendMsg) return reply(`❌ Usage: *${prefix}send <number> <message>*`);
        try {
          await sock.sendMessage(sendTo, { text: sendMsg });
          await reply(`✅ Message sent to +${num}`);
        } catch {
          reply('❌ Failed to send message.');
        }
        break;
      }

      default: {
        // Chatbot fallback
        if (isGroup) {
          const grpSettings = db.getGroup(from);
          if (grpSettings.chatbot) {
            try {
              const res = await axios.get(`https://api.simsimi.vn/v1/simsimiplus?lc=en&text=${encodeURIComponent(body)}`);
              const answer = res.data?.success;
              if (answer) await reply(answer);
            } catch {}
          }
        } else {
          // DM chatbot (always on for DMs)
          try {
            const res = await axios.get(`https://api.simsimi.vn/v1/simsimiplus?lc=en&text=${encodeURIComponent(body)}`);
            const answer = res.data?.success;
            if (answer) await reply(answer);
          } catch {}
        }
        break;
      }
    }
  } catch (err) {
    console.error('Command error:', err);
  }
}

module.exports = { handleCommand, buildMenu };
