import { Request, Response, NextFunction } from "express";
import { connect } from "../db";

export const attachDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dbConnection = await connect();
    req.db = dbConnection;
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).send("Database connection failed");
  }
};
