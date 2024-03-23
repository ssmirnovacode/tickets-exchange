import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import {
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from "./routes";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true); // making express trust proxy traffic from ngnix as secure
app.use(json());
app.use(
  cookieSession({
    signed: false, // disabled encryption
    secure: true, // https only connection
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY env var must be defined");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("auth service is listening on port 3000");
  });
};

start();
