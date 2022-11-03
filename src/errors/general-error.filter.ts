import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { resolveError } from './resolveError';

@Catch()
export class GeneralErrorFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    let api = host.switchToHttp();
    let request: Request,
      response: Response,
      message = 'Internal Server ERROR',
      status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (api.getRequest()) {
      request = api.getResponse<Request>();
      response = api.getResponse<Response>();
    }

    console.log(exception);
    

    resolveError(request, response, { message, status, name: MongoError.name });
  }
}
