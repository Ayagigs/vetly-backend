import { StatusCodes } from "http-status-codes";
import HttpException from "../utils/exception";

/**
 * It takes a Zod schema and a path to a property on the request object, and returns a middleware
 * function that validates the request object property against the schema.
 * 
 * The middleware function is async, so it can be used with the async/await syntax.
 * 
 * The middleware function uses the Zod schema to validate the request object property. If the
 * validation fails, it throws a HttpException.
 * 
 * The HttpException is caught by the error handler middleware.
 * @param schema - The schema to validate against.
 * @param path - The path to the data you want to validate.
 */
const schemaValidator = 
    (
        schema,
        path
    ) => 
        async (req, _res, next) => {
            try {
                await schema.parseAsync(req[path]);
                return next();
            } catch (error) {
                next(
                    new HttpException(
                        StatusCodes.BAD_REQUEST,
                        error
                    )
                );
            }
        };

export default schemaValidator;