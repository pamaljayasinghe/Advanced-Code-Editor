import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import io from "socket.io-client";
import Header from "./Header";
import UsersPanel from "./UsersPanel";

export default function CodeEditor() {
  const [value, setValue] = useState("// Start coding here");
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [isUsersPanelCollapsed, setIsUsersPanelCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.className = savedTheme === "dark" ? "dark-theme" : "";

    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    if (currentUser) {
      newSocket.emit("userJoined", {
        id: newSocket.id,
        name: currentUser.name,
      });
    }

    newSocket.on("users", (connectedUsers) => {
      setUsers(connectedUsers);
    });

    newSocket.on("runResult", (result) => {
      setOutput(result.output);
      setIsRunning(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleEditorChange = (newValue) => {
    setValue(newValue);
    socket?.emit("codeChange", { code: newValue });
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("Running code...");
    socket?.emit("runCode", { code: value, language });
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme === "dark" ? "dark-theme" : "";
  };

  return (
    <div className="app-container">
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      <div className="main-content">
        <div className="editor-container">
          <div className="editor-workspace">
            <div className="editor-main">
              <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                value={value}
                theme={theme === "dark" ? "vs-dark" : "light"}
                onChange={handleEditorChange}
                options={{
                  fontSize: 14,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: "on",
                  lineNumbers: "on",
                  roundedSelection: true,
                  cursorStyle: "line",
                  padding: { top: 10, bottom: 10 },
                  folding: true,
                  tabSize: 2,
                }}
              />
            </div>

            <div className="output-panel">
              <div className="output-header">
                <span>Output</span>
                <button
                  className="run-button"
                  onClick={handleRunCode}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <span>Running...</span>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      Run Code
                    </>
                  )}
                </button>
              </div>
              <pre className="output-content">{output}</pre>
            </div>
          </div>

          <UsersPanel
            users={users}
            isCollapsed={isUsersPanelCollapsed}
            onToggle={() => setIsUsersPanelCollapsed(!isUsersPanelCollapsed)}
          />
        </div>
      </div>
    </div>
  );
}
