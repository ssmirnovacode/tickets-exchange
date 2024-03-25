import request from "supertest";
import { app } from "../../app";

const EMAIL = "test@test.es";
const PASSWORD = "password";

describe("api/users/signin", () => {
  it("returns 400 if user does not exist", async () => {
    return request(app)
      .post("/api/users/signin")
      .send({ email: "another@email.com", password: PASSWORD })
      .expect(400);
  });

  it("returns 400 if password is incorrect", async () => {
    return request(app)
      .post("/api/users/signin")
      .send({ email: EMAIL, password: "smthnotcorrect" })
      .expect(400);
  });

  it("returns a 200 on successful signin", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: EMAIL, password: PASSWORD })
      .expect(201);
    return request(app)
      .post("/api/users/signin")
      .send({ email: EMAIL, password: PASSWORD })
      .expect(200);
  });

  it("responds with a cookie on successful login", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: EMAIL, password: PASSWORD })
      .expect(201);
    const response = await request(app)
      .post("/api/users/signin")
      .send({ email: EMAIL, password: PASSWORD })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
