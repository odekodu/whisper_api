import { CallHandler, ExecutionContext, Injectable, mixin, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { tap } from "rxjs";
import { CacheClearKey } from "../decorators/cache-clear.decorator";
import { RedisCacheKeys } from "./redis-cache.keys";
import { RedisCacheService } from "./redis-cache.service";

@Injectable()
export class RedisCacheClearInterceptor implements NestInterceptor {
    constructor(
        private readonly redisCacheService: RedisCacheService,
        private readonly reflector: Reflector
    ){}

    intercept(context: ExecutionContext, next: CallHandler<any>) {   
        const keys = this.reflector.get<RedisCacheKeys[]>(
            CacheClearKey,
            context.getHandler()
        ) ?? [];        

        return next.handle().pipe(
            tap(async() => Promise.all(keys.map(key => this.redisCacheService.del(key, true))))
        );
    }
}