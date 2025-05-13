const io = require('socket.io')(8000, {
    cors: {
      origin: "http://localhost:3000", // Update with your frontend URL
      methods: ["GET", "POST"],
    },
  });
  
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Emit data to the connected client
    setInterval(() => {
      const count = Math.floor(Math.random() * 100); // Example count
      socket.emit('dataEvent', { socketId: socket.id, count });
    }, 5000); // Every 5 seconds
  
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
  