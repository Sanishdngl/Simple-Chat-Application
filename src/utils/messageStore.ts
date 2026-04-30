import { Message, Room } from '../types/chat.types';

// In-memory store (replaced by Redis in Phase 2)
const messages = new Map<string, Message[]>();
const rooms = new Map<string, Room>();

export const MessageStore = {
  // Add a message to a room
  addMessage(roomId: string, message: Message): void {
    if (!messages.has(roomId)) {
      messages.set(roomId, []);
    }
    messages.get(roomId)!.push(message);
  },

  // Get all messages for a room (last 50)
  getMessages(roomId: string): Message[] {
    return messages.get(roomId)?.slice(-50) || [];
  },

  // Get all active rooms
  getRooms(): Room[] {
    return Array.from(rooms.values());
  },

  // Create or get a room
  upsertRoom(roomId: string, name: string): Room {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { id: roomId, name, users: [] });
    }
    return rooms.get(roomId)!;
  },

  // Add user to room
  addUserToRoom(roomId: string, username: string): void {
    const room = rooms.get(roomId);
    if (room && !room.users.includes(username)) {
      room.users.push(username);
    }
  },

  // Remove user from room
  removeUserFromRoom(roomId: string, username: string): void {
    const room = rooms.get(roomId);
    if (room) {
      room.users = room.users.filter((u) => u !== username);
    }
  },
};
