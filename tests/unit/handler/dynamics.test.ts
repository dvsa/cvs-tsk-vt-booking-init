import { Context } from 'aws-lambda';
import { handler } from '../../../src/handler/dynamics';
import { SendResponse } from '../../../src/interfaces/SendResponse';
import { sendBooking } from '../../../src/services/eventbridge';
import {
  mDynamicsRequest,
  mDynamicsInvalidRequest,
  mDynamicsInvalidRequest2,
  mDynamicsFailedRequest,
  mDynamicsEmptyBodyRequest,
  mDynamicsUnavailableRequest,
} from '../../integration/resources/mDynamicsRequests';

jest.mock('../../../src/services/eventbridge', () => ({
  sendBooking: jest
    .fn()
    .mockResolvedValueOnce(<SendResponse>{ SuccessCount: 1 })
    .mockResolvedValueOnce(<SendResponse>{ FailCount: 1 }),
}));

const context: Context = <Context>{};

describe('dynamics handler tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('receives empty body in request and returns 400 bad request', async () => {
    const result = await handler(mDynamicsEmptyBodyRequest, context);

    expect(sendBooking).toHaveBeenCalledTimes(0);

    expect(result).toEqual({
      statusCode: 400,
      body: 'No body in request',
    });
  });

  it('passes JSON object from valid dynamics request body to sendBooking method', async () => {
    const result = await handler(mDynamicsRequest, context);

    expect(sendBooking).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      statusCode: 201,
      body: 'Successfully sent 1 booking to EventBridge',
    });
  });

  it("receives body that doesn't contain array, return 400 bad request", async () => {
    const result = await handler(mDynamicsInvalidRequest2, context);

    expect(sendBooking).toHaveBeenCalledTimes(0);

    expect(result).toEqual({
      statusCode: 400,
      body: 'Received event failed validation: ValidationError: "value" must be an array',
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
      body: 'Received event failed validation: ValidationError: "[0].name" is required. "[0].bookingDate" is required. "[0].vrm" is required. "[0].testCode" is required. "[0].testDate" is required. "[0].pNumber" is required',
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

  it('receives non-POST request to /vt-booking endpoint, return 400 bad request', async () => {
    const result = await handler(mDynamicsUnavailableRequest, context);

    expect(sendBooking).toHaveBeenCalledTimes(0);

    expect(result).toEqual({
      statusCode: 400,
      body: 'Invalid path: GET NotAvailable',
    });
  });
});
