import { Context } from 'aws-lambda';
import { handler } from '../../../src/handler/dynamics';
import { ISendResponse } from '../../../src/interfaces/ISendResponse';
import { sendBooking } from '../../../src/services/eventbridge';
import { mDynamicsInvalidRequest } from '../../integration/resources/mDynamicsInvalidRequest';
import { mDynamicsInvalidRequest2 } from '../../integration/resources/mDynamicsInvalidRequest2';
import { mDynamicsRequest } from '../../integration/resources/mDynamicsRequest';
import { mDynamicsFailedRequest } from '../../integration/resources/mDynamicsFailedRequest';

jest.mock('../../../src/services/eventbridge', () => ({
  sendBooking: jest
    .fn()
    .mockResolvedValueOnce(<ISendResponse>{ SuccessCount: 1 })
    .mockResolvedValueOnce(<ISendResponse>{ FailCount: 1 }),
}));

const context: Context = <Context>{};

describe('dynamics handler tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes JSON object from valid dynamics request body to sendBooking method', async () => {
    const result = await handler(mDynamicsRequest, context);

    expect(sendBooking).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      statusCode: 201,
      body: 'Successfully sent 1 booking to EventBridge',
    });
  });

  it('receives body that doesn\'t contain array, return 400 bad request', async () => {
    const result = await handler(mDynamicsInvalidRequest2, context);

    expect(sendBooking).toHaveBeenCalledTimes(0);

    expect(result).toEqual({
      statusCode: 400,
      body: 'Line items must come in form of array',
    });
  });

  it('receives invalid JSON in array, return 400 bad request', async () => {
    jest.mock('../../../src/services/validateTestBooking', () => ({
      validateTestBooking: jest.fn().mockRejectedValueOnce(new Error()),
    }));

    const result = await handler(mDynamicsInvalidRequest, context);

    expect(sendBooking).toHaveBeenCalledTimes(0);

    expect(result).toEqual({
      statusCode: 400,
      body: 'Following line items failed validation [{}]',
    });
  });

  it('receives valid JSON in array BUT fails to send event to eventbridge, return 500 internal server error', async () => {
    const result = await handler(mDynamicsFailedRequest, context);

    expect(sendBooking).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      statusCode: 500,
      body: 'Failed to send 1 booking to EventBridge, please see logs for details',
    });
  });
});
