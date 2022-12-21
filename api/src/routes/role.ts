import { Router, Response, NextFunction } from "express";
import { Models } from "../db";

const { Role } = Models;

const router = Router();

router.get("/", async (_, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(await Role.findAll());
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
