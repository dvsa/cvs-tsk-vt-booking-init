import { mocked } from 'jest-mock';
import { handler } from '../../../src/handler/dynamo';
import { Context, DynamoDBStreamEvent } from 'aws-lambda';
import { sendBooking } from '../../../src/services/eventbridge';
import { SendResponse } from '../../../src/interfaces/SendResponse';
import { extractVehicleBookings } from '../../../src/services/extractVehicleBooking';
import { Booking } from '../../../src/interfaces/Booking';
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
    mocked(sendBooking).mockResolvedValueOnce(<SendResponse>{ SuccessCount: 1 });
    mocked(extractVehicleBookings).mockReturnValueOnce(<Booking[]>[<Booking>{}]);

    await handler(<DynamoDBStreamEvent>{}, context);

    expect(extractVehicleBookings).toHaveBeenCalled();
    expect(sendBooking).toHaveBeenCalled();
    expect(logger.info).toHaveBeenLastCalledWith('Successfully sent 1 bookings to EventBridge');
  });

  it('receives event with no booking details, so doesn\'t put on EventBridge', async () => {
    mocked(extractVehicleBookings).mockReturnValueOnce(<Booking[]>[]);

    await handler(<DynamoDBStreamEvent>{}, context);

    expect(extractVehicleBookings).toHaveBeenCalled();
    expect(sendBooking).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenLastCalledWith('No valid bookings to be sent to EventBridge');
  });

  it('receives valid dynamo stream event, but fails to put on EventBridge', async () => {
    mocked(sendBooking).mockResolvedValueOnce(<SendResponse>{ FailCount: 1, SuccessCount: 0 });
    mocked(extractVehicleBookings).mockReturnValueOnce(<Booking[]>[<Booking>{}]);

    await handler(<DynamoDBStreamEvent>{}, context);

    expect(extractVehicleBookings).toHaveBeenCalled();
    expect(sendBooking).toHaveBeenCalled();
    expect(logger.error).toHaveBeenNthCalledWith(1, 'Failed to send 1 bookings to EventBridge, please see logs for details');    
  });
});
