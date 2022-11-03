import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { resolveError } from './resolveError';

@Catch(MongoError)
export class MongoErrorFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    let api = host.switchToHttp();
    let request: Request,
      response: Response,
      message: string,
      status: number;

    if (api.getRequest()) {
      request = api.getRequest<Request>();
      response = api.getResponse<Response>();
    }

    if (exception.code === 11000) {
      const key = Object.keys((exception as any).keyValue)[0];
      message = `"${key}" is already in use`;
      status = HttpStatus.CONFLICT;
    }
        
    resolveError(request, response, { message, status, name: MongoError.name });
  }
}
