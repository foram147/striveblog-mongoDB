import express from "express";
import userSchema from "./schemaAndModel.js";

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

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await userSchema.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
