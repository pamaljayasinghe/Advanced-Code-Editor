let ws = null;

export const initWebSocket = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token available for WebSocket");
    return null;
  }

  const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws`;
  console.log("Connecting to WebSocket:", wsUrl);

  try {
    ws = new WebSocket(wsUrl, [], {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    ws.onopen = () => {
      console.log("WebSocket connected successfully");
      // Send initial authentication
      ws.send(
        JSON.stringify({
          type: "auth",
          token: token,
        })
      );
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return ws;
  } catch (error) {
    console.error("Error creating WebSocket:", error);
    return null;
  }
};

export const closeWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};

export const sendMessage = (message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(JSON.stringify(message));
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
    }
  } else {
    console.error("WebSocket is not connected");
  }
};
