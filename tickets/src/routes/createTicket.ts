import { Request, Response, Router } from "express";
import { requireAuth, validateRequest } from "@ticketsx/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").not().isEmpty().withMessage("Price is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be > 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id }); // requireAuth makes sure currentUser is defined
    await ticket.save();
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
