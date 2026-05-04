import { Message, Room } from '../types/chat.types';

// In-memory store (replaced by Redis in Phase 2)
const messages = new Map<string, Message[]>();
const rooms = new Map<string, Room>();

export const MessageStore = {
  addMessage(roomId: string, message: Message): void {
    if (!messages.has(roomId)) {
      messages.set(roomId, []);
    }
    messages.get(roomId)!.push(message);
  },

  getMessages(roomId: string): Message[] {
    return messages.get(roomId)?.slice(-50) || [];
  },

  getRooms(): Room[] {
    return Array.from(rooms.values());
  },

  upsertRoom(roomId: string, name: string): Room {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { id: roomId, name, users: [] });
    }
    return rooms.get(roomId)!;
  },

  addUserToRoom(roomId: string, username: string): void {
    const room = rooms.get(roomId);
    if (room && !room.users.includes(username)) {
      room.users.push(username);
    }
  },

  removeUserFromRoom(roomId: string, username: string): void {
    const room = rooms.get(roomId);
    if (room) {
      room.users = room.users.filter((u) => u !== username);
    }
  },
};
