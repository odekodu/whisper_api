import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheKeys } from '../redis-cache/redis-cache.keys';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class LimitRequestsGuard implements CanActivate {

  constructor(
    private readonly redisCacheService: RedisCacheService,
    private readonly configService: ConfigService
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { url } = request;
          
    const count = (await this.redisCacheService.get<number>(`${RedisCacheKeys.LIMIT_REQUESTS}:${url}`)) || 0;    
    const limit = this.configService.get<number>('REQUEST_LIMIT');

    if (count >= limit) {
      throw new HttpException('Too many request, please try again in 5mins', HttpStatus.TOO_MANY_REQUESTS);
    }

    await this.redisCacheService.set(`${RedisCacheKeys.LIMIT_REQUESTS}:${url}`, count + 1, 5 * 60);
    return true;
  }
}
