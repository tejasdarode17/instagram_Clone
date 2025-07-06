import { Server } from 'socket.io'
import express from 'express'
import http from 'http'

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

const userSocketMap = {}

io.on('connection', (socket) => {
    const userID = socket.handshake.query.userID;
    if (userID) {
        userSocketMap[userID] = socket.id
        console.log(`${userID} ${socket.id}`);
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
    socket.on('disconnect', () => {
        if (userID) {
            delete userSocketMap[userID]
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})

export { io, server, app }  