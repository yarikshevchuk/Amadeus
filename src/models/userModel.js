import mongoose from "mongoose";
import Servant from "../service/servant.js";

const nextMonth = Servant.getNextMonth();

const userSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  username: { type: String },
  first_name: { type: String, default: "Okabe" },
  history: { type: String },
  tokens: {
    limit: { type: Number, default: 125000 },
    used: { type: Number, default: 0 },
    updAft: { type: Number, default: nextMonth },
  },
  roles: [{ type: String, ref: "roles" }],
});

export default mongoose.model("users", userSchema);
