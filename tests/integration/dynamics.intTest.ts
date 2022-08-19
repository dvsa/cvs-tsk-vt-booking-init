import { Context } from 'aws-lambda';
import { handler } from '../../src/handler/dynamics';
import { mDynamicsEvent } from './resources/mDynamicsEvent';
import { mDynamicsFailedEvent } from './resources/mDynamicsFailedEvent';
import { mDynamicsRequest } from './resources/mDynamicsRequest';
import { mDynamicsInvalidRequest } from './resources/mDynamicsInvalidRequest';
import { mDynamicsFailedRequest } from './resources/mDynamicsFailedRequest';
import { mDynamicsMultipleRequest } from './resources/mDynamicsMultipleRequest';
import { PutEventsRequest } from 'aws-sdk/clients/eventbridge';

const context: Context = <Context>{};
const putEventsFn = jest.fn();
jest.mock('aws-sdk', () => ({
  EventBridge: jest.fn().mockImplementation(() => ({
    putEvents: jest.fn().mockImplementation((params: unknown) => {
      putEventsFn(params); // allows us to test the event payload
      if (
        (params as PutEventsRequest).Entries[0].Detail?.includes(
          '"name":"Error"',
        )
      ) {
        return {
          promise: jest
            .fn()
            .mockReturnValue(Promise.reject(new Error('Oh no!'))),
        };
      }
      return {
        promise: jest.fn(),
      };
    }),
  })),
}));

describe('Handler integration test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GIVEN all external resources are mocked WHEN called with valid request with 1 line item THEN the mocked data is transformed and pushed to EventBridge', async () => {
    const mockDate = new Date('2022-01-01');
    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as unknown as string);
    const result = await handler(mDynamicsRequest, context);

    expect(result).toEqual({
      statusCode: 201,
      body: 'Successfully sent 1 booking to EventBridge',
    });
    expect(putEventsFn).toHaveBeenCalledTimes(1);
    expect(putEventsFn).toHaveBeenNthCalledWith(1, mDynamicsEvent);
  });

  it('GIVEN all external resources are mocked WHEN called with valid request with 3 line item THEN the mocked data is transformed and pushed to EventBridge', async () => {
    const mockDate = new Date('2022-01-01');
    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as unknown as string);
    const result = await handler(mDynamicsMultipleRequest, context);

    expect(result).toEqual({
      statusCode: 201,
      body: 'Successfully sent 3 bookings to EventBridge',
    });
    expect(putEventsFn).toHaveBeenCalledTimes(3);
    expect(putEventsFn).toHaveBeenNthCalledWith(1, mDynamicsEvent);
    expect(putEventsFn).toHaveBeenNthCalledWith(2, mDynamicsEvent);
    expect(putEventsFn).toHaveBeenNthCalledWith(3, mDynamicsEvent);
  });

  it('GIVEN all external resources are mocked WHEN called with invalid request THEN return 400 bad request error and not push event to EventBridge', async () => {
    const mockDate = new Date('2022-01-01');
    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as unknown as string);
    const result = await handler(mDynamicsInvalidRequest, context);

    expect(result).toEqual({
      statusCode: 400,
      body: 'Received event failed validation: ValidationError: \"[0].name\" is required. \"[0].bookingDate\" is required. \"[0].vrm\" is required. \"[0].testCode\" is required. \"[0].testDate\" is required. \"[0].pNumber\" is required',
    });
    expect(putEventsFn).toHaveBeenCalledTimes(0);
  });

  it('GIVEN all external resources are mocked WHEN called with valid request but fail to push to EventBridge THEN return 500 bad request error', async () => {
    const mockDate = new Date('2022-01-01');
    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as unknown as string);
    const result = await handler(mDynamicsFailedRequest, context);

    expect(result).toEqual({
      statusCode: 500,
      body: 'Failed to send 1 booking to EventBridge, please see logs for details',
    });
    expect(putEventsFn).toHaveBeenCalledTimes(1);
    expect(putEventsFn).toHaveBeenNthCalledWith(1, mDynamicsFailedEvent);
  });
});
