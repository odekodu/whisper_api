import { SetMetadata } from "@nestjs/common";
import { RedisCacheKeys } from "../redis-cache/redis-cache.keys";

export const CacheClearKey = 'CacheClear'
export const CacheClear = (...keys: RedisCacheKeys[]) => SetMetadata(CacheClearKey, keys);