import { expect } from 'chai';
import { MongoErrorFilter } from './mongo-error.filter';

describe('MongoErrorFilter', () => {
  it('should be defined', () => {
    expect(new MongoErrorFilter()).to.exist;
  });
});
