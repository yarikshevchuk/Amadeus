import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import Servant from "./servant.js";
import History from "./history/History.js";
dotenv.config();

const configuration = new Configuration({ apiKey: process.env.GPTTOKEN });
const openai = new OpenAIApi(configuration);
// const history = []; // in the future history must be extracted from user's file in DB

const history = new History(); // creating the history

class Functions {
  static async start(ctx) {
    history.setDefaultHistory();
    await ctx.reply("Ask me something");
  }

  static async messageResponse(ctx) {
    const user_input = ctx.message.text; // getting message from user
    const messages = []; // creating a new array that is sent as history to completion

    history.addLine({ role: "user", content: user_input });

    // the real shit starts here
    try {
      let completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: history.get(),
        temperature: 0.9,
        max_tokens: 128,
      }); // as its said, creating chat completion(assistant's response)

      const completion_text = completion.data.choices[0].message.content;
      await ctx.reply(completion_text);

      // updating the hisotry
      history.addLine({ role: "user", content: user_input });
      history.addLine({ role: "assistant", content: completion_text });

      // we need to clear the past history if it exceeds 3000 tokens
      // that goes in order to prevent reaching the limit
      if (completion.data.usage.total_tokens > 2056) {
        const deleteCount = Servant.countElemsToDelete(
          history.getLength(),
          defaultHistory.length,
          8
        );

        history.deleteExtraLines(deleteCount);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.error.code === "context_length_exceeded") {
          const deleteCount = Servant.countElemsToDelete(
            history.getLength(),
            defaultHistory.length,
            8
          );

          history.deleteExtraLines(deleteCount);

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
