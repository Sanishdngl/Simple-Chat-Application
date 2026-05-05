# Simple-Chat-Application

A real-time chat application with room support, built with **Node.js**, **TypeScript**, **Express**, and **Socket.io**. Includes a browser-based HTML client for instant testing.

---

##  Tech Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Runtime    | Node.js (LTS via nvm)      |
| Language   | TypeScript                 |
| Framework  | Express.js                 |
| WebSockets | Socket.io v4               |
| Storage    | In-Memory (Map)            |
| API Docs   | Swagger UI (swagger-jsdoc) |
| Linting    | ESLint v10 (flat config)   |
| Formatting | Prettier                   |
| Git Hooks  | Husky + lint-staged        |

---

## 📁 Project Structure

```
chat-app/
├── public/
│   └── index.html              # Browser-based HTML chat client
├── src/
│   ├── config/
│   │   └── swagger.ts          # Swagger/OpenAPI config
│   ├── controllers/
│   │   └── chat.controller.ts  # REST request handlers
│   ├── middlewares/
│   │   ├── socketAuth.ts       # Socket.io auth middleware
│   │   └── errorHandler.ts     # Global Express error handler
│   ├── routes/
│   │   └── chat.routes.ts      # Routes + Swagger JSDoc
│   ├── services/
│   │   └── chat.service.ts     # Business logic layer
│   ├── sockets/
│   │   ├── index.ts            # Socket.io init + namespace setup
│   │   └── chat.socket.ts      # All socket event handlers
│   ├── types/
│   │   └── chat.types.ts       # Shared TypeScript interfaces
│   ├── utils/
│   │   └── messageStore.ts     # In-memory message/room store
│   ├── app.ts                  # Express app setup
│   └── index.ts                # HTTP server entry point
├── .env                        # Environment variables (not committed)
├── .gitignore
├── .nvmrc                      # Node version lock
├── .prettierrc                 # Prettier config
├── eslint.config.js            # ESLint v10 flat config
├── tsconfig.json               # TypeScript config
└── package.json
```

---

## ⚙️ Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- Node.js LTS (via nvm)
- Git

> No database required — messages are stored in-memory. Redis persistence coming in Phase 2.

---

## 🛠️ Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd chat-app
```

### 2. Use correct Node version

```bash
nvm use
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=4000
NODE_ENV=development
```

---

## ▶️ Running the App

### Development (auto-restart on file save)

```bash
npm run dev
```

### Production build

```bash
npm run build
npm start
```

---

## 📜 Available Scripts

| Script      | Command          | Description                               |
| ----------- | ---------------- | ----------------------------------------- |
| Development | `npm run dev`    | Run with ts-node-dev (auto-restart)       |
| Build       | `npm run build`  | Compile TypeScript → `dist/`              |
| Start       | `npm start`      | Run compiled production build             |
| Lint        | `npm run lint`   | Run ESLint on all `.ts` files             |
| Format      | `npm run format` | Auto-format all `.ts` files with Prettier |

---

## 🌐 Accessing the App

Once the server is running:

| URL                              | Description      |
| -------------------------------- | ---------------- |
| `http://localhost:4000`          | HTML Chat Client |
| `http://localhost:4000/api-docs` | Swagger API Docs |
| `http://localhost:4000/health`   | Health Check     |

---

## 📌 REST API Endpoints

Base URL: `http://localhost:4000`

| Method | Endpoint                      | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| GET    | `/health`                     | Health check                   |
| GET    | `/api/rooms`                  | Get all active rooms           |
| GET    | `/api/rooms/:roomId`          | Get a single room              |
| GET    | `/api/rooms/:roomId/messages` | Get last 50 messages in a room |

### Example — Get all rooms

```bash
curl http://localhost:4000/api/rooms
```

### Example — Get room messages

```bash
curl http://localhost:4000/api/rooms/general/messages
```

---

## 🔌 Socket.io Events

