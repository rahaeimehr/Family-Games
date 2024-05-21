require('dotenv').config();
const express = require('express');
const expressSession = require('express-session')
const https = require('https');
const http = require('http');
const fs = require('fs');
const socketIo = require('socket.io');
const geoip = require('geoip-lite');
const app = express();
const ejs = require('ejs');
const { userInfo } = require('os');
app.use(express.urlencoded({ extended: true }));

let counter = 0

app.use(expressSession({
  secret :process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: true
}))
app.use(express.static('public'));

app.set('view engine','ejs')

const server = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase : 'test'
}, app);
const io = socketIo(server);


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/we', (req, res) => {
  res.render('we',{ correctPin: 0 });
});

app.get('/verify', (req, res) => {
  res.render('we',{ correctPin: 0 });
});

app.post('/verify', (req, res) => {
  const submittedPin = req.body.pin; // Get the submitted pin code from the form
  const correctPin = process.env.PIN; 

  const ipInfo = checkIP(req.ip, req.userAgent)
  with(ipInfo)
  {
    console.log(`${city} ${ip} ${deviceType}`)
  }
  // Check if the submitted pin code matches the correct pin code
  if (ipInfo.pass && submittedPin === correctPin) {
      res.render('we.ejs', { correctPin: 2 }); // Pass correctPin as true if the pin is correct
  } else {
      res.render('we.ejs', { correctPin: 1 }); // Pass correctPin as false if the pin is incorrect
  }
});

// Function to write messages to log.txt file
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

function checkIP(userIP , userAgent)
{
  const geo = geoip.lookup(userIP);
  const address = geo ? geo.region : 'Unknown'; 
  const city = geo ? geo.city : 'Unknown';
  const country = geo? geo.country : 'Unknown';
  const region = geo? geo.region : 'Unknown'

  return {
    ip : userIP,
    pass : (country === 'US' && region === 'GA') || (process.env.DEV),    
    address : address,
    city : city,
    country : country,
    region : region,
    deviceType : userAgent

  }

}
// Socket.io connection handler
io.on('connection', (socket) => {  
  console.log('A user connected');
  const ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
  const userAgent = socket.handshake.headers['user-agent'];
  const ipInfo = checkIP(ip,userAgent)
  
  with(ipInfo)
  {
    writeToLog('Connect', ip, deviceType, city, address); // Store message in log.txt file
  }
  
  // Handle chat messages
  if (ipInfo.pass) {
    socket.on('chat message', (msg) => {
      writeToLog(msg, ip, '', '', '' ); //deviceType, city,address); // Store message in log.txt file
      io.emit('chat message', msg); // Broadcast the message to all connected clients
  });
  }
  else {
    console.log(`Connection rejected. Client is from ${ipInfo.city} ${ipInfo.ip}.`);
    socket.disconnect(true); // Disconnect the client
  }

  // Handle disconnection
  socket.on('disconnect', () => {
    writeToLog('Disconnect', ipInfo.ip, '', ipInfo.city, '' ); // Store message in log.txt file
    console.log('User disconnected');
  });
});

if(!process.env.DEV)
{
  const httpServer = http.createServer((req, res) => {
    res.writeHead(301, { Location: 'https://127.0.0.1' });
    res.end();
  });
  httpServer.listen(80);
}
// Start the server
const PORT = process.env.PORT || 443;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
