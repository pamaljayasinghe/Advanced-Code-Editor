import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { initWebSocket } from "../lib/websocket";

export default function CodeEditor() {
  const editorRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const wsRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    // Initialize WebSocket connection
    wsRef.current = initWebSocket({
      onMessage: handleWsMessage,
      onUserUpdate: handleUserUpdate,
    });
  }

  const handleWsMessage = (message) => {
    if (message.type === "code_update" && editorRef.current) {
      const position = editorRef.current.getPosition();
      editorRef.current.setValue(message.content);
      editorRef.current.setPosition(position);
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
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// Start coding here"
        theme="vs-dark"
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
