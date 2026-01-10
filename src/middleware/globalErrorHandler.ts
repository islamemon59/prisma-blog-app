import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;
  // PrismaClientValidationError
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provided incorrect field type or missing field";
  }
  // PrismaClientKnownRequestError
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage =
        "An operation failed because it depends on one or more records that were required but not found";
    } else if (err.code === "P2023") {
      statusCode = 400;
      errorMessage = "Inconsistent column data";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed on the field";
    }
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 500;
    errorMessage = "Response from the Engine was empty";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    if (err.message === "P1013") {
      statusCode = 400;
      errorMessage = "The provided database string is invalid";
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication failed. Please check your credentials";
    }
  }

  res.status(statusCode);
  res.json({ success: false, message: errorMessage, error: errorDetails });
}

export default errorHandler;
