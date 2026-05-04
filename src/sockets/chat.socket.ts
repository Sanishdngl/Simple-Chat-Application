import { Namespace, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { MessageStore } from '../utils/messageStore';
import { JoinRoomPayload, SendMessagePayload } from '../types/chat.types';

export const registerChatHandlers = (io: Namespace, socket: Socket) => {
  const username = socket.data.username as string;

  console.log(`✅ User connected: ${username} (${socket.id})`);

  socket.on(
    'join_room',
    ({ roomId, username: roomUsername }: JoinRoomPayload) => {
      socket.join(roomId);

      MessageStore.upsertRoom(roomId, roomId);
      MessageStore.addUserToRoom(roomId, roomUsername);

      const history = MessageStore.getMessages(roomId);
      socket.emit('message_history', history);

      socket.to(roomId).emit('user_joined', {
        username: roomUsername,
        roomId,
        timestamp: new Date(),
      });

      const room = MessageStore.getRooms().find((r) => r.id === roomId);
      io.to(roomId).emit('room_users', room?.users || []);

      console.log(`👤 ${roomUsername} joined room: ${roomId}`);
    },
  );

  socket.on('send_message', ({ roomId, content }: SendMessagePayload) => {
    const message = {
      id: uuidv4(),
      roomId,
      username,
      content,
      timestamp: new Date(),
    };

    MessageStore.addMessage(roomId, message);

    // Broadcast to everyone in the room (including sender)
    io.to(roomId).emit('receive_message', message);

    console.log(`💬 [${roomId}] ${username}: ${content}`);
  });

  socket.on('leave_room', ({ roomId }: { roomId: string }) => {
    socket.leave(roomId);
    MessageStore.removeUserFromRoom(roomId, username);

    socket.to(roomId).emit('user_left', {
      username,
      roomId,
      timestamp: new Date(),
    });

    const room = MessageStore.getRooms().find((r) => r.id === roomId);
    io.to(roomId).emit('room_users', room?.users || []);

    console.log(`👋 ${username} left room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${username} (${socket.id})`);
  });
};
