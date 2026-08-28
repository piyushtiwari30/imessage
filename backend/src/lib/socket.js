import { Socket } from "dgram";
import express from "express";
import http from "http";
import {Server } from "socket.io";

const app=express();
const server=http.createServer(app);

const allowedOrigin=process.env.FRONTEND_URL || "http://localhost:5173";
const io= new Server(server ,{cors:{origin:[allowedOrigin]}});

function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

//online user map={userId:socketId}
const userSocketMap={};

io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;

    console.log("USER CONNECTED:", userId);
    console.log("SOCKET ID:", socket.id);

    if(userId) userSocketMap[userId] = socket.id;

    console.log("USER SOCKET MAP:", userSocketMap);

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    // socket.on("disconnect",()=>{
    //     console.log("USER DISCONNECTED:", userId);

    //     if(userId) delete userSocketMap[userId];

    //     io.emit("getOnlineUsers",Object.keys(userSocketMap));
    // })
    socket.on("disconnect", () => {
     console.log("USER DISCONNECTED:", userId);
        
     // Only remove the user if this socket is still
     // the socket currently stored for that user.
     if (userId && userSocketMap[userId] === socket.id) {
         delete userSocketMap[userId];
     }
    
     console.log("USER SOCKET MAP AFTER DISCONNECT:", userSocketMap);
    
     io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})

export {app, server,io,getReceiverSocketId}