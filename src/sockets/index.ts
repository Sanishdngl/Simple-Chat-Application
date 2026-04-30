import { Server } from 'socket.io';
import { httpServer } from '../index';
import { registerChatHandlers } from './chat.socket';
import { socketAuthMiddleware } from '../middlewares/socketAuth'; // 👈 add

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const chatNamespace = io.of('/chat');

chatNamespace.use(socketAuthMiddleware);

chatNamespace.on('connection', (socket) => {
  registerChatHandlers(chatNamespace, socket);
});

console.log('✅ Socket.io initialized on namespace: /chat');

export { io };
