import { EventBridge, Request } from 'aws-sdk';
import { mocked } from 'ts-jest/utils';
import {
  PutEventsResponse,
  PutEventsRequest,
  PutEventsResultEntry,
} from 'aws-sdk/clients/eventbridge';
import { sendBooking } from '../../../src/services/eventbridge';
import { ISendResponse } from '../../../src/interfaces/ISendResponse';
import { IDynamicsBooking } from '../../../src/interfaces/IDynamicsBooking';

jest.mock('aws-sdk', () => {
  const mEventBridgeInstance = {
    putEvents: jest.fn(),
  };
  const mRequestInstance = {
    promise: jest.fn(),
  };
  const mEventBridge = jest.fn(() => mEventBridgeInstance);
  const mRequest = jest.fn(() => mRequestInstance);

  return { EventBridge: mEventBridge, Request: mRequest };
});

type PutEventsWithParams = (
  params: PutEventsRequest
) => AWS.Request<PutEventsResponse, AWS.AWSError>;

const mEventBridgeInstance = new EventBridge();
const mResultInstance = new Request<PutEventsResponse, AWS.AWSError>(
  null,
  null,
);
// eslint-disable-next-line jest/unbound-method
mocked(mEventBridgeInstance.putEvents as PutEventsWithParams).mockImplementation(
  (params: PutEventsRequest): AWS.Request<PutEventsResponse, AWS.AWSError> => {
    const mPutEventsResponse: PutEventsResponse = {
      FailedEntryCount: 0,
      Entries: Array<PutEventsResultEntry>(params.Entries.length),
    };
    if (params.Entries[0].Detail === JSON.stringify({ name: 'Error', bookingDate: 'Error' })) {
      mResultInstance.promise = jest
        .fn()
        .mockReturnValue(Promise.reject(new Error('Oh no!')));
    } else {
      mResultInstance.promise = jest
        .fn()
        .mockReturnValue(Promise.resolve(mPutEventsResponse));
    }
    return mResultInstance;
  },
);

describe('Send events', () => {
  describe('Events sent', () => {
    it('GIVEN one event to send WHEN sent THEN one event is returned.', async () => {
      const dynamicsBooking = <IDynamicsBooking>(<unknown>{ name: 'Success!' });
      const mSendResponse: ISendResponse = { SuccessCount: 1, FailCount: 0 };
      await expect(sendBooking(dynamicsBooking)).resolves.toEqual(
        mSendResponse,
      );
    });
    it('GIVEN an issue with eventbridge WHEN 1 event fails THEN the failure is in the response.', async () => {
      const errorDynamicsBooking = <IDynamicsBooking>(
        (<unknown>{ name: 'Error', bookingDate: 'Error' })
      );
      const mSendResponse: ISendResponse = { SuccessCount: 0, FailCount: 1 };
      await expect(sendBooking(errorDynamicsBooking)).resolves.toEqual(
        mSendResponse,
      );
    });
  });
});
