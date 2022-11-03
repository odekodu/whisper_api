import { CacheInterceptor, CACHE_KEY_METADATA, CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RedisCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    let cacheKey = this.reflector.get(CACHE_KEY_METADATA, context.getHandler());

    if (cacheKey) {
      const request = context.switchToHttp().getRequest();
      cacheKey = `${cacheKey}-${request._parsedUrl.path}`;
      
      return cacheKey;
    }    

    return super.trackBy(context);
  }

  protected isRequestCacheable(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const request = http.getRequest();

    const noCaching = this.reflector.get('noCaching', context.getHandler());        
    const cache = !noCaching && request.method === 'GET';    

    return cache;
  }
}
