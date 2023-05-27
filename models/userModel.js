import mongoose from "mongoose";
import Servant from "../servant";

const nextMonth = Servant.getNextMonth();

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  history: [
    {
      role: { type: String },
      content: { type: String },
    },
  ],
  tokens: {
    limit: { type: Number, default: 125000 },
    used: { type: Number, default: 0 },
    updAft: { type: Number, default: nextMonth },
  },
});

export default mongoose.model("users", userSchema);
