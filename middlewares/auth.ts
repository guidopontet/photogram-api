import { Response, NextFunction } from "express";
import Token from "../lib/token";

export const validateToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.get('x-token') || '';

  Token.validateToken(token)
    .then((decoded: any) => {
      req.user = decoded.user;
      next();
    })
    .catch(err => {
      res.json({
        ok: false,
        message: 'El token no es válido',
        err,
      });
    });
}
