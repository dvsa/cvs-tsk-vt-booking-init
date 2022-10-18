import { PutEventsRequest } from 'aws-sdk/clients/eventbridge';
import config from '../../src/config';
import { handler } from '../../src/handler/dynamo';
import { Entries } from '../../src/interfaces/Entries';
import { EventEntry } from '../../src/interfaces/EventEntry';
import logger from '../../src/util/logger';
import { GetDynamoStream } from '../unit/resources/mTestResultRecords';

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

jest.mock('../../src/util/logger');

const mockDate = new Date('2021-01-14T10:36:33.987Z');
jest
  .spyOn(global, 'Date')
  .mockImplementation(() => mockDate as unknown as string);

describe('Handler integration test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('receives valid dynamo stream event for non-trailer test results and puts transformed event on EventBridge', async () => {
    const event = GetDynamoStream(1);

    await handler(event);

    expect(putEventsFn).toHaveBeenCalledTimes(2);
    expect(putEventsFn).toHaveBeenNthCalledWith(1, <Entries>{
      Entries: [
        <EventEntry>{
          Source: config.aws.eventBusSource,
          Detail:
            '{"name":"Rowe, Wunsch and Wisoky","bookingDate":"2021-01-14 10:36:33","vrm":"JY58FPP","testCode":"FFV","testDate":"2021-01-14 10:36:33","pNumber":"87-1369569"}',
          DetailType: 'CVS Test Booking',
          EventBusName: config.aws.eventBusName,
          Time: new Date('2022-01-01'),
        },
      ],
    });

    expect(putEventsFn).toHaveBeenNthCalledWith(2, <Entries>{
      Entries: [
        <EventEntry>{
          Source: config.aws.eventBusSource,
          Detail:
            '{"name":"Rowe, Wunsch and Wisoky","bookingDate":"2021-01-14 10:36:33","vrm":"JY58FPP","testCode":"LEC","testDate":"2021-01-14 10:36:33","pNumber":"87-1369569"}',
          DetailType: 'CVS Test Booking',
          EventBusName: config.aws.eventBusName,
          Time: new Date('2022-01-01'),
        },
      ],
    });

    expect(logger.info).toHaveBeenLastCalledWith(
      'Successfully sent 2 bookings to EventBridge',
    );
  });

  it('receives valid dynamo stream event for trailer test result and puts transformed event on EventBridge', async () => {
    const event = GetDynamoStream(2);

    await handler(event);

    expect(putEventsFn).toHaveBeenCalledTimes(2);
    expect(putEventsFn).toHaveBeenNthCalledWith(1, <Entries>{
      Entries: [
        <EventEntry>{
          Source: config.aws.eventBusSource,
          Detail:
            '{"name":"MyATF","bookingDate":"2021-01-14 10:36:33","trailerId":"C000001","testCode":"ART","testDate":"2021-01-14 10:36:33","pNumber":"87-1369569"}',
          DetailType: 'CVS Test Booking',
          EventBusName: config.aws.eventBusName,
          Time: new Date('2022-01-01'),
        },
      ],
    });

    expect(putEventsFn).toHaveBeenNthCalledWith(2, <Entries>{
      Entries: [
        <EventEntry>{
          Source: config.aws.eventBusSource,
          Detail:
            '{"name":"MyATF","bookingDate":"2021-01-14 10:36:33","trailerId":"C000001","testCode":"AAT","testDate":"2021-01-14 10:36:33","pNumber":"87-1369569"}',
          DetailType: 'CVS Test Booking',
          EventBusName: config.aws.eventBusName,
          Time: new Date('2022-01-01'),
        },
      ],
    });

    expect(logger.info).toHaveBeenLastCalledWith(
      'Successfully sent 2 bookings to EventBridge',
    );
  });

  it('receives valid dynamo stream event but fails to put event onto EventBridge', async () => {
    const event = GetDynamoStream(7);

    await handler(event);

    expect(putEventsFn).toHaveBeenCalledTimes(2);

    expect(logger.error).toHaveBeenLastCalledWith(
      'Failed to send 2 bookings to EventBridge, please see logs for details',
    );
  });
});
