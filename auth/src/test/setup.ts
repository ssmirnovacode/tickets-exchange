import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

const EMAIL = "test@test.es";
const PASSWORD = "password";
declare global {
  var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_key = "whatever"; // we do this to mock env variables that isnt accessible to jest

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// declaring a global just for convenience
//NB! it will only be available in test environment
global.signin = async () => {
  const email = EMAIL;
  const password = PASSWORD;
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);
  console.log("response", response);
  const cookie = response.get("Set-Cookie")!;
  console.log("cookie", cookie);
  return cookie;
};
