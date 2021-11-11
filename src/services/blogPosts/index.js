import express from "express";
import createHttpError from "http-errors";
import PostModel from "./schema.js";
import q2m from "query-to-mongo";

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
    const mongoQuery = q2m(req.query);
    console.log(mongoQuery);
    const { total, post } = await PostModel.findPostWithAuthor(mongoQuery);
    res.send({
      links: mongoQuery.links("/posts", total),
      pageTotal: Math.ceil(total / mongoQuery.options.limit),
      total,
      post,
    });
    // const posts = await PostModel.find();
    //res.send(posts);
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:postId", async (req, res, next) => {
  try {
    const id = req.params.postId;

    const post = await PostModel.findById(id);
    if (post) {
      res.send(post);
    } else {
      next(createHttpError(404, `user with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put("/:postId", async (req, res, next) => {
  try {
    const id = req.params.postId;
    const updatedPost = await PostModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (updatedPost) {
      res.send(updatedPost);
    } else {
      next(createHttpError(404, `post with id ${id} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const id = req.params.postId;
    const deletePost = await PostModel.findByIdAndDelete(id);
    if (deletePost) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `post with id ${postId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    console.log(req.params.postId);
    const getpost = await PostModel.findById(req.params.postId);
    if (getpost) {
      const newdata = { ...req.body };
      getpost.comments.push(newdata);
      await getpost.save();
      res.status(201).send(newdata);
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId);
    if (post) {
      res.send(post.comments);
    } else {
      next(createHttpError(404, `post not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
