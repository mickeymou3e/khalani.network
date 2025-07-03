// import passport from "passport";
// import { Strategy as TwitterStrategy } from "passport-twitter";

// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: process.env.TWITTER_CONSUMER_KEY || "",
//       consumerSecret: process.env.TWITTER_CONSUMER_SECRET || "",
//       callbackURL: "http://localhost:3000/auth/twitter/callback",
//     },
//     (token, tokenSecret, profile, cb) => {
//       //save the profile data into user database
//       return cb(null, profile);
//     }
//   )
// );

// passport.serializeUser((user, cb) => {
//   cb(null, user);
// });

// passport.deserializeUser((obj, cb) => {
//   cb(null, obj as any);
// });
