// =============================
// Render 24/7 Telegram Bot Setup
// =============================

const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Root endpoint - just to show bot is alive
app.get('/', (req, res) => {
  res.send('🤖 Telegram Bot is running 24/7 ✅');
});

// Optional dashboard (if you want to serve HTML)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Start express server
app.listen(PORT, () => {
  console.log(`🚀 Web server running at http://localhost:${PORT}`);
});

// =============================
// BOT STARTER
// =============================
function startBot() {
  console.log('▶️ Starting bot...');

  const botProcess = spawn('node', ['main.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // If bot exits, restart after 5 seconds
  botProcess.on('close', (code) => {
    console.log(`⚠️ Bot exited with code: ${code}`);
    console.log('🔄 Restarting bot in 5 seconds...');
    setTimeout(startBot, 5000);
  });

  // If bot fails to start, retry
  botProcess.on('error', (err) => {
    console.error('❗ Failed to start bot process:', err.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(startBot, 5000);
  });
}

// Start the bot
startBot();
