export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  constructor(code: string, message: string, status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function errorHandler(err: any, req: any, res: any, next: any) {
  if (err instanceof AppError) {
    res.status(err.status).json({ code: err.code, message: err.message });
  } else {
    console.error(err);
    res
      .status(500)
      .json({
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      });
  }
}
