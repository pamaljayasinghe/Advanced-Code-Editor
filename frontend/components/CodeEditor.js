import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { initWebSocket } from "../lib/websocket";

export default function CodeEditor() {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      monacoRef.current = monaco.editor.create(editorRef.current, {
        value: "// Start coding here\n",
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true,
      });

      // Initialize WebSocket connection
      wsRef.current = initWebSocket({
        onMessage: handleWsMessage,
        onUserUpdate: handleUserUpdate,
      });

      return () => {
        monacoRef.current.dispose();
        wsRef.current.close();
      };
    }
  }, []);

  const handleWsMessage = (message) => {
    if (message.type === "code_update") {
      const position = monacoRef.current.getPosition();
      monacoRef.current.setValue(message.content);
      monacoRef.current.setPosition(position);
    }
  };

  const handleUserUpdate = (users) => {
    setActiveUsers(users);
  };

  return (
    <div className="editor-wrapper">
      <div className="active-users">
        {activeUsers.map((user) => (
          <span key={user.id} className="user-badge">
            {user.name}
          </span>
        ))}
      </div>
      <div ref={editorRef} className="monaco-editor" />
    </div>
  );
}
