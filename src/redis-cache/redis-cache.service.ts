import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { QueueService } from './../queue/queue.service';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private queueService: QueueService,
    private configService: ConfigService
  ){}

  async onModuleDestroy() {    
    this.queueService.serviceQueue.close();
  }

  async get<T = any>(key: string){
    return await this.cache.get<T>(key);
  }

  async set<T = any>(key: string, value: T, ttl = this.configService.get<number>('CACHE_TTL')){        
    return await this.cache.set<T>(key, value, { ttl });
  }

  async reset(){
    return await this.cache.reset();
  }

  async del(key: string, wildcard = false){
    if(wildcard) {
      const keys = await this.cache.store.keys(`${key}*`) as string[];
      return await Promise.all(keys.map(k => this.cache.del(k)));
    }
    return await this.cache.del(key);
  }

  async wrap(...args: any[]){
    return await this.cache.wrap(...args);
  }
}
