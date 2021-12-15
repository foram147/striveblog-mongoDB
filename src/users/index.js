import express from "express";
import userSchema from "./userModel.js";
import { generateToken } from "../tools/JWT.js";
import createHttpError from "http-errors";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new userSchema(req.body);
    const { _id } = await newUser.save();
    res.send({ _id });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const user = await userSchema(req.body);
    if (user) {
      const { accessToken, refereshToken } = await generateToken(user);
      res.send({ accessToken, refereshToken });
    } else {
      next(createHttpError(401, "wrong credentials"));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await userSchema.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
