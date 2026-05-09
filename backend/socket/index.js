import { Server } from 'socket.io';

const activeLocks = new Map(); // Key: expertId:date:timeSlot, Value: socketId

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinExpertRoom', (expertId) => {
      // Leave all other expert rooms first to avoid global lock leakage
      socket.rooms.forEach(room => {
        if (room.startsWith('expert:')) {
          socket.leave(room);
        }
      });

      socket.join(`expert:${expertId}`);
      
      // Send existing locks for this expert to the new user, 
      // but EXCLUDE locks held by this same user (socketId)
      const expertLocks = [];
      activeLocks.forEach((socketId, lockKey) => {
        const [eId, date, timeSlot] = lockKey.split('|');
        if (eId === expertId && socketId !== socket.id) {
          expertLocks.push({ date, timeSlot });
        }
      });
      socket.emit('initialLocks', expertLocks);
    });

    socket.on('lockSlot', ({ expertId, date, timeSlot }) => {
      const lockKey = `${expertId}|${date}|${timeSlot}`;
      
      if (activeLocks.has(lockKey) && activeLocks.get(lockKey) !== socket.id) {
        return;
      }

      activeLocks.set(lockKey, socket.id);
      socket.to(`expert:${expertId}`).emit('slotLocked', { expertId, date, timeSlot });
    });

    socket.on('unlockSlot', ({ expertId, date, timeSlot }) => {
      const lockKey = `${expertId}|${date}|${timeSlot}`;
      if (activeLocks.get(lockKey) === socket.id) {
        activeLocks.delete(lockKey);
        socket.to(`expert:${expertId}`).emit('slotUnlocked', { expertId, date, timeSlot });
      }
    });

    socket.on('disconnect', () => {
      // Find all locks owned by this socket and release them
      activeLocks.forEach((socketId, lockKey) => {
        if (socketId === socket.id) {
          const [expertId, date, timeSlot] = lockKey.split('|');
          activeLocks.delete(lockKey);
          io.to(`expert:${expertId}`).emit('slotUnlocked', { date, timeSlot });
        }
      });
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};