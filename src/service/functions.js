import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import Servant from "./servant.js";
import History from "../history/History.js";
import User from "./user.js";
import defaultHistory from "../history/defaultHistory.js";
dotenv.config();

const configuration = new Configuration({ apiKey: process.env.GPTTOKEN });
const openai = new OpenAIApi(configuration);

class Functions {
  // start command
  static async start(ctx) {
    // getting user's data
    const userData = await Servant.extractSenderData(ctx.message);

    // creating the user if he wasn't created
    const user = await User.add(userData);

    // creating the history
    const history = new History();
    await User.updateHistory(user.userId, history.getCropped());

    await ctx.reply("Ask me something");
  }

  // command to work with messages
  static async messageResponse(ctx) {
    try {
      // getting user's data
      const userData = await Servant.extractSenderData(ctx.message);

      // creating the user if he wasn't created
      const user = await User.add(userData);

      // creating the history
      const history = new History();
      history.setDefaultHistory();

      const storedHistory = JSON.parse(user.history);
      await history.addLines(storedHistory); // adding stored history

      const user_input = ctx.message.text; // getting new message from the user
      history.addLine({ role: "user", content: user_input }); // adding this message to the history

      const tokensLeft = await User.checkUsage(user.userId);
      const max_tokens = tokensLeft > 128 ? 128 : tokensLeft;

      if (tokensLeft <= 0) return ctx.reply("Montly limit was reached"); // so sad, but you need to pay

      // the real shit starts here
      let completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: history.get(),
        temperature: 0.9,
        max_tokens: max_tokens,
      }); // as its said, creating chat completion(assistant's response)

      const completion_text = completion.data.choices[0].message.content;
      await ctx.reply(completion_text);
      console.log(completion.data);
      // updating usage
      await User.updateUsage(user.userId, completion.data.usage.total_tokens);

      // updating the hisotry
      history.addLine({ role: "assistant", content: completion_text });

      // we need to clear the past history if it exceeds 3000 tokens
      // that goes in order to prevent reaching the limit
      if (completion.data.usage.total_tokens > 2096) {
        console.log("HEEEEY");
        await history.deleteExtraLines();
      }

      // updating the history in the database
      await User.updateHistory(user.userId, history.getCropped());
    } catch (error) {
      if (error.response) {
        if (error.response.data.error.code === "context_length_exceeded") {
          history.deleteExtraLines();

          ctx.reply("Didn't hear you. Having problems repeating your message?");
        }
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  }

  // create Role
  // static async createRole(ctx) {
  //   const role = await Servant.createRole("ABUSER");
  //   ctx.reply(`You've got a new role, it's ${role}`);
  // }
}

export default Functions;
