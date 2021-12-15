import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorSchema = new Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "User", enum: ["User", "Admin"] },
  },
  {
    timestamps: true,
  }
);

authorSchema.method.toJSON = function () {
  const authorDocument = this;
  const authorObject = authorDocument.toObject();
  delete authorObject.password;
  delete authorObject._v;
  return authorObject;
};

export default model("author", authorSchema);
