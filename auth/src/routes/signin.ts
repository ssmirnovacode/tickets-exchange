import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares";

const router = express.Router();

router.post(
  "/api/users/signin",

  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required!"),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    const { email, password } = req.body;

    res.send("hi there signin");
  }
);

export { router as signinRouter };
