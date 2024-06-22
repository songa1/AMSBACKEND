import express from "express";
import route from "./Routers";
import bodyParser from "body-parser";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", route);

const server = app.listen(PORT, () =>
  console.log("Server is running on port " + PORT)
);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  // Listen for messages from the client
  ws.on("message", (message) => {
    console.log("Received message:", message);

    // Echo the received message back to the client
    ws.send(`Server received: ${message}`);
  });

  // Handle WebSocket connection close
  ws.on("close", () => {
    console.log("Client disconnected");
  });

  // Handle WebSocket errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

export default app;
