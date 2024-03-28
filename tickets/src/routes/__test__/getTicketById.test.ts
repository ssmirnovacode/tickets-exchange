import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

jest.mock("../../nats-wrapper");
describe("/api/tickets - GET one ticket", () => {
  it("returns 404 if ticket is not found", async () => {
    // generating 24 hex string id required for MongoDB:
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).send().expect(404);
  });

  it("returns the ticket if it is found", async () => {
    const title = "foobar";
    const price = 20;
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({ title, price })
      .expect(201);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send()
      .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
  });
});
