import mongoose from "mongoose";

const userScheme = new mongoose.Schema({
  userId: { type: Number, unique: true },
  history: [
    {
      role: { type: String },
      content: { type: String },
    },
  ],
  usage: {
    limit: { type: Number, default: 16384 },
    used: { type: Number, default: 16384 },
    updAft: { type: Number },
  },
});
