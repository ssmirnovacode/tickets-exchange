import request from "supertest";
import { app } from "../../app";

const EMAIL = "test@test.es";
const PASSWORD = "password";

describe("/api/users/signout", () => {
  it("clears the cookie after signing out", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: EMAIL, password: PASSWORD })
      .expect(201);
    const response = await request(app)
      .post("/api/users/signout")
      .send({})
      .expect(200);

    expect(response.get("Set-Cookie")?.[0]).toBe(
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });
});
