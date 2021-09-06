import { DEV_MODE } from "../config/index.js";
import Joi from "joi";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let reposneData = {
    message: "Internal Server Error",
    ...(DEV_MODE === "true" && {
      originalError: err.message,
    }),
  };

  // checking type of error
  if (err instanceof Joi.ValidationError) {
    statusCode = 422; // For validation errors
    reposneData = {
      message: err.message,
    };
  }

  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    reposneData = {
      message: err.message,
    };
  }

  return res.status(statusCode).send(reposneData);
};
export default errorHandler;
