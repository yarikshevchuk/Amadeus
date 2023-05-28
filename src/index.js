import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import Functions from "./service/functions.js";
import mongoose from "mongoose";
dotenv.config();

const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO); // connecting to the database
    console.log("Connected to DB");
  } catch (error) {
    console.log("Failed to connect to MongoDB", error);
  }
};

const bot = new Telegraf(process.env.BOTTOKEN);

// clasic bot command
bot.command("start", async (ctx) => {
  Functions.start(ctx);
});

// bot.command("create_role", async (ctx) => {
//   Functions.createRole(ctx);
// });

bot.on("message", async (ctx) => {
  Functions.messageResponse(ctx);
});

bot.launch();
connectDB();
