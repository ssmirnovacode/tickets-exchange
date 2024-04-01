import { Request, Response, Router } from "express";
import { requireAuth, validateRequest } from "@ticketsx/common";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { baseUrl } from "../constants";
import mongoose from "mongoose";

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
  async (rew: Request, res: Response) => {
    res.send({});
  }
);

export { router as createOrderRouter };
