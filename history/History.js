import defaultHistory from "./defaultHistory.js";

class History {
  constructor(oldHistory = []) {
    this.history = [];
    this.setDefaultHistory(oldHistory);
    this.addLines(oldHistory);
  }

  // get methods

  get() {
    return this.history; // getting full history
  }

  getCropped() {
    const historyCopy = JSON.parse(JSON.stringify(this.history)); // deep copy of the history
    const chatHistory = historyCopy.slice(defaultHistory.length); // slicing the end
    return chatHistory; // returing only chat history without default messages
  }

  getLength() {
    return this.history.length;
  }

  // set methods

  async setDefaultHistory() {
    let history = [];

    for (let i = 0; i < defaultHistory.length; i++) {
      history.push(defaultHistory[i]);
    }

    this.history = history;
  }

  async addLines(oldHistory) {
    try {
      // there's no point to continue if it's empty
      if (oldHistory.length == 0) {
        console.log("The history is empty");
        return;
      }

      // validating all the messages
      for (let i = 0; i < oldHistory.length; i++) {
        this.validateLine(oldHistory[i]);
      }

      // updating the history after successful validation
      for (let i = 0; i < oldHistory.length; i++) {
        this.history.push(oldHistory[i]);
      }
    } catch (error) {
      console.log(error);

      console.log("Invalid line");

      console.log("Whole history:");
      console.log(oldHistory);
    }
  }

  addLine(line) {
    try {
      // validating and adding the line if it's ok
      this.validateLine(line);
      this.history.push(line);
    } catch (error) {
      console.log(error);

      console.log("Invalid line:");
      console.log(line);
    }
  }

  // removal methods

  deleteExtraLines(deleteCount) {
    this.history.splice(defaultHistory.length, deleteCount);
  }

  deleteLastLine() {
    this.history.pop();
  }

  // utility methods
  validateLine(line) {
    // here we're basicaly checking if the line is valid, you don't need to read that
    if (
      !(
        (line.role == "user" ||
          line.role == "assistant" ||
          line.role == "system") &&
        line.content
      )
    ) {
      throw new Error("Provided line wasn't valid!");
    }
  }
}

export default History;
