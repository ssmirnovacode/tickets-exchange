import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares";
import { User } from "../models/user";
import { BadRequestError } from "../errors";
import { PasswordManager } from "../services/password-manager";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",

  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required!"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("User not found!");
    }

    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credencials");
    }

    // Generating JWT and storing it in session object:
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY! // TS is too cautious, we already checked it in index.ts
    );

    // redefining the session object for TS sake (instead of req.session.jwt = userJwt)
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
