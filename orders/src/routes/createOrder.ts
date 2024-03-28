import { Request, Response, Router } from "express";
import { requireAuth, validateRequest } from "@ticketsx/common";
import { body } from "express-validator";
import { natsWrapper } from "../nats-wrapper";
import { baseUrl } from "../constants";

const router = Router();

router.post(baseUrl, async (rew: Request, res: Response) => {
  res.send({});
});

export { router as createOrderRouter };
