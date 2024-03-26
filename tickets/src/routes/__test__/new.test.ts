import request from "supertest";
import { app } from "../../app";

describe("/new", () => {
  it("has a route handler listening to /api/tickets for POST requests", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).not.toEqual(404);
  });

  it("can only be accessed if the user is authenticated", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it("returns an error if an invalid title is provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "", price: "10.05" })
      .expect(400);

    return await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ price: "10.05" })
      .expect(400);
  });

  it("returns an error if an invalid price is provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "foobar", price: "-10" })
      .expect(400);

    return await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "foobar" })
      .expect(400);
  });

  it("creates a tickets with valid parameters", async () => {
    // TODO add in a check to make sure the ticket was saved to DB
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title: "foobar", price: "10" })
      .expect(200);
  });
});
