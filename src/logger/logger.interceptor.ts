import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Logger } from './logger';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp()?.getRequest();
    const now = Date.now();
    const handlerName = context.getHandler().name;
    const logger = new Logger(handlerName);

    return next.handle().pipe(
      tap(() => {
        if (process.env.NODE_ENV === 'development'){
          const message = `${request.method}:${request.url} (${Date.now() - now}ms)`;
          logger.info({reqId: request.reqId, message});
        }
      })
    );
  }
}
