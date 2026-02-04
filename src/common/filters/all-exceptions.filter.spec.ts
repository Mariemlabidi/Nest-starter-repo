import { AllExceptionsFilter } from './all-exceptions.filter';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let json: jest.Mock;
  let status: jest.Mock;
  let response: any;
  let request: any;
  let host: any;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    json = jest.fn();
    status = jest.fn(() => ({ json }));
    response = { status };
    request = { url: '/test-path' };
    host = {
      switchToHttp: () => ({
        getResponse: () => response,
        getRequest: () => request,
      }),
    } as any;
  });

  it('formats HttpException responses', () => {
    const ex = new HttpException('Not found', HttpStatus.NOT_FOUND);
    filter.catch(ex, host);

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: HttpStatus.NOT_FOUND,
      path: '/test-path',
      message: 'Not found',
    }));
  });

  it('formats generic Error as 500', () => {
    const ex = new Error('boom');
    filter.catch(ex, host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      path: '/test-path',
      message: 'boom',
    }));
  });
});
