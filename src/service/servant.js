import defaultHistory from "../history/defaultHistory.js";
import roleModel from "../models/roleModel.js";

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
}

export default Servant;
