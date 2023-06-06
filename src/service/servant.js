import defaultHistory from "../history/defaultHistory.js";
import roleModel from "../models/roleModel.js";
import dotenv from "dotenv";
dotenv.config();

class Servant {
  // creates a specified role
  static async createRole(roleName) {
    const role = await roleModel.findOne({ value: roleName });
    if (role) return role.value;

    const newRole = await roleModel.create({ value: roleName });
    console.log(newRole);
    return newRole.value;
  }

  // function to get sender's info
  static async extractSenderData(message) {
    let {
      from: { id, username, first_name },
    } = message;

    return {
      userId: id,
      username: username,
      first_name: first_name,
    };
  }

  // if we want to clear the history, we need to know, how much to delete
  static countElemsToDelete(histLength, defLength, preferableValue) {
    if (preferableValue < 0)
      throw new Error("Unable to delete this amount of elements");
    if (preferableValue == 0) return 1;

    if (histLength - preferableValue > defLength + 1) {
      return preferableValue;
    } else {
      Servant.countElemsToDelete(histLength, defLength, preferableValue - 2);
    }
  }

  // used to know, when to annul used tokens
  static getNextMonth() {
    let nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    nextMonth.setHours(0, 0, 0, 0);

    let timestamp = nextMonth.getTime();
    return timestamp;
  }

  static async shouldToast(message) {
    message = message.toLowerCase();

    const today = new Date();
    const targetDate = new Date(process.env.DATE);

    const dateMatches =
      today.getDate() === targetDate.getDate() &&
      today.getMonth() === targetDate.getMonth();
    const lineMatches = message.includes(process.env.PHRASE2);

    if (dateMatches && lineMatches) return true;

    return false;
  }

  static choosePhoto() {
    let photos = [
      "https://m.media-amazon.com/images/I/61ZaLwu3uiL._AC_UF1000,1000_QL80_.jpg",
      "https://cdn2.penguin.com.au/covers/original/9780718197858.jpg",
      "https://i.ytimg.com/vi/q1NMtVGz8eo/maxresdefault.jpg",
      "https://pbs.twimg.com/media/CaOyX6qUEAAHp3A.jpg",
    ];

    const randomPosition = Math.floor(Math.random() * photos.length);
    return photos[randomPosition];
  }
}

export default Servant;
