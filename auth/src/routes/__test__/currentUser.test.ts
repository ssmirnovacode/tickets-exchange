import request from "supertest";
import { app } from "../../app";

const EMAIL = "test@test.es";

describe("/api/users/currentuser", () => {
  it("responds with current user data", async () => {
    const cookie = await global.signin().catch((err) => console.log(err));

    const response = await request(app)
      .get("/api/users/currentuser")
      .set("Cookie", cookie!)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual(EMAIL);
  });

  it("responds with null if not authenticated", async () => {
    const response = await request(app)
      .get("/api/users/currentuser")
      .send()
      .expect(200);

    expect(response.body.currentUser).toEqual(null);
  });
});
