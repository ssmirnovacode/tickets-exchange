import { Request, Response, Router } from "express";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@ticketsx/common";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { Order } from "../models/order";
import { baseUrl } from "../constants";
import { stripe } from "../stripe";

const router = Router();
router.post(
  baseUrl,
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId); //.populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Can not pay for cancelled order");
    }

    await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100, // converting into cents
      source: token, // stripe test token "tok_visa"
    });

    res.status(201).send({ success: true });
  }
);

export { router as newChargeRouter };
