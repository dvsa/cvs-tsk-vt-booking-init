import { Context } from 'aws-lambda';
import { handler } from '../../../src/handler/dynamics';
import { ISendResponse } from '../../../src/interfaces/ISendResponse';
import { sendBooking } from '../../../src/services/eventbridge';
import { mDynamicsInvalidRequest } from '../../integration/resources/mDynamicsInvalidRequest';
import { mDynamicsRequest } from '../../integration/resources/mDynamicsRequest';
import { mDynamicsFailedRequest } from '../../integration/resources/mDynamicsFailedRequest';

jest.mock('../../../src/services/eventbridge', () => ({
  sendBooking: jest
    .fn()
    .mockResolvedValueOnce(<ISendResponse>{})
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
      body: 'Successfully sent booking to EventBridge',
    });
  });

  it('receives invalid JSON body and does not send event to eventbridge', async () => {
    jest.mock('../../../src/services/validateTestBooking', () => ({
      validateTestBooking: jest.fn().mockRejectedValueOnce(new Error()),
    }));

    const result = await handler(mDynamicsInvalidRequest, context);

    expect(sendBooking).toHaveBeenCalledTimes(0);

    expect(result).toEqual({
      statusCode: 400,
      body: 'Received event failed validation: ValidationError: "name" is required. "bookingDate" is required. "vrm" is required. "testCode" is required. "testDate" is required. "pNumber" is required',
    });
  });

  it('receives valid JSON body BUT fails to send event to eventbridge', async () => {
    const result = await handler(mDynamicsFailedRequest, context);

    expect(sendBooking).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      statusCode: 500,
      body: 'Failed to send booking to EventBridge, please see logs for details',
    });
  });
});
