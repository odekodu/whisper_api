import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { RedisCacheService } from './redis-cache.service';

describe('RedisCacheService', () => {
  let service: RedisCacheService;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisCacheService],
    }).compile();

    service = module.get<RedisCacheService>(RedisCacheService);
  });

  it('should be defined', () => {
    expect(service).to.exist;
  });
});
