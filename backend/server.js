import { Server } from 'socket.io';
import express from "express";
import dotenv from "dotenv";
import http from 'http';
import cors from 'cors';

import Connection from './database/db.js';
import { getDocument, updateDocument } from './controller/document-controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

// Enable CORS
app.use(cors());

// Test route
app.get("/", (req, res) => {
    res.json("Hello");
});

// Database connection
Connection();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'https://task6-frontend.vercel.app',
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

io.on('connection', socket => {
    console.log("New client connected");

    socket.on('get-document', async documentId => {
        const document = await getDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document', document.data);

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        });

        socket.on('save-document', async data => {
            await updateDocument(documentId, data);
        });
    });

    socket.on('disconnect', () => {
        console.log("Client disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
