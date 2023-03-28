import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import { Telegraf, Scenes } from "telegraf";
import defaultHistory from "./defaultHistory.js";
dotenv.config();

const bot = new Telegraf(process.env.BOTTOKEN);
const configuration = new Configuration({ apiKey: process.env.GPTTOKEN });
const openai = new OpenAIApi(configuration);

const history = [];

async function setDefaultHistory() {
  history.length = 0;
  for (let i = 0; i < defaultHistory.length; i++) {
    history.push(defaultHistory[i]);
  }
  console.log(history);
}

bot.command("start", async (ctx) => {
  await setDefaultHistory();
  await ctx.reply("Ask me something");
  console.log(history);
});

bot.on("message", async (ctx) => {
  if (history.length === 0) {
    await setDefaultHistory();
  }
  const user_input = ctx.message.text;

  const messages = [];
  for (const [input_text, completion_text] of history) {
    messages.push({ role: "user", content: input_text });
    messages.push({ role: "assistant", content: completion_text });
  }

  messages.push({ role: "user", content: user_input });

  try {
    let completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    if (completion.data.usage.total_tokens > 3000) {
      const deleteCount = 3 > history.length - 3 ? 3 : history.length - 3;
      history.splice(2, deleteCount);
      messages.splice(2, deleteCount);

      completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      });
    }

    const completion_text = completion.data.choices[0].message.content;
    await ctx.reply(completion_text);

    history.push([user_input, completion_text]);

    console.log(`User: ${user_input}`);
    console.log(`Amadeus: ${completion_text}`);
    console.log(".__________________________.");
  } catch (error) {
    if (error.response) {
      if (error.response.data.error.code === "context_length_exceeded") {
        const deleteCount = 3 > history.length - 3 ? 3 : history.length - 3;
        history.splice(2, deleteCount);
        messages.splice(2, deleteCount);

        ctx.reply("Sorry, can you send your message once again?");
      }
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
});

bot.launch();
