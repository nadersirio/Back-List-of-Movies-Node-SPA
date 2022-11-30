const jetpack = require("fs-jetpack");

const databaseDIR = "./database.json";
function getDatabase() {
  return JSON.parse(jetpack.read(databaseDIR))
}

function saveDatabase(database) {
  return jetpack.write(databaseDIR, database);
}

module.exports = {
  getDatabase,
  saveDatabase,
}