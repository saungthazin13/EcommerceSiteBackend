import express, { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userId?: number;
}
export const getAllUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.userId;

  res.status(200).json({
    message: req.t("welcome"),
    currentuserId: id,
  });
};
