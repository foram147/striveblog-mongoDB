import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
});

userSchema.pre("save", async function (next) {
  const thisUser = this;
  const plainPassword = thisUser.password;
  if (thisUser.isModified("password")) {
    thisUser.password = await bcrypt.hash(plainPassword, 10);
  }
});

userSchema.methods.toJSON = function () {
  const userDocument = this;
  const userObjet = userDocument.toObject();
  delete userObjet.password;
  delete userObjet._v;
  delete userObjet.refreshToken;

  return userObjet;
};

userSchema.statics.checkCredentials = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
};
export default model("User", userSchema);
