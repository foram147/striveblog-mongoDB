import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors";
import blogsRouter from "./services/blogPosts/index.js";
import authorRouter from "./services/authors/index.js";
import usersRouter from "./users/index.js";
import passport from "passport";
import GoogleStrategy from "./services/authorization/oauth.js";

passport.use("google", GoogleStrategy);
const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.use("/blogposts", blogsRouter);
server.use("/author", authorRouter);
server.use("/", usersRouter);
mongoose.connect(process.env.MONGO_CONNECT);

mongoose.connection.on("connected", () => {
  console.log("Mongo Connected!");
  server.listen(port, () => {
    console.table(listEndpoints(server));

    console.log(`server running on port ${port}`);
  });
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});
