function log(level, message) {
    console.log(`${LOG_PREFIX[level]} ${message}`);
}

const updateConfigPath = path.join(__dirname, "logger", "updater.json");

let updateConfig;
try {
    const configData = fs.readFileSync(updateConfigPath, "utf8");
    updateConfig = JSON.parse(configData);
} catch (err) {
    log("ERROR", "Failed to read or parse updater.json");
    process.exit(1);
}

if (!updateConfig.repository || typeof updateConfig.repository !== "string") {
    log("ERROR", "Missing or invalid 'repository' in updater.json");
    process.exit(1);
}

if (!updateConfig.branch || typeof updateConfig.branch !== "string") {
    log("ERROR", "Missing or invalid 'branch' in updater.json");
    process.exit(1);
}

if (!updateConfig.preserve || !Array.isArray(updateConfig.preserve)) {
    log("ERROR", "Missing or invalid 'preserve' in updater.json");
    process.exit(1);
}

if (!updateConfig.backup || typeof updateConfig.backup !== "string") {
    log("ERROR", "Missing or invalid 'backup' in updater.json");
    process.exit(1);
}
