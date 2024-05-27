const fs = require('fs');

function writeToLog(message, ip, deviceType, city, address) {
  const timestamp = new Date().toISOString();
  const logMessage = ` [${city}] [${address}]  ${timestamp} [${ip}] [${deviceType}]: ${message}`;
  fs.appendFile('log.txt', logMessage + '\n', (err) => {
    if (err) throw err;
    console.log('Message logged to log.txt');
  });
}

function writeText(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${message}`;
  fs.appendFile('log.txt', logMessage + '\n', (err) => {
    if (err) throw err;
    console.log('Message logged to log.txt');
  });
}

module.exports = {
  writeToLog,
  writeText
};
