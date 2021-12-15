import createHttpError from "http-errors";
import JWT from "jsonwebtoken";
import userModel from "../users/userModel.js";

console.log(process.env.encryptionKey);
const generateAccesstoken = (payload) =>
  new Promise((resolve, reject) =>
    JWT.sign(
      payload,
      process.env.encryptionKey,
      { expiresIn: "15m" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      }
    )
  );

const generateRefreshToken = (payload) =>
  new Promise((resolve, reject) =>
    JWT.sign(
      payload,
      process.env.encryptionKey,
      { expiresIn: "1 week" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token);
      }
    )
  );

export const generateToken = async (user) => {
  const accessToken = await generateAccesstoken({ _id: user._id });
  const refereshToken = await generateRefreshToken({ _id: user._id });

  user.refereshToken = refereshToken;
  user.save();

  return { accessToken, refereshToken };
};

export const verifyAcessToken = (token) =>
  new Promise((res, rej) =>
    JWT.verify(token, process.env.encryptionKey, (error, decodedToken) => {
      if (error) rej(error);
      else res(decodedToken);
    })
  );

export const verifyRefereshToken = (token) =>
  new Promise((res, rej) =>
    JWT.verify(token, process.env.encryptionKey, (error, decodedToken) => {
      if (error) rej(error);
      else res(decodedToken);
    })
  );

export const verifyAndRegenerateToken = async (refereshToken) => {
  const decodedRefereshToken = await verifyRefereshToken(refereshToken);

  const user = await userModel.findById(decodedRefereshToken._id);

  if (!user) throw createHttpError(404, "User not found");

  if (user.refereshToken && user.refereshToken === refereshToken) {
    const { accessToken, refereshToken } = await generateToken(user);
    return { accessToken, refereshToken };
  } else throw createHttpError(401, "Referesh token not valid");
};
