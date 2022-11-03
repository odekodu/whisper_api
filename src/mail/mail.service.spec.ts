import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).to.exist;
  });
});
