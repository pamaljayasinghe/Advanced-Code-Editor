# Advanced Code Editor Setup Guide

## Project Structure
```
code-editor/
├── frontend/
│   ├── components/
│   │   ├── CodeEditor.js
│   │   ├── Header.js
│   │   ├── Layout.js
│   │   └── UsersPanel.js
│   ├── lib/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── socket.js
│   │   └── codeExecution.js
│   ├── pages/
│   │   ├── index.js
│   │   ├── login.js
│   │   └── register.js
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
│   │   └── websocket.bal     # Ballerina WebSocket service
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
git clone https://github.com/pamaljayasinghe/Advanced-Code-Editor.git
cd code-editor

# Install frontend dependencies
cd frontend
npm install
# Install required UI packages
npm install lucide-react @monaco-editor/react
```

2. Set up the database:
```bash
# Start XAMPP and open phpMyAdmin
# Create a database named "code_editor"
# Import database/schema.sql
```

3. Configure environment variables:
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8080  # Ballerina WebSocket URL
RAPIDAPI_KEY=your-rapidapi-key-here    # Get from RapidAPI Judge0 API (Free)

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

# Terminal 2: Start backend
cd backend
npm run dev


#Terminal 3: Start Ballarina
cd backend
bal run services/websocket.bal
```


5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Features

- Real-time collaborative editing
- Multi-language code execution via Judge0 API
  - JavaScript (Node.js)
  - Python
  - Java
  - C++
- User authentication & authorization
- File saving and loading
- Syntax highlighting
- Active user presence
- Dark/Light theme support
- Real-time code execution
- Live output display
- Modern UI with Lucide icons

## Code Execution

The editor uses Judge0 RapidAPI for code execution:
- Sign up at [RapidAPI](https://rapidapi.com/)
- Subscribe to [Judge0 API](https://rapidapi.com/judge0-official/api/judge0-ce)
- Get your API key and add it to codeExecution.js file

Supported Languages and IDs:
```javascript
const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,    // Python 3
  java: 62,      // Java
  cpp: 54,       // C++
};
```

## Tech Stack

### Frontend
- Next.js
- React
- Monaco Editor (@monaco-editor/react)
- Socket.IO Client
- TailwindCSS
- Lucide React (for UI icons)
- Judge0 RapidAPI (code execution)

### Backend
- Node.js
- Express
- Ballerina (WebSocket service)
- Socket.IO
- MySQL
- JWT Authentication

### Services
- Ballerina WebSocket (User registration & real-time features)
- Judge0 RapidAPI (Code execution)
- Socket.IO (Real-time collaboration)

### UI Components
- Lucide React Icons
- Monaco Editor
- Custom Tailwind Components

### Development Tools
- XAMPP (MySQL)
- Nodemon
- ESLint

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Secure WebSocket connections
- Secure code execution via Judge0 API
- Input validation and sanitization

## Required API Keys

1. Judge0 RapidAPI:
   - Sign up at RapidAPI
   - Subscribe to Judge0 CE API
   - Copy API key to .env.local

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