**Namespace:** `/chat`

### Client → Server

| Event          | Payload                | Description              |
| -------------- | ---------------------- | ------------------------ |
| `join_room`    | `{ roomId, username }` | Join a chat room         |
| `send_message` | `{ roomId, content }`  | Send a message to a room |
| `leave_room`   | `{ roomId }`           | Leave a chat room        |

### Server → Client

| Event             | Payload                           | Description                   |
| ----------------- | --------------------------------- | ----------------------------- |
| `message_history` | `Message[]`                       | Last 50 messages on room join |
| `receive_message` | `Message`                         | New message broadcast to room |
| `user_joined`     | `{ username, roomId, timestamp }` | User joined notification      |
| `user_left`       | `{ username, roomId, timestamp }` | User left notification        |
| `room_users`      | `string[]`                        | Updated list of users in room |

---

## 🔐 Socket.io Authentication

Every client must pass a `username` in the Socket.io handshake auth object:

```javascript
const socket = io('/chat', {
  auth: { username: 'Alice' },
});
```

### Validation Rules

- `username` is **required**
- Must be between **2–20 characters**

### On Auth Failure

```javascript
socket.on('connect_error', (err) => {
  console.log(err.message);
  // 'USERNAME_REQUIRED' or 'USERNAME_INVALID'
});
```

---

## 🧪 Testing with the HTML Client

1. Start the server: `npm run dev`
2. Open **two browser tabs** at `http://localhost:4000`
3. Tab 1 → Enter username `Alice`, room `general` → click **Join Room**
4. Tab 2 → Enter username `Bob`, room `general` → click **Join Room**
5. Send messages between tabs in real time ✅
6. Watch online user count update on join/leave ✅
7. Rejoin a room to see message history load ✅

---

## 💡 How It Works

```
Client (Browser)
     │
     │  io('/chat', { auth: { username } })
     ▼
Socket.io Server
     │
     ├── socketAuthMiddleware  ← validates username
     │
     ├── join_room   → loads history, notifies room
     ├── send_message → saves to store, broadcasts to room
     └── leave_room  → removes user, notifies room
           │
           ▼
     MessageStore (in-memory Map)
     ├── messages: Map<roomId, Message[]>
     └── rooms:    Map<roomId, Room>
```

---

## 🗄️ Message Store (In-Memory)

Messages are stored in a `Map<roomId, Message[]>` during the server session.

> ⚠️ **Messages are lost on server restart.** Redis persistence is planned for Phase 2.

Each message has:

```typescript
{
  id: string; // UUID v4
  roomId: string;
  username: string;
  content: string;
  timestamp: Date;
}
```

Only the **last 50 messages** per room are returned to clients on join.

---

## 🔒 Git Hooks (Husky)

On every `git commit`, lint-staged runs automatically:

- ESLint fixes on staged `.ts` files
- Prettier formats staged `.ts` files

---

## 🔮 Suggested Future Improvements

- [ ] **Redis persistence** — store messages in Redis so they survive server restarts
- [ ] **JWT authentication** — replace simple username auth with signed tokens
- [ ] **Typing indicators** — emit `typing_start` / `typing_stop` events
- [ ] **Private messaging** — direct socket-to-socket messages
- [ ] **Message pagination** — add `limit`/`offset` to `GET /api/rooms/:id/messages`
- [ ] **Message reactions** — emoji reactions on messages via Socket.io events
- [ ] **Docker** — containerize the app with `Dockerfile` + `docker-compose.yml`
- [ ] **Tests** — unit tests with Jest + Socket.io client for integration tests
- [ ] **Rate limiting** — prevent message spam with per-socket rate limiting
- [ ] **Online presence** — track and broadcast connected users across all rooms

---

## 👤 Author

Built as part of the **Backend Development Learning Guide — Phase 1, Task 2**
Stack: Node.js · TypeScript · Express · Socket.io · In-Memory Store
