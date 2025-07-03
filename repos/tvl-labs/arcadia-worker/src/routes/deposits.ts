import { Router, Request, Response, NextFunction } from "express";
import { listUserDeposits, getDepositById } from "../services/depositService";
import { AppError } from "../utils/errors";

const depositsRouter = Router();

depositsRouter.get(
  "/deposits",
  async (req: Request, res: Response, next: NextFunction) => {
    const userAddress = req.query.userAddress as string;
    const status = req.query.status as
      | "pending"
      | "error"
      | "success"
      | undefined;
    if (!userAddress)
      return next(
        new AppError("ERR_INVALID_PARAMS", "userAddress required", 400)
      );
    try {
      const items = await listUserDeposits(userAddress, status);
      res.json(items);
    } catch (err: any) {
      next(err);
    }
  }
);

depositsRouter.get(
  "/deposits/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rec = await getDepositById(req.params.id);
      if (!rec) throw new AppError("NOT_FOUND", "Deposit not found", 404);
      res.json(rec);
    } catch (err: any) {
      next(err);
    }
  }
);

export { depositsRouter };
