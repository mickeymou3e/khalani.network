// src/app.ts
import session from "express-session";
import passport from "passport";
import "./config/passport.setup";
import { attachDB } from "./middleware/attachDB";
import express from "express";
import taskRoutes from "./routes/taskRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(attachDB);
// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", taskRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World from Backend!");
});

app.get("/auth/twitter", passport.authenticate("twitter"));

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
