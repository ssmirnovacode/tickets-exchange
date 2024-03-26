import { Request, Response, Router } from "express";
import { requireAuth, validateRequest } from "@ticketsx/common";
import { body } from "express-validator";

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
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export { router as newTicketRouter };
