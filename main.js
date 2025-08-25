const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// COLORS
const c = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  pink: "\x1b[35m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  orange: "\x1b[38;5;208m",
  lavender: "\x1b[38;5;141m",
  mint: "\x1b[38;5;121m",
  bold: "\x1b[1m",
};

const cmdsDir = path.join(__dirname, "scripts", "cmds");
const eventsDir = path.join(__dirname, "scripts", "events");

// ───────────────────────────────
// STATIC MESSAGES
// ───────────────────────────────
const messages = {
  info: {
    loadingEvents: "Loading events...",
    cmdLoaded: "Command {file} loaded successfully",
    eventLoaded: "Event {file} loaded successfully"
  },
  warnings: {
    cmdsDirNotFound: "Commands directory not found: {dir}",
    eventsDirNotFound: "Events directory not found: {dir}",
    missingCmdName: "Command file {file} skipped: no command name found",
    missingEventName: "Event file {file} skipped: no event name found",
    processTerminated: "Process for {script} terminated",
    processExited: "Process for {script} exited with code {code}"
  },
  errors: {
    configNotFound: "Config.json file not found",
    failedToLoadCmd: "Failed to load command {file}: {message}",
    failedToLoadEvent: "Failed to load event {file}: {message}",
    processStartFailed: "Failed to start process {script}: {message}"
  }
};

// ───────────────────────────────
// GET MESSAGE HELPER
// ───────────────────────────────
const getMessage = (messages, key, replacements = {}) => {
  let message = messages;
  const keyParts = key.split(".");

  for (const part of keyParts) {
    if (message && typeof message === "object" && message.hasOwnProperty(part)) {
      message = message[part];
    } else {
      return `[MISSING MESSAGE FOR KEY: ${key}]`;
    }
  }

  if (typeof message !== "string") return `[INVALID MESSAGE TYPE FOR KEY: ${key}]`;

  for (const [placeholder, value] of Object.entries(replacements)) {
    message = message.replace(new RegExp(`\\{${placeholder}\\}`, "g"), value);
  }

  return message;
};

// ───────────────────────────────
// LOAD COMMANDS
// ───────────────────────────────
const loadCmds = (messages) => {
  const cmds = new Map();

  if (!fs.existsSync(cmdsDir)) {
    console.warn(`${c.yellow}[WARNING]${c.reset} ${getMessage(messages, "warnings.cmdsDirNotFound", { dir: cmdsDir })}`);
    return cmds;
  }

  const commandFiles = fs.readdirSync(cmdsDir).filter(file => file.endsWith(".js"));

  console.log(
    `${c.cyan}────────────────────────────────────────────\n${c.bold}${c.pink}LOADING COMMANDS${c.reset}\n────────────────────────────────────────────${c.reset}`
  );

  for (const file of commandFiles) {
    try {
      const command = require(path.join(cmdsDir, file));

      if (command.config?.name) {
        cmds.set(command.config.name.toLowerCase(), command);
        console.log(`${c.green}[COMMAND]${c.reset} ${getMessage(messages, "info.cmdLoaded", { file })}`);
      } else {
        console.warn(`${c.yellow}[SKIP]${c.reset} ${getMessage(messages, "warnings.missingCmdName", { file })}`);
      }

    } catch (err) {
      console.error(`${c.red}[ERROR]${c.reset} ${getMessage(messages, "errors.failedToLoadCmd", { file, message: err.message })}`);
    }
  }

  return cmds;
};

// ───────────────────────────────
// LOAD EVENTS
// ───────────────────────────────
const loadEvents = (messages) => {
  if (!fs.existsSync(eventsDir)) {
    console.warn(`${c.yellow}[WARNING]${c.reset} ${getMessage(messages, "warnings.eventsDirNotFound", { dir: eventsDir })}`);
    return;
  }

  console.log(
    `\n${c.cyan}────────────────────────────────────────────\n${c.bold}${c.lavender}LOADING EVENTS${c.reset}\n────────────────────────────────────────────${c.reset}`
  );

  const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith(".js"));

  for (const file of eventFiles) {
    try {
      const event = require(path.join(eventsDir, file));

      if (event.config?.name) {
        console.log(`${c.green}[EVENT]${c.reset} ${getMessage(messages, "info.eventLoaded", { file })}`);
      } else {
        console.warn(`${c.yellow}[SKIP]${c.reset} ${getMessage(messages, "warnings.missingEventName", { file })}`);
      }

    } catch (err) {
      console.error(`${c.red}[ERROR]${c.reset} ${getMessage(messages, "errors.failedToLoadEvent", { file, message: err.message })}`);
    }
  }
};

// ───────────────────────────────
// BOT PROCESS MANAGER
// ───────────────────────────────
let botProcess = null;
const manageBotProcess = (scripts, messages, config) => {
  if (botProcess) {
    botProcess.kill();
    console.log(`${c.yellow}[PROCESS]${c.reset} ${getMessage(messages, "warnings.processTerminated", { script: scripts })}`);
  }

  botProcess = spawn("node", ["--trace-warnings", "--async-stack-traces", scripts], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, BOT_CONFIG: JSON.stringify(config) },
  });

  botProcess.on("close", (code) => {
    console.log(`${c.yellow}[PROCESS]${c.reset} ${getMessage(messages, "warnings.processExited", { script: scripts, code })}`);
  });

  botProcess.on("error", (err) => {
    console.error(`${c.red}[PROCESS ERROR]${c.reset} ${getMessage(messages, "errors.processStartFailed", { script: scripts, message: err.message })}`);
  });
};

// ───────────────────────────────
// MAIN FUNCTION
// ───────────────────────────────
const main = async () => {
  // CONFIG LOAD
  const configPath = path.join(process.cwd(), "config.json");
  if (!fs.existsSync(configPath)) {
    console.error(`${c.red}[ERROR]${c.reset} ${getMessage(messages, "errors.configNotFound")}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  // Load
  const cmds = loadCmds(messages);
  loadEvents(messages);

  // BOT INFO DISPLAY
  console.log(
    `\n${c.cyan}────────────────────────────────────────────\n${c.bold}${c.pink}BOT INFO${c.reset}\n────────────────────────────────────────────${c.reset}`
  );
  console.log(`${c.mint}Login:${c.reset} Successfully logged in`);
  console.log(`${c.lavender}Bot ID:${c.reset} ${c.bold}${config.botID || "Unknown"}${c.reset}`);

  // ADMIN INFO
  console.log(
    `\n${c.cyan}────────────────────────────────────────────\n${c.bold}${c.orange}ADMIN INFO${c.reset}\n────────────────────────────────────────────${c.reset}`
  );
  console.log(`${c.cyan}Admin: Your Name Here${c.reset}`);

  // Start bot process
  manageBotProcess("bot/main.js", messages, config);

  return { cmds, config };
};

module.exports = main();
