const express = require("express");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🤖 TG-BOT-V2 is running 24/7 ✅");
});

app.listen(PORT, () => {
  console.log(`🌍 Web server running on port ${PORT}`);
});

function startBot() {
  console.log("▶️ Starting bot...");

  const botProcess = spawn("node", ["main.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  botProcess.on("close", (code) => {
    console.log(`⚠️ Bot exited with code: ${code}`);
    console.log("🔄 Restarting bot in 5 seconds...");
    setTimeout(startBot, 5000);
  });

  botProcess.on("error", (err) => {
    console.error("❗ Failed to start bot:", err.message);
    setTimeout(startBot, 5000);
  });
}

startBot();
