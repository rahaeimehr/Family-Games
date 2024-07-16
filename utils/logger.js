const fs = require('fs');
const moment = require('moment-timezone');

function writeToLog(message, ip, deviceType, city, address) {
  const timestamp = moment().tz("America/New_York").format('YYYY-MM-DD HH:mm:ss');
  const logMessage = ` [${city}] ${timestamp} ${address} ${ip} ${deviceType} \n   : ${message}`;
  fs.appendFile('log.txt', logMessage + '\n', (err) => {
    if (err) throw err;
    console.log('Message logged to log.txt');
  });
}

function writeText(message) {
  const timestamp = moment().tz("America/New_York").format('YYYY-MM-DD HH:mm:ss');
  const logMessage = `${timestamp} \n${message}`;
  fs.appendFile('log.txt', logMessage + '\n', (err) => {
    if (err) throw err;
    console.log('Message logged to log.txt');
  });
}

module.exports = {
  writeToLog,
  writeText
};
