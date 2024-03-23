import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.es", password: "password" })
    .expect(201);
});

it("returns a 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "testtest.es", password: "password" })
    .expect(400);
});

it("returns a 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "tes@ttest.es", password: "p" })
    .expect(400);
});

it("returns a 400 with missing params", async () => {
  await request(app) // await is used to make sure the first request completes before starting the next one
    .post("/api/users/signup")
    .send({ email: "smth@mail.com" })
    .expect(400);
  return request(app).post("/api/users/signup").send({}).expect(400);
});
