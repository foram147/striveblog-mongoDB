import express from "express";
import AuthorModel from "./schema.js";
import { basicAuthMiddleware } from "../authorization/auth.js";
import passport from "passport";
import postSchema from "../blogPosts/schema.js";
import { generateToken } from "../../tools/JWT.js";
import { JWTtokenMiddleware } from "../authorization/token.js";
const authorsRouter = express.Router();

authorsRouter.post("/register", async (req, res, next) => {
  try {
    /*const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newAuthor = await new AuthorModel({
      ...req.body,
      password: hashedPass,
    }).save();

    res.status(201).send(newAuthor);*/

    const newAuthor = await new AuthorModel(req.body);
    const { _id } = await newAuthor.save();
    res.send({ _id });
  } catch (error) {
    next(error);
  }
});
authorsRouter.get("/register", JWTtokenMiddleware, async (req, res, next) => {
  try {
    const author = await AuthorModel.find();
    res.send(author);
  } catch (error) {
    next(error);
  }
});

//login with google
authorsRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authorsRouter.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      console.log("TOKEN:", req.author.tokens);
      res.redirect(
        `${process.env.FE_URL}?accessToken=${req.author.tokens.accessToken}&refreshToken=${req.author.token.referenceToken}`
      );
    } catch (error) {}
  }
);

authorsRouter.get("/me", JWTtokenMiddleware, async (req, res, next) => {
  try {
    res.send(req.author);
  } catch (error) {
    next(error);
  }
});
authorsRouter.put("/me", JWTtokenMiddleware, async (req, res, next) => {
  try {
    req.author.name = req.body;
    await req.author.save();
    res.send();
  } catch (error) {
    next(error);
  }
});
authorsRouter.delete("/me", JWTtokenMiddleware, async (req, res, next) => {
  try {
    await req.author.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/me/stories", JWTtokenMiddleware, async (req, res, next) => {
  try {
    const posts = await blogModel.find({ author: req.author._id.toString() });
    res.status(200).send(posts);
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
