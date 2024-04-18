import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const EMAIL = "test@test.es";

declare global {
  var signin: () => string;
}

jest.mock("../nats-wrapper");

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_key = "whatever"; // we do this to mock env variables that isnt accessible to jest

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
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
global.signin = () => {
  // build a JWT payload { id, email }
  const payload = {
    // we will randomly generate the id to pretend we are a different user on each signup:
    id: new mongoose.Types.ObjectId().toHexString(),
    email: EMAIL,
  };

  // create a JWT token
  const token = jwt.sign(payload, `${process.env.JWT_KEY!}`);

  // build session object { jwt: token }
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  console.log(session);
  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // add session= string upfront to match the cookie pattern and return it

  return `session=${base64}`;
};
