import { Server } from 'socket.io';
import express from "express";
import dotenv from "dotenv";

import Connection from './database/db.js';

import { getDocument, updateDocument } from './controller/document-controller.js'

const app = express();
const PORT = process.env.PORT || 9000;
dotenv.config();
app.use(cors());

Connection();

const io = new Server(PORT, {
    cors: {
        origin: 'https://task6-frontend.vercel.app',
        methods: ['GET', 'POST'],
        credentials:true,
    }
});

io.on('connection', socket => {
    socket.on('get-document', async documentId => {
        const document = await getDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document', document.data);

        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        })

        socket.on('save-document', async data => {
            await updateDocument(documentId, data);
        })
    })
});
