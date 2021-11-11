import mongoose from "mongoose";

const { Schema, model } = mongoose;
const authorSchema = new Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
export default model("author", authorSchema);
