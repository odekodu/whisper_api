import { expect } from 'chai';
import { LoggerInterceptor } from './logger.interceptor';

describe('LoggerInterceptor', () => {
  it('should be defined', () => {
    expect(new LoggerInterceptor()).to.exist;
  });
});
