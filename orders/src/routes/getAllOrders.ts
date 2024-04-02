import { Request, Response, Router } from "express";
import { NotFoundError, requireAuth, validateRequest } from "@ticketsx/common";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { baseUrl } from "../constants";
import { Order } from "../models/order";

const router = Router();

router.get(baseUrl, requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    "ticket"
  );

  res.send(orders);
});

export { router as getAllOrdersRouter };
