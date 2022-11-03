import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { QueueService } from './queue.service';

describe('QueueService', () => {
  let service: QueueService;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueService],
    }).compile();

    service = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(service).to.exist;
  });
});
