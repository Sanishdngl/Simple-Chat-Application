import { Socket } from 'socket.io';

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  const username = socket.handshake.auth?.username as string;

  if (!username || username.trim() === '') {
    console.error(`❌ Auth failed for socket ${socket.id} — no username`);
    return next(new Error('USERNAME_REQUIRED'));
  }

  if (username.length < 2 || username.length > 20) {
    console.error(`❌ Auth failed — invalid username length: ${username}`);
    return next(new Error('USERNAME_INVALID'));
  }

  socket.data.username = username.trim();

  console.log(`🔐 Auth passed for: ${socket.data.username}`);
  next();
};
