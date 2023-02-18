// import { NextFunction, Request, Response } from "express";
// import HttpException from "../utils/exception";
import { logger } from "../utils/logger";

const errorMiddleware = (
    error,
    req,
    res,
    next
) => {
    try {
        const status = error.status || 500;
        const message = error.message || "Something went wrong";

        logger.error(
            `[${req.method}] ${req.path}  >> status:: ${status}, message:: ${message}`
        );

        res.status(status).json({ message });
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;