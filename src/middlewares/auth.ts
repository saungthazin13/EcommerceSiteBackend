import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";

interface CustomRequst extends Request {
  userId?: number;
} //for typescript7rxcgv bm,l

export const auth = (req: CustomRequst, res: Response, next: NextFunction) => {
  const accessToken = req.cookies ? req.cookies.accessToken : null; //if not data for cookies in error
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (!refreshToken) {
    const error: any = new Error("Your are not an authenticated user.");
    error.status = 401;
    error.code = "Error-Unauthenticated";
    return next(error);
  }

  if (!accessToken) {
    const error: any = new Error("Access Token is Expired.");
    error.status = 401;
    error.code = "Error-access-token-expired";
    return next(error);
  }

  //verify access token
  let decoded;
  try {
    decoded = Jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
      id: number;
    };
  } catch (error: any) {
    if (error.name === "Token Expired Error") {
      error.message = "Access Token is Invalid";
      error.status = 401;
      error.code = "AccessTokenisExpired";
    } else {
      error.message = "Access Token is Invalid";
      error.status = 400;
      error.code = "Error Attack";
    }
    return next(error);
  }
  req.userId = decoded.id;
  next();
};
