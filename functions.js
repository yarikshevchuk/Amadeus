import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import Servant from "./servant.js";
import defaultHistory from "./defaultHistory.js";
dotenv.config();

const configuration = new Configuration({ apiKey: process.env.GPTTOKEN });
const openai = new OpenAIApi(configuration);
const history = []; // in the future history must be extracted from user's file in DB

class Functions {
  static async start(ctx) {
    await Servant.setDefaultHistory(history);
    await ctx.reply("Ask me something");
  }
  static async messageResponse(ctx) {
    // part where we work with history
    if (history.length === 0) {
      await Servant.setDefaultHistory(history);
    }

    const user_input = ctx.message.text; // getting message from user
    const messages = []; // creating a new array that is sent as history to completion

    for (const line of history) {
      messages.push(line);
    } // extracting evertything from history to messages
    messages.push({ role: "user", content: user_input }); // here we add user's message that needs to be answered

    // the real shit starts there
    try {
      let completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.9,
        max_tokens: 128,
      }); // as its said, creating chat completion(assistant's response)

      const completion_text = completion.data.choices[0].message.content;
      await ctx.reply(completion_text);
      console.log(completion);
      // updating the hisotry
      history.push({ role: "user", content: user_input });
      history.push({ role: "assistant", content: completion_text });

      // we need to clear the past history if it exceeds 3000 tokens
      // that goes in order to prevent reaching the limit
      if (completion.data.usage.total_tokens > 2056) {
        const deleteCount = Servant.countElemsToDelete(
          history.length,
          defaultHistory.length,
          8
        );

        history.splice(defaultHistory.length, deleteCount);
        messages.splice(defaultHistory.length, deleteCount);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.error.code === "context_length_exceeded") {
          const deleteCount = Servant.countElemsToDelete(
            history.length,
            defaultHistory.length,
            8
          );

          history.splice(defaultHistory, deleteCount);
          messages.splice(defaultHistory, deleteCount);

          ctx.reply("Didn't hear you. Having problems repeating your message?");
        }
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  }
}

export default Functions;
