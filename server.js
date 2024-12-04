const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let users = {}; // Список подключенных пользователей

app.use(express.static('public')); // Статические файлы в папке public

// WebSocket для общения в реальном времени
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'register') {
            users[data.username] = ws;
            console.log(`${data.username} connected`);
        } else if (data.type === 'message') {
            const recipient = users[data.to];
            if (recipient) {
                recipient.send(JSON.stringify({ from: data.from, message: data.message }));
            }
        }
    });

    ws.on('close', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
