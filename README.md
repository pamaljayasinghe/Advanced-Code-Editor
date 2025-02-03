# Advanced Code Editor Setup Guide

## Project Structure
```
code-editor/
├── frontend/
│   ├── components/
│   │   ├── CodeEditor.js
│   │   ├── Layout.js
│   │   └── Navbar.js
│   ├── lib/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── websocket.js
│   ├── pages/
│   │   ├── index.js
│   │   └── login.js
│   ├── styles/
│   │   └── globals.css
│   ├── .env.local
│   ├── next.config.js
│   └── package.json
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.js
│   │   └── files.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── files.js
│   ├── services/
│   │   └── websocket.bal
│   ├── .env
│   ├── Ballerina.toml
│   ├── package.json
│   └── server.js
└── database/
    └── schema.sql
```

## Setup Instructions

1. Clone the repository and install dependencies:
```bash
# Clone the project
git clone <repository-url>
cd code-editor

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

2. Set up the database:
```bash
# Start XAMPP and open phpMyAdmin
# Import database/schema.sql
```

3. Configure environment variables:
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8080/editor

# Backend (.env)
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=code_editor
JWT_SECRET=your-secret-key-here
```

4. Start the services:
```bash
# Terminal 1: Start frontend
cd frontend
npm run dev

# Terminal 2: Start Node.js backend
cd backend
npm run dev

# Terminal 3: Start Ballerina service
cd backend
bal run services/websocket.bal
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- WebSocket: ws://localhost:8080/editor

## Features
- Real-time collaborative editing
- User authentication
- File saving and loading
- Syntax highlighting
- Active user presence

## Tech Stack
- Frontend: Next.js, Monaco Editor
- Backend: Node.js (Express), Ballerina
- Database: MySQL (XAMPP)
- Real-time: WebSocket
- Authentication: JWT
