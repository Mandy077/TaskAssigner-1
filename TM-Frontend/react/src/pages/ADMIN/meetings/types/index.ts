export interface Participant {
  id: string;
  username: string;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  peer?: any;
}

export interface Message {
  sender: string;
  message: string;
  timestamp: number;
  isOwn?: boolean;
}

export interface PeerConnection {
  peer: any;
  username: string;
}

export interface RoomParticipant {
  userId: string;
  username: string;
  socketId: string;
}