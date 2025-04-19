import { io, Socket } from 'socket.io-client';
import { Participant, RoomParticipant } from '../types';

// Use an environment variable in production
const SERVER_URL = 'http://localhost:4444';

class SocketService {
  private socket: Socket | null = null;
  private initialized = false;

  initialize() {
    if (this.initialized) return;
    
    this.socket = io(SERVER_URL);
    this.initialized = true;
    
    console.log('Socket connection initialized');
  }

  getSocket(): Socket {
    if (!this.socket) {
      this.initialize();
    }
    
    return this.socket!;
  }

  joinRoom(roomId: string, userId: string, username: string) {
    this.getSocket().emit('join-room', { roomId, userId, username });
  }

  leaveRoom(roomId: string) {
    this.getSocket().emit('leave-room', { roomId });
  }

  sendSignal(to: string, from: string, signal: any) {
    this.getSocket().emit('signal', { to, from, signal });
  }

  sendMessage(roomId: string, message: string, sender: string) {
    this.getSocket().emit('send-message', { roomId, message, sender });
  }

  toggleMedia(roomId: string, type: 'audio' | 'video', status: boolean) {
    this.getSocket().emit('toggle-media', { roomId, type, status });
  }

  onRoomParticipants(callback: (participants: RoomParticipant[]) => void) {
    this.getSocket().on('room-participants', callback);
  }

  onUserJoined(callback: (participant: RoomParticipant) => void) {
    this.getSocket().on('user-joined', callback);
  }

  onUserLeft(callback: ({ socketId }: { socketId: string }) => void) {
    this.getSocket().on('user-left', callback);
  }

  onSignal(callback: ({ from, signal }: { from: string; signal: any }) => void) {
    this.getSocket().on('signal', callback);
  }

  onNewMessage(callback: (message: any) => void) {
    this.getSocket().on('new-message', callback);
  }

  onUserToggleMedia(callback: (data: { userId: string; type: 'audio' | 'video'; status: boolean }) => void) {
    this.getSocket().on('user-toggle-media', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.initialized = false;
    }
  }
}

export const socketService = new SocketService();