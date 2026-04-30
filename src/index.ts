import 'dotenv/config';
import { createServer } from 'http';
import app from './app';

const PORT = process.env.PORT || 4000;

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`💬 Chat client at http://localhost:${PORT}/index.html`);
  console.log(`📄 API Docs at http://localhost:${PORT}/api-docs`);

  require('./sockets');
});

export { httpServer };
