import { HttpStatus } from "@nestjs/common";
import { Logger } from "../logger/logger";
import { ResponseSchema } from "../shared/response.schema";
import { Request, Response } from 'express';

export const resolveError = (req: Request, res: Response, error: { message: string, status: HttpStatus, name: string }) => {
  const timestamp = new Date().toLocaleDateString();
  
  const data = {
    success: false,
    timestamp,
    message: error.message
  } as ResponseSchema<Error>;  

  res.status(error.status).json(data);
  const logger = new Logger(error.name);
  logger.error({ reqId: (req as any).reqId, error: new Error(`${(req as any).method}:${(req as any).url} (${error.message})`)});
}

function a({}){

}