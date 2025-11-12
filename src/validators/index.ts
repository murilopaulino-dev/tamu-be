import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";

export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err: any) => ({
          path: err.path,
          message: err.msg
        }))
      });
    }
    next();
  };
};