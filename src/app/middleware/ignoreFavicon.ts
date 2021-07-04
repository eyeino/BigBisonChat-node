import type { Request, Response, NextFunction } from "express";

export const ignoreFaviconMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.originalUrl === "/favicon.ico") {
    res.status(204).end();
  } else {
    next();
  }
};
