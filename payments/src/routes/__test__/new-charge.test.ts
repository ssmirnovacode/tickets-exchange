import mongoose from "mongoose";
import request from "supertest";
import { baseUrl } from "../../constants";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@ticketsx/common";

describe("new charge", () => {
  it("throws an error if user is not authenticated", async () => {
    await request(app).post(baseUrl).send({}).expect(401);
  });

  it("throws an error if body params are missing", async () => {
    await request(app)
      .post(baseUrl)
      .set("Cookie", global.signin())
      .send({})
      .expect(400);
  });

  it("throws a not found error if order doesnt exist", async () => {
    await request(app)
      .post(baseUrl)
      .set("Cookie", global.signin())
      .send({
        token: "smth",
        orderId: new mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404);
  });

  it("throws a not authorized error if the order doesn not belong to current user", async () => {
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      price: 20,
      status: OrderStatus.Created,
    });
    await order.save();

    await request(app)
      .post(baseUrl)
      .set("Cookie", global.signin())
      .send({
        token: "smth",
        orderId: order.id,
      })
      .expect(401);
  });

  it("throws a bad request error if the order was already cancelled", async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await request(app)
      .post(baseUrl)
      .set("Cookie", global.signin(userId))
      .send({
        token: "smth",
        orderId: order.id,
      })
      .expect(400);
  });
});
