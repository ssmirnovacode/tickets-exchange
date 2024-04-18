import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("testing github action");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY env var must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI env var must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("auth service is listening on port 3000");
  });
};

start();
