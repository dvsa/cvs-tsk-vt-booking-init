import { mocked } from 'ts-jest/utils';
import { handler } from '../../../src/handler/dynamo';
import { Context, DynamoDBStreamEvent } from 'aws-lambda';
import { sendBooking } from '../../../src/services/eventbridge';
import { ISendResponse } from '../../../src/interfaces/ISendResponse';
import { extractVehicleBookings } from '../../../src/services/extractVehicleBooking';
import { IBooking } from '../../../src/interfaces/IBooking';
import logger from '../../../src/util/logger';

let context: Context;

jest.mock('../../../src/services/eventbridge');
jest.mock('../../../src/services/extractVehicleBooking');
jest.mock('../../../src/util/logger');

describe('dynamo handler tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('receives valid dynamo stream event, so puts on EventBridge', async () => {
    mocked(sendBooking).mockResolvedValueOnce(<ISendResponse>{ SuccessCount: 1 });
    mocked(extractVehicleBookings).mockReturnValueOnce(<IBooking[]>[<IBooking>{}]);

    await handler(<DynamoDBStreamEvent>{}, context);

    expect(extractVehicleBookings).toHaveBeenCalled();
    expect(sendBooking).toHaveBeenCalled();
    expect(logger.info).toHaveBeenLastCalledWith('Successfully sent 1 booking to EventBridge');
  });

  it('receives event with no booking details, so doesn\'t put on EventBridge', async () => {
    mocked(extractVehicleBookings).mockReturnValueOnce(<IBooking[]>[]);

    await handler(<DynamoDBStreamEvent>{}, context);

    expect(extractVehicleBookings).toHaveBeenCalled();
    expect(sendBooking).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenLastCalledWith('No valid bookings to be sent to EventBridge');
  });

  it('receives valid dynamo stream event, but fails to put on EventBridge', async () => {
    mocked(sendBooking).mockResolvedValueOnce(<ISendResponse>{ FailCount: 1, SuccessCount: 0 });
    mocked(extractVehicleBookings).mockReturnValueOnce(<IBooking[]>[<IBooking>{}]);

    await handler(<DynamoDBStreamEvent>{}, context);

    expect(extractVehicleBookings).toHaveBeenCalled();
    expect(sendBooking).toHaveBeenCalled();
    expect(logger.info).toHaveBeenNthCalledWith(2, 'Successfully sent 0 bookings to EventBridge');    
    expect(logger.error).toHaveBeenNthCalledWith(1, 'Failed to send 1 booking to EventBridge, please see logs for details');    
  });
});
