import { SetMetadata } from "@nestjs/common";

export const CacheFilterKey = 'CacheFilter'
export const CacheFilter = (type = null) => SetMetadata(CacheFilterKey, type);