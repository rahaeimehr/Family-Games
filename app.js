require('dotenv').config();
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const socketIo = require('socket.io');
const logger = require('./utils/logger');
const { checkIP } = require('./utils/ipChecker');
const sessionMiddleware = require('./middlewares/session');

const userRoutes = require('./routes/userRoutes'); // Import user routes

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  const ipInfo = checkIP(req.ip, req.headers['user-agent']);
  
  with(ipInfo) {
    logger.writeText(`${city} ${ip} ${req.url}\n --> ${deviceType}`);
  }  
  next();
});

app.use((req, res, next) => {
  try{
    res.locals.user = req.session.user;
  }catch {}
  next();
});

const server = https.createServer({
  key: fs.readFileSync('rahaeimehr.key'),
  cert: fs.readFileSync('rahaeimehr.cer'),
  passphrase: 'test'
}, app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/chat', (req, res) => {
  res.render('chat');
});


app.get('/games', (req, res) => {
  res.render('games');
});

app.get('/we', (req, res) => {
  res.render('we', { correctPin: 0 });
});

app.get('/verify', (req, res) => {
  res.render('we', { correctPin: 0 });
});

app.post('/verify', (req, res) => {
  const submittedPin = req.body.pin; // Get the submitted pin code from the form
  const correctPin = process.env.PIN;

  const ipInfo = checkIP(req.ip, req.userAgent);
  with(ipInfo) {
    console.log(`${city} ${ip} ${deviceType}`);
  }
  // Check if the submitted pin code matches the correct pin code
  if (ipInfo.pass && submittedPin === correctPin) {
    res.render('we.ejs', { correctPin: 2 }); // Pass correctPin as true if the pin is correct
  } else {
    res.render('we.ejs', { correctPin: 1 }); // Pass correctPin as false if the pin is incorrect
  }
});

// Include user routes
app.use('/', userRoutes);

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected');
  const ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
  const userAgent = socket.handshake.headers['user-agent'];
  const ipInfo = checkIP(ip, userAgent);

  with(ipInfo) {
    logger.writeToLog('Connect', ip, deviceType, city, address); // Store message in log.txt file
  }

  // Handle chat messages
  if (ipInfo.pass) {
    socket.on('chat message', (msg) => {
      logger.writeToLog(msg, ip, '', '', ''); // Store message in log.txt file
      io.emit('chat message', msg); // Broadcast the message to all connected clients
    });
  } else {
    console.log(`Connection rejected. Client is from ${ipInfo.city} ${ipInfo.ip}.`);
    socket.disconnect(true); // Disconnect the client
  }

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.writeToLog('Disconnect', ipInfo.ip, '', ipInfo.city, ''); // Store message in log.txt file
    console.log('User disconnected');
  });
});

if (!process.env.DEV) {
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
