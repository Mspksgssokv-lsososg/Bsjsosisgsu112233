const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// ───────────────────────────────
// EXPRESS SERVER
// ───────────────────────────────
app.get('/', (req, res) => {
  res.send('🤖 Siddik Bot is running 24/7');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Web server running at http://localhost:${PORT}`);
});

// ───────────────────────────────
// BOT PROCESS MANAGER
// ───────────────────────────────
function startBot() {
  console.log('▶️ Starting bot...');

  const botProcess = spawn('node', ['main.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  botProcess.on('close', (code) => {
    console.log(`⚠️ Bot exited with code: ${code}`);
    console.log('🔄 Restarting bot in 5 seconds...');
    setTimeout(startBot, 5000);
  });

  botProcess.on('error', (err) => {
    console.error('❗ Failed to start bot process:', err.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(startBot, 5000);
  });
}

startBot();
