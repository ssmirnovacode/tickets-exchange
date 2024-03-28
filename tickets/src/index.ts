import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY env var must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI env var must be defined");
  }

  try {
    await natsWrapper.connect(
      "ticketing",
      "randomString",
      "http://nats-srv:4222"
    );
    // graceful shut down
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("tickets service is listening on port 3000");
  });
};

start();
