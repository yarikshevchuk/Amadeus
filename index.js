import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import Functions from "./functions.js";
dotenv.config();

const bot = new Telegraf(process.env.BOTTOKEN);

// clasic bot command
bot.command("start", async (ctx) => {
  Functions.start(ctx);
});

bot.on("message", async (ctx) => {
  Functions.messageResponse(ctx);
});

bot.launch();
