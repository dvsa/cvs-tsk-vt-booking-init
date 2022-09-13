import type { DynamoDBStreamEvent } from 'aws-lambda';
import logger from '../util/logger';
import { extractVehicleBookings } from '../services/extractVehicleBooking';
import { sendBooking } from '../services/eventbridge';

/**
 * Handler for vehicle bookings received from test-result DynamoDB
 *
 * @param {DynamoDBStreamEvent} event
 * @param {Context} _context
 * @returns {Promise<VoidFunction>}
 */
export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  logger.debug(`Received event: ${JSON.stringify(event)}`);

  const bookings = extractVehicleBookings(event);

  if (bookings.length === 0) {
    logger.info('No valid bookings to be sent to EventBridge');
    return;
  }

  const result = await sendBooking(bookings);

  logger.info(
    `Successfully sent ${result.SuccessCount} booking${
      result.SuccessCount !== 1 ? 's' : ''
    } to EventBridge`,
  );

  if (result.FailCount >= 1) {
    logger.error(
      `Failed to send ${result.FailCount} booking${
        result.FailCount !== 1 ? 's' : ''
      } to EventBridge, please see logs for details`,
    );
  }
};
