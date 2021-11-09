import express from "express";
import createHttpError from "http-errors";
import PostModel from "./schema.js";

const blogsRouter = express.Router();

blogsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new PostModel(req.body);
    const { _id } = await newPost.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await PostModel.find();
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
