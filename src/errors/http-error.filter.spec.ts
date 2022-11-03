import { expect } from 'chai';
import { HttpErrorFilter } from './http-error.filter';

describe('HttpErrorFilter', () => {
  it('should be defined', () => {
    expect(new HttpErrorFilter()).to.exist;
  });
});
