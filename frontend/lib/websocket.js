export const initWebSocket = ({ onMessage, onUserUpdate }) => {
  const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);

  ws.onopen = () => {
    console.log("WebSocket connection established");
    const token = localStorage.getItem("token");
    ws.send(JSON.stringify({ type: "auth", token }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
      case "code_update":
        onMessage(data);
        break;
      case "user_update":
        onUserUpdate(data.users);
        break;
      default:
        console.log("Unknown message type:", data.type);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return ws;
};
