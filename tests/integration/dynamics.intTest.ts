import { Context } from 'aws-lambda';
//import MockDate from 'mockdate';
import { handler } from '../../src/handler/dynamics';
import { mDynamicsEvent } from './resources/mDynamicsEvent';
import { mDynamicsFailedEvent } from './resources/mDynamicsFailedEvent';
import { mDynamicsRequest } from './resources/mDynamicsRequest';
import { mDynamicsInvalidRequest } from './resources/mDynamicsInvalidRequest';
import { mDynamicsFailedRequest } from './resources/mDynamicsFailedRequest';
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

  it('GIVEN all external resources are mocked WHEN called with valid request THEN the mocked data is transformed and pushed to EventBridge', async () => {
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

  it('GIVEN all external resources are mocked WHEN called with invalid request THEN return 400 bad request error and not push event to EventBridge', async () => {
    const mockDate = new Date('2022-01-01');
    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as unknown as string);
    const result = await handler(mDynamicsInvalidRequest, context);

    expect(result).toEqual({
      statusCode: 400,
      body: 'Following line items failed validation [{}]',
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
