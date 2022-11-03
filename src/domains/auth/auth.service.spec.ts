import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).to.exist;
  });
});
