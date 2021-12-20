import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import authorSchema from "../authors/schema.js";
import { tokenAuthenticate } from "../../tools/JWT.js";

const googleCloudStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}/authors/googleRedirect`,
  },
  async (accessToken, refereshToken, profile, passportNext) => {
    try {
      console.log("GOOGLE PROFILE: ", profile);
    } catch (error) {
      passportNext(error);
    }
  }
);
passport.serializeUser(function (data, passportNext) {
  passportNext(null, data);
});

export default googleCloudStrategy;
