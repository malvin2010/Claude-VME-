# 🤖 Malvin C VME — WhatsApp Multi-Device Bot
### by Handsome Tech Zimbabwe 🇿🇼

---

## ⚡ Quick Deploy

### 🚂 Railway (Recommended)
1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo
4. Add environment variables (see below)
5. Deploy — Railway auto-starts the bot

### 🎯 Koyeb
1. Push repo to GitHub
2. Go to [koyeb.com](https://koyeb.com) → Create App → GitHub
3. Set run command: `node index.js`
4. Add environment variables
5. Deploy

### 🟣 Render
1. Push repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Build Command: `npm install`
5. Start Command: `node index.js`
6. Add environment variables
7. Deploy

### 🦕 Pterodactyl Panel (Daki Hosting etc.)
1. Create a Node.js egg server
2. Upload all files via file manager
3. Set startup command: `node index.js`
4. Add environment variables in the Variables tab
5. Start the server

---

## 🔧 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `OWNER_NUMBER` | Your WhatsApp number e.g. `263xxxxxxxxx` | ✅ |
| `OWNER_NAME` | Your name | ✅ |
| `BOT_NAME` | Bot display name | ✅ |
| `SESSION_ID` | Session ID (after first pair) | ✅ |
| `PREFIX` | Command prefix (default: `.`) | ✅ |
| `MODE` | `public` or `private` | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | Optional |
| `OPENAI_API_KEY` | OpenAI API key | Optional |
| `NEWS_API_KEY` | NewsAPI key | Optional |
| `REMOVEBG_KEY` | remove.bg API key | Optional |
| `PORT` | Web panel port (default: 3000) | Optional |

---

## 🔗 First-Time Pairing

1. Set `OWNER_NUMBER` in your environment variables
2. Start the bot — it will print a **Pairing Code** in the terminal/logs
3. Open WhatsApp → Settings → Linked Devices → Link a Device
4. Enter the pairing code
5. Bot connects and sends you a confirmation message!
6. Copy your session from the `session/` folder to reuse later

---

## 📜 Commands (781+)

| Category | Commands |
|---|---|
| 🎵 Download | `.play`, `.song`, `.ytv`, `.tiktok`, `.instagram`, `.facebook` |
| 🤖 AI | `.ai`, `.gpt`, `.gemini`, `.claude`, `.deepseek`, `.chatbot on/off` |
| 🖼️ Images | `.sticker`, `.toimg`, `.remini`, `.removebg`, `.img`, `.meme` |
| 👥 Group | `.kick`, `.add`, `.promote`, `.demote`, `.mute`, `.tagall`, `.antilink on/off` |
| 🛡️ Owner | `.pair`, `.broadcast`, `.ban`, `.sudo`, `.mode`, `.restart` |
| ⚙️ Settings | `.autoread`, `.autotyping`, `.autoreact`, `.anticall`, `.antidelete` |
| 🎮 Fun | `.joke`, `.meme`, `.roast`, `.ship`, `.8ball`, `.dice`, `.truth`, `.dare` |
| 🔧 Utility | `.weather`, `.wiki`, `.define`, `.qr`, `.translate`, `.ping`, `.uptime` |

---

## 🇿🇼 Credits

**Developer:** Malvin C  
**Brand:** Handsome Tech Zimbabwe  
**Version:** 1.0.0  

---
