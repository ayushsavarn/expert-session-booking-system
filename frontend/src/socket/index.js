import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinExpertRoom(expertId) {
    if (this.socket) {
      this.socket.emit('joinExpertRoom', expertId);
    }
  }

  lockSlot(expertId, date, timeSlot) {
    if (this.socket) {
      this.socket.emit('lockSlot', { expertId, date, timeSlot });
    }
  }

  unlockSlot(expertId, date, timeSlot) {
    if (this.socket) {
      this.socket.emit('unlockSlot', { expertId, date, timeSlot });
    }
  }

  onInitialLocks(callback) {
    if (this.socket) {
      this.socket.on('initialLocks', callback);
    }
  }

  onSlotLocked(callback) {
    if (this.socket) {
      this.socket.on('slotLocked', callback);
    }
  }

  onSlotUnlocked(callback) {
    if (this.socket) {
      this.socket.on('slotUnlocked', callback);
    }
  }

  onSlotBooked(callback) {
    if (this.socket) {
      this.socket.on('slotBooked', callback);
    }
  }

  onSlotFreed(callback) {
    if (this.socket) {
      this.socket.on('slotFreed', callback);
    }
  }

  onBookingStatusUpdated(callback) {
    if (this.socket) {
      this.socket.on('bookingStatusUpdated', callback);
    }
  }

  offSlotBooked() {
    if (this.socket) {
      this.socket.off('slotBooked');
    }
  }

  offSlotFreed() {
    if (this.socket) {
      this.socket.off('slotFreed');
    }
  }

  offSlotLocked() {
    if (this.socket) {
      this.socket.off('slotLocked');
    }
  }

  offSlotUnlocked() {
    if (this.socket) {
      this.socket.off('slotUnlocked');
    }
  }

  offInitialLocks() {
    if (this.socket) {
      this.socket.off('initialLocks');
    }
  }

  offBookingStatusUpdated() {
    if (this.socket) {
      this.socket.off('bookingStatusUpdated');
    }
  }
}

export const socketService = new SocketService();
export default socketService;