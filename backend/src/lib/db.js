import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
export async function connectDb(){
    try {
        const mongoUri=process.env.MONGO_URI;
        if(!mongoUri){
            throw new Error("Mongo uri is requried");
        }

        const conn=await mongoose.connect(mongoUri);
        console.log("mongoDB has been connected",conn.connection.host);
    } catch (error) {
        console.log("MongoDB connection not being made",error.message);
        process.exit(1)
        //1 means fail and 0 means successful.
    }
}