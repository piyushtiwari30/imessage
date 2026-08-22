// const express = require("express");
import express from "express";
import "dotenv/config";
import User from "./model/user.model.js"
import { connectDb } from "./lib/db.js";
import { clerkMiddleware } from '@clerk/express';
import cors from "cors";


const app=express();
const PORT=process.env.PORT;
const FRONTEND_URL=process.env.FRONTEND_URL;
app.use(express.json());// this allow as to parse the incomming data ,parse the json data comming form the client side
app.use(cors({origin:FRONTEND_URL,credentials:TRUE}))//ORIGIN WITH URL WILL MAKE THE PRETICULAR URL TO ACCES THE DATABBASE HERE ITS "FRONTEND_URL"
//AND credentials will make the client to send the cookies or auth header with the request.
app.use(clerkMiddleware());

app.get("/health",(req,res)=>{
    // const {messages,photo,video}=req.body ---->with helpof the app.use(express.json()); we can parse/destructure the data to serve.
    // req.auth ---->basically middleware is being used to check for the authentication for the reqest and then serve the responce
    res.status(200).json({ok:true});
});
app.listen(PORT,()=> {
    connectDb();
    console.log("server is up and running on port 3000",PORT)

});