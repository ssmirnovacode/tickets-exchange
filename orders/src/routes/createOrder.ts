import { Request, Response, Router } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@ticketsx/common";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { EXPIRATION_SECONDS, baseUrl } from "../constants";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

const router = Router();

router.post(
  baseUrl,
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TiketId must be provided and be a valid Mongo ID"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Find the ticket by ticketId:
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure this ticket is not already reserved:
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved in another order");
    }

    // calculate the expiration time:
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

    // build the order and save it to the DB
    const order = Order.build({
      userId: req.currentUser!.id,
      ticket,
      expiresAt: expiration,
      status: OrderStatus.Created,
    });
    await order.save();

    const { id, status, userId, expiresAt, ticket: orderTicket } = order;

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id,
      status: status as OrderStatus.Created,
      expiresAt: expiresAt.toISOString(), // UTC time zone
      userId,
      ticket: {
        id: orderTicket.id,
        price: orderTicket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
