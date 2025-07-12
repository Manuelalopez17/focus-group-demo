const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let connectedUsers = new Map();
let riskMatrix = {};
let sessionStats = {
  totalConnections: 0,
  activeUsers: 0,
  responses: 0
};

// Middleware - CORREGIDO: eliminado punto y coma doble
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rutas principales - MEJORADO: usando path.resolve para mayor robustez
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.get('/admin/:sessionId', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'admin.html'));
});

app.get('/session/:sessionId', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'participant.html'));
});

// Socket.IO - Manejo de conexiones en tiempo real
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);
  
  socket.on('join-session', (data) => {
    const { sessionId, userType, location } = data;
    socket.join(sessionId);
    
    connectedUsers.set(socket.id, {
      sessionId,
      userType,
      location: location || 'Santiago, Chile',
      connectedAt: new Date()
    });
    
    sessionStats.totalConnections++;
    sessionStats.activeUsers = connectedUsers.size;
    
    io.to(sessionId).emit('user-connected', {
      userId: socket.id,
      stats: sessionStats,
      connectedUsers: Array.from(connectedUsers.values()).filter(u => u.sessionId === sessionId)
    });
    
    socket.emit('matrix-update', riskMatrix);
    console.log(`Usuario ${socket.id} se unió a sesión ${sessionId} como ${userType}`);
  });
  
  socket.on('matrix-selection', (data) => {
    const { sessionId, row, col, value, userId } = data;
    const key = `${row}-${col}`;
    
    if (!riskMatrix[key]) {
      riskMatrix[key] = { votes: [], total: 0 };
    }
    
    riskMatrix[key].votes = riskMatrix[key].votes.filter(vote => vote.userId !== userId);
    riskMatrix[key].votes.push({ userId, value, timestamp: new Date() });
    riskMatrix[key].total = riskMatrix[key].votes.length;
    
    sessionStats.responses++;
    
    io.to(sessionId).emit('matrix-update', riskMatrix);
    io.to(sessionId).emit('stats-update', sessionStats);
    
    console.log(`Matriz actualizada: ${key} = ${value} por usuario ${userId}`);
  });
  
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      sessionStats.activeUsers = connectedUsers.size;
      
      io.to(user.sessionId).emit('user-disconnected', {
        userId: socket.id,
        stats: sessionStats,
        connectedUsers: Array.from(connectedUsers.values()).filter(u => u.sessionId === user.sessionId)
      });
    }
    console.log(`Usuario desconectado: ${socket.id}`);
  });
});

// CORREGIDO: Puerto para Render (process.env.PORT tiene prioridad)
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 URL base: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}`);
});
