import express from "express";
import "express-async-errors";
import { json } from "body-parser";
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
    secure: process.env.NODE_ENV !== "test", // https only connection unless it's jest environment
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

export { app };
