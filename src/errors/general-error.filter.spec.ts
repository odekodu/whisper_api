import { expect } from 'chai';
import { GeneralErrorFilter } from './general-error.filter';

describe('GeneralErrorFilter', () => {
  it('should be defined', () => {
    expect(new GeneralErrorFilter()).to.exist;
  });
});
