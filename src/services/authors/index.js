import express from "express";
import AuthorModel from "./schema.js";
import { basicAuthMiddleware } from "../authorization/auth.js";

const authorsRouter = express.Router();

authorsRouter.post("/", async (req, res, next) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newAuthor = await new AuthorModel({
      ...req.body,
      password: hashedPass,
    }).save();

    res.status(201).send(newAuthor);
  } catch (error) {
    next(error);
  }
});
authorsRouter.get("/", async (req, res, next) => {
  try {
    const author = await AuthorModel.find();
    res.send(author);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const id = req.params.authorId;
    const author = await AuthorModel.findById(id);
    if (author) {
      res.send(author);
    } else {
      next(createHttpError(`author with id ${req.params.authorId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const id = req.params.authorId;
    const updateAuthor = await AuthorModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updateAuthor) {
      res.send(updateAuthor);
    } else {
      next(createHttpError(`author with id ${req.params.authorId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const id = req.params.authorId;
    const deleteAuthor = await AuthorModel.findByIdAndDelete(id);
    if (deleteAuthor) {
      res.status(201).send();
    } else {
      next(createHttpError(`author with id ${req.params.authorId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
