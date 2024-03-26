import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import { errorHandler, NotFoundError, currentUser } from "@ticketsx/common";
import cookieSession from "cookie-session";
import { newTicketRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true); // making express trust proxy traffic from ngnix as secure
app.use(json());
app.use(
  cookieSession({
    signed: false, // disabled encryption
    secure: process.env.NODE_ENV !== "test", // https only connection unless it's jest environment
  })
);

app.use(currentUser);

app.use(newTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
