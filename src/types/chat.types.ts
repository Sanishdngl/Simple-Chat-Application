export interface Message {
  id: string;
  roomId: string;
  username: string;
  content: string;
  timestamp: Date;
}

export interface JoinRoomPayload {
  roomId: string;
  username: string;
}

export interface SendMessagePayload {
  roomId: string;
  content: string;
}

export interface Room {
  id: string;
  name: string;
  users: string[];
}
