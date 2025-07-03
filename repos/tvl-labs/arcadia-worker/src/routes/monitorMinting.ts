import { Router, Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utils/errors";
import { createPendingDeposit } from "../services/depositService";
import { processDeposit } from "../services/processor";

const monitorRouter = Router();

monitorRouter.post(
  "/monitorMinting",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        userAddress,
        expectedBalance,
        tokenAddress,
        chainId,
        intent,
        intentSignature,
        depositTx,
      } = req.body as {
        userAddress: string;
        expectedBalance: string;
        tokenAddress: string;
        chainId: number;
        intent: any;
        intentSignature: string;
        depositTx: string;
      };

      if (
        !userAddress ||
        !expectedBalance ||
        !tokenAddress ||
        chainId == null ||
        !intent ||
        !intentSignature ||
        !depositTx
      ) {
        throw new AppError(
          "ERR_INVALID_PARAMS",
          "Missing required fields",
          400
        );
      }

      const depositId = uuidv4();
      await createPendingDeposit({
        id: depositId,
        userAddress,
        tokenAddress,
        amount: expectedBalance,
        depositTx,
        intent,
      });

      process.nextTick(() =>
        processDeposit(depositId, {
          userAddress,
          expectedBalance: BigInt(expectedBalance),
          tokenAddress,
          chainId,
          intent,
          intentSignature,
          depositTx,
        }).catch((err) => console.error("Background error:", err))
      );

      res.status(202).json({ depositId });
    } catch (err: any) {
      next(
        err instanceof AppError
          ? err
          : new AppError("INTERNAL_ERROR", err.message)
      );
    }
  }
);

export { monitorRouter };
