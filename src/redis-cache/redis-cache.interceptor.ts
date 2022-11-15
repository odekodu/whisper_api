import { CacheInterceptor, CacheKey, CACHE_KEY_METADATA, ExecutionContext, Injectable } from '@nestjs/common';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { CacheFilter, CacheFilterKey } from '../decorators/cache-filter.decorator';
import { any } from 'joi';

@Injectable()
export class RedisCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    let cacheKey = this.reflector.get(CACHE_KEY_METADATA, context.getHandler());
    
    if (cacheKey) {
      const filter = this.reflector.get(CacheFilterKey, context.getHandler());              
      const request = context.switchToHttp().getRequest();
      
      cacheKey = `${cacheKey}-${ filter === 'token' ? `/${request.user._id}` : request._parsedUrl.path}`;            
      return cacheKey;
    }    

    return super.trackBy(context);
  }

  protected isRequestCacheable(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const request = http.getRequest();

    const filter = this.reflector.get(CacheFilterKey, context.getHandler());            
    const cache = !!filter && request.method === 'GET';            

    return cache;
  }

  getUser(user: any){
    console.log(user);
    
  }

}
