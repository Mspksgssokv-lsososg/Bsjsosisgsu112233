const fs = require("fs-extra");
const path = require("path");
const { create, clear } = require("../database/cache.js");

// ───────────────────────────────
// MODULE VALIDATORS
// ───────────────────────────────
function validateCommand(module) {
  if (!module) throw new Error("No export found in module");
  if (!module.config) throw new Error("Missing config property in module");
  if (!module.config.name || typeof module.config.name !== "string") {
    throw new Error("Missing or invalid config.name in module");
  }
  if (!module.onStart) throw new Error("Missing onStart method in command");
}

function validateEvent(module) {
  if (!module) throw new Error("No export found in module");
  if (!module.config) throw new Error("Missing config property in module");
  if (!module.config.name || typeof module.config.name !== "string") {
    throw new Error("Missing or invalid config.name in module");
  }
  if (!module.run && !module.execute) {
    throw new Error("Missing run/execute method in event");
  }
}

// ───────────────────────────────
// LOAD DIRECTORY
// ───────────────────────────────
async function loadDirectory(directory, moduleType, collection, validator) {
  const errors = {};

  try {
    const files = await fs.readdir(directory);
    const jsFiles = files.filter(file => file.endsWith(".js"));

    for (const file of jsFiles) {
      try {
        const modulePath = path.join(directory, file);
        delete require.cache[require.resolve(modulePath)]; // hot reload support
        const mod = require(modulePath);
        const moduleExport = mod.default || mod;

        validator(moduleExport);
        collection.set(moduleExport.config.name, moduleExport);
      } catch (error) {
        console.error(`Error loading ${moduleType} "${file}": ${error.message}`);
        errors[file] = error;
      }
    }
  } catch (error) {
    console.error(`Error reading ${moduleType} directory "${directory}": ${error.message}`);
    errors.directory = error;
  }

  return errors;
}

// ───────────────────────────────
// MAIN UTILS FUNCTION
// ───────────────────────────────
async function scriptsUtils() {
  await create();
  await clear();

  const cmds = new Map();
  const events = new Map();

  const cmdsPath = path.join(process.cwd(), "scripts", "cmds");
  const eventsPath = path.join(process.cwd(), "scripts", "events");

  const [commandErrors, eventErrors] = await Promise.all([
    loadDirectory(cmdsPath, "command", cmds, validateCommand),
    loadDirectory(eventsPath, "event", events, validateEvent),
  ]);

  const errors = {
    commands: commandErrors,
    events: eventErrors,
  };

  return {
    cmds,
    events,
    errors: Object.keys(commandErrors).length === 0 &&
            Object.keys(eventErrors).length === 0
      ? false
      : errors,
  };
}

module.exports = { utils: scriptsUtils };
