import mongoose from "mongoose";
import request from "supertest";
import { STRIPE_TEST_TOKEN, baseUrl } from "../../constants";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@ticketsx/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

const createOrder = async (status: OrderStatus = OrderStatus.Created) => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status,
  });
  await order.save();

  return { order, userId };
};

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
    const { order, userId } = await createOrder();

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
    const { order, userId } = await createOrder(OrderStatus.Cancelled);

    await request(app)
      .post(baseUrl)
      .set("Cookie", global.signin(userId))
      .send({
        token: "smth",
        orderId: order.id,
      })
      .expect(400);
  });

  it("creates a charge with stripe and returns 201 with valid inputs", async () => {
    const { order, userId } = await createOrder();

    await request(app)
      .post(baseUrl)
      .set("Cookie", global.signin(userId))
      .send({
        token: STRIPE_TEST_TOKEN,
        orderId: order.id,
      })
      .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions).toEqual({
      currency: "usd",
      amount: order.price * 100,
      source: STRIPE_TEST_TOKEN,
    });

    const payment = await Payment.findOne({
      orderId: order.id,
      stripeId: "foo", // from the mock
    });

    expect(payment).not.toBeNull();
  });

  it("saves the payment", async () => {
    const { order, userId } = await createOrder();

    await request(app)
      .post(baseUrl)
      .set("Cookie", global.signin(userId))
      .send({
        token: STRIPE_TEST_TOKEN,
        orderId: order.id,
      })
      .expect(201);

    const payment = await Payment.findOne({
      orderId: order.id,
      stripeId: "foo", // from the mock
    });

    expect(payment).not.toBeNull();
  });
});
