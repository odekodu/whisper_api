import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { ProfileController } from './profile.controller';

describe('ProfileController', () => {
  let controller: ProfileController;

  before(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).to.exist;
  });
});
