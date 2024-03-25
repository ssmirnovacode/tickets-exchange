import request from "supertest";
import { app } from "../../app";

const EMAIL = "test@test.es";

describe("/api/users/currentuser", () => {
  it("responds with current user data", async () => {
    const cookie = await global.signin();

    const response = await request(app)
      .get("/api/users/currentuser")
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual(EMAIL);
  });
});
