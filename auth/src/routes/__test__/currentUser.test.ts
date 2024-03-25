import request from "supertest";
import { app } from "../../app";

const EMAIL = "test@test.es";
const PASSWORD = "password";

describe("/api/users/currentuser", () => {
  it("responds with current user data", async () => {
    const signupResponse = await request(app)
      .post("/api/users/signup")
      .send({ email: EMAIL, password: PASSWORD })
      .expect(201);

    const cookie = signupResponse.get("Set-Cookie")!;

    const response = await request(app)
      .get("/api/users/currentuser")
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual(EMAIL);
  });
});
