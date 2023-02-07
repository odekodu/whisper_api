import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { QueueProducerService } from './queue.producer.service';

describe('QueueProducerService', () => {
  let service: QueueProducerService;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QueueProducerService],
    }).compile();

    service = module.get<QueueProducerService>(QueueProducerService);
  });

  it('should be defined', () => {
    expect(service).to.exist;
  });
});
