import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import io from "socket.io-client";

export default function CodeEditor() {
  const [value, setValue] = useState("// Start coding here");
  const [theme, setTheme] = useState("vs-dark");
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
      // Send user info when connected
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        newSocket.emit("userJoined", { userId: user.id, name: user.name });
      }
    });

    newSocket.on("codeChange", (newCode) => {
      setValue(newCode);
    });

    newSocket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });

    return () => newSocket.disconnect();
  }, []);

  const handleEditorChange = (newValue) => {
    setValue(newValue);
    if (socket) {
      socket.emit("codeChange", newValue);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "vs-dark" ? "light" : "vs-dark");
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="editor-controls">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === "vs-dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
          <div className="active-users">
            {activeUsers.map((user) => (
              <span key={user.userId} className="user-badge">
                {user.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          automaticLayout: true,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          cursorStyle: "line",
          folding: true,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
