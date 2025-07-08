const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

app.use(express.static(path.join(__dirname, "public")));

wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("Client connected");

  ws.on("message", (msg) => {
    try {
      const json = JSON.parse(msg);
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(json));
        }
      });
    } catch (e) {
      console.error("Bad JSON:", msg);
    }
  });

  ws.on("close", () => {
    clients = clients.filter((c) => c !== ws);
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
