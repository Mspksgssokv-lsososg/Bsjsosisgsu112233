const express = require("express");
const path = require("path");
const { spawn } = require("child_process");

const app = express();
const port = 3000;

// Web server
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dashboard", "index.html"));
});

app.listen(port, () => console.log(`🌐 Server running on port ${port}`));


// 🔥 24/7 Auto Restart System
function startBot() {
  console.log("🚀 Starting Bot...\n");

  const child = spawn("node", ["main.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  // Bot বন্ধ হলে restart
  child.on("close", (code) => {
    console.log(`❌ Bot stopped with code: ${code}`);

    // সব ধরনের exit-এই restart করবে
    setTimeout(() => {
      console.log("♻️ Restarting Bot...\n");
      startBot();
    }, 3000);
  });

  // Error handle
  child.on("error", (err) => {
    console.log(`⚠️ Error: ${err.message}`);

    setTimeout(() => {
      startBot();
    }, 3000);
  });
}

// Start bot
startBot();
