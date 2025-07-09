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
//all the online users will be stored here in key value format with his id 


//this is for the realtime chat used in message Controller 
function getRecevierSocketID(receiverID) {
    return userSocketMap[receiverID]
}

io.on('connection', (socket) => {
    const userID = socket.handshake.query.userID;
    if (userID) {
        userSocketMap[userID] = socket.id
    }

    //event passing all the data of users to all the users in frontend 
    io.emit('getOnlineUsers', Object.keys(userSocketMap))   
    
    socket.on('disconnect', () => {
        if (userID) {
            delete userSocketMap[userID]
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})

export { io, server, app  , getRecevierSocketID}      