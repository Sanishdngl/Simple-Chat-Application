import { MessageStore } from '../utils/messageStore';

export class ChatService {
  static getRooms() {
    return MessageStore.getRooms();
  }

  static getMessages(roomId: string) {
    return MessageStore.getMessages(roomId);
  }

  static getRoom(roomId: string) {
    const rooms = MessageStore.getRooms();
    return rooms.find((r) => r.id === roomId) || null;
  }
}
