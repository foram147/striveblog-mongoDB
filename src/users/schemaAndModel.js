import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  const thisUser = this;
  if (thisUser.isModified("password")) {
    thisUser.password = await bcrypt.hash(thisUser.password, 10);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const userDocument = this;
  const userObjet = userDocument.toObject();
  delete userObjet.password;

  return userObjet;
};

export default model("User", userSchema);
