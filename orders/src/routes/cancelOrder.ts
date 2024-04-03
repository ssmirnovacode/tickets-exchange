import { Request, Response, Router } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@ticketsx/common";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { baseUrl } from "../constants";
import { Order } from "../models/order";

const router = Router();

router.delete(
  `${baseUrl}/:id`,
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // TODO publish event order:cancelled

    res.status(204).send(order);
  }
);

export { router as cancelOrderRouter };
