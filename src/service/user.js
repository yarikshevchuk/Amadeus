import userModel from "../models/userModel.js";
import roleModel from "../models/roleModel.js";
import Servant from "./servant.js";

class User {
  // get methods
  static async get(userId) {
    try {
      const user = await userModel.findOne({ userId: userId });
      if (!user) {
        return;
      }

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  static async checkUsage(userId) {
    try {
      const user = await User.get(userId);
      if (!user) return;

      return user.tokens.limit - user.tokens.used;
    } catch (error) {
      console.log(error);
    }
  }

  // create methods
  static async add(userData) {
    try {
      let user = await User.get(userData.userId);
      if (user) return user;

      const userRole = await roleModel.findOne({ value: "USER" });

      const newUser = await userModel.create({
        userId: userData.userId,
        username: userData.username,
        first_name: userData.first_name,
        history: "[]",
        roles: [userRole.value],
      });

      return newUser;
    } catch (error) {
      console.log(error);
    }
  }

  // update methods
  static async updateUsage(userId, value) {
    try {
      let user = await User.get(userId);
      if (!user) throw new Error("User wasn't found");

      const now = Date.now();
      const nextMonth = Servant.getNextMonth();

      if (now >= user.tokens.updAft) {
        user.tokens.updAft = nextMonth;
        user.tokens.used = 0;
      }

      user.tokens.used += value;
      await user.save();
    } catch (error) {
      console.log(error);
    }
  }

  static async updateHistory(userId, newHistory) {
    try {
      let user = await User.get(userId);
      if (!user) throw new Error("User wasn't found");

      user.history = JSON.stringify(newHistory);
      await user.save();
    } catch (error) {
      console.log(error);
    }
  }
}

export default User;
