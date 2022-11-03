import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { resolveError } from './resolveError';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  
  catch(exception: HttpException, host: ArgumentsHost) {
    let api = host.switchToHttp();
    let request: any,
        response: any,
        message = this.getMessage(exception),
        status = this.getStatus(exception);    

    if (api.getRequest()) {
      request = api.getRequest();
      response = api.getResponse();
    }

    resolveError(request, response, { message, status, name: HttpErrorFilter.name });
  }

  private getMessage(exception: HttpException){
    let message = 'Internal Server Error';

    if (exception.getResponse) {
      const exceptionResponse = exception.getResponse();
      message = exceptionResponse instanceof Object ? (exceptionResponse as any).message : exceptionResponse;
    }    
    
    return message;
  }

  private getStatus(exception: HttpException){
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception.getStatus) {
      status = exception.getStatus();
    }

    return status;
  }
}
