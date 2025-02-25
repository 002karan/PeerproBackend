const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mediasoup = require('mediasoup');
const { createMediasoupWorker } = require('./sfu/sfuServer');
const socketHandler = require('./sockets/socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST']
  }
});

// Start mediasoup worker
createMediasoupWorker().then((worker) => {
  // Initialize Socket.IO event handlers
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socketHandler(socket, worker);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
