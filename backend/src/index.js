// const express = require("express");
import express from "express";
import "dotenv/config";
import User from "./model/user.model.js"
import { connectDb } from "./lib/db.js";
import { clerkMiddleware } from '@clerk/express';
import cors from "cors";

import fs from "fs";
import path from "path"
import job from "./lib/corn.js";

import clerkWebhook from "./webhooks/clerk.webhook.js"




const app=express();
const PORT=process.env.PORT;
const FRONTEND_URL=process.env.FRONTEND_URL;


const publicDir =path.join(process.cwd(),"public");

//it is impoertant that we dont parse the webhook in the event data, it should be in the raw formate
//we dont want to parse the comming data which the clerk send us , we want to keep in the raw fromate.
app.use("/api/webhook/clerk",express.raw({type:"application/json"}),clerkWebhook)

app.use(express.json());// this allow as to parse the incomming data ,parse the json data comming form the client side
app.use(cors({origin:FRONTEND_URL,credentials:true}))//ORIGIN WITH URL WILL MAKE THE PRETICULAR URL TO ACCES THE DATABBASE HERE ITS "FRONTEND_URL"
//AND credentials will make the client to send the cookies or auth header with the request.
app.use(clerkMiddleware());

app.get("/health",(req,res)=>{
    // const {messages,photo,video}=req.body ---->with helpof the app.use(express.json()); we can parse/destructure the data to serve.
    // req.auth ---->basically middleware is being used to check for the authentication for the reqest and then serve the responce
    res.status(200).json({ok:true});
});


//if the public directory exists, serve the static file
//this if for the production build
if (fs.existsSync(publicDir)){

    app.use(express.static(publicDir));
    app.get("/{*any}",(req,res,next)=>{
        res.sendFile(path.join(publicDir,"index.html"),(err)=>next(err));
    });
}

app.listen(PORT,()=> {
    connectDb();
    console.log("server is up and running on port 3000",PORT)

});

if(process.env.NODE_ENV === "production"){
    job.start();
}