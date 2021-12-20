import createHttpError from "http-errors";
import authorSchema from "../authors/schema.js";
import { verifyAcessToken } from "../../tools/JWT.js";

export const JWTtokenMiddleware = async (re, res, next) => {
  if (!requestAnimationFrame.headers.authorization) {
    next(createHttpError(401, "provide the token for authorization"));
  } else {
    try {
      const token = req.headers.authorization.replace("Bearer", "");

      const decodedToken = await verifyAcessToken(token);

      const author = await authorSchema.findById(decodedToken._id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(createHttpError(401, "user not found"));
      }
    } catch (error) {
      console.log(error);
      next(createHttpError("provide the credential"));
    }
  }
};
