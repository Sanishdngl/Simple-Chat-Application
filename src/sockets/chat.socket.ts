import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { MessageStore } from '../utils/messageStore';
import { JoinRoomPayload, SendMessagePayload } from '../types/chat.types';

export const registerChatHandlers = (io: Server, socket: Socket) => {
  const username = socket.data.username as string;

  console.log(`✅ User connected: ${username} (${socket.id})`);

  // --- JOIN ROOM ---
  socket.on(
    'join_room',
    ({ roomId, username: roomUsername }: JoinRoomPayload) => {
      socket.join(roomId);

      // Create room if it doesn't exist
      MessageStore.upsertRoom(roomId, roomId);
      MessageStore.addUserToRoom(roomId, roomUsername);

      // Send existing messages to the user who just joined
      const history = MessageStore.getMessages(roomId);
      socket.emit('message_history', history);

      // Notify everyone else in the room
      socket.to(roomId).emit('user_joined', {
        username: roomUsername,
        roomId,
        timestamp: new Date(),
      });

      // Send updated room users list to everyone in room
      const room = MessageStore.getRooms().find((r) => r.id === roomId);
      io.to(roomId).emit('room_users', room?.users || []);

      console.log(`👤 ${roomUsername} joined room: ${roomId}`);
    },
  );

  // --- SEND MESSAGE ---
  socket.on('send_message', ({ roomId, content }: SendMessagePayload) => {
    const message = {
      id: uuidv4(),
      roomId,
      username,
      content,
      timestamp: new Date(),
    };

    // Save to in-memory store
    MessageStore.addMessage(roomId, message);

    // Broadcast to everyone in the room (including sender)
    io.to(roomId).emit('receive_message', message);

    console.log(`💬 [${roomId}] ${username}: ${content}`);
  });

  // --- LEAVE ROOM ---
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

  // --- DISCONNECT ---
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${username} (${socket.id})`);
  });
};
