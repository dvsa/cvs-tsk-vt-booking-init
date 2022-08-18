import { Context } from 'aws-lambda';
import { handler } from '../../../src/handler/dynamics';
import { ISendResponse } from '../../../src/interfaces/ISendResponse';
import { sendBooking } from '../../../src/services/eventbridge';
import { mDynamicsRequest } from '../../integration/resources/mDynamicsRequest';

const context: Context = <Context>{};

jest.mock('../../../src/services/eventbridge', () => ({
  sendBooking: jest.fn().mockResolvedValue(<ISendResponse>{}),
}));

describe('dynamics handler tests', () => {
  it('passes JSON object from valid dynamics request body to sendBooking method', async () => {
    await handler(mDynamicsRequest, context);

    expect(sendBooking).toHaveBeenCalledWith({
      name: 'hello',
      bookingDate: '2022-01-01',
      vrm: '12345',
      testCode: '12345',
      testDate: '2022-01-01',
      pNumber: '12345',
    });
  });
});
