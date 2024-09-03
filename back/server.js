const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let messages = [];

const MAX_MESSAGES = 9;

const server = app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

wss.on("connection", (ws) => {
    console.log("Новое WebSocket соединение");
});

app.get("/messages", (req, res) => {
    res.json(messages);
});

app.post("/messages", (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Текст сообщения обязателен" });
    }

    const message = { id: Date.now(), text };

    messages.push(message);

    if (messages.length > MAX_MESSAGES) {
        const removedMessage = messages.shift();

        broadcast({ type: "message_removed", id: removedMessage.id });
    }

    broadcast({ type: "message_added", message });

    res.status(201).json(message);
});
