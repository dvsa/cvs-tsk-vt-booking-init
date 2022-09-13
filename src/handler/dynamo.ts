import type { DynamoDBStreamEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import logger from '../util/logger';
import { extractVehicleBookings } from '../services/extractVehicleBooking';
import { sendBooking } from '../services/eventbridge';

/**
 * Handler for vehicle bookings received from test-result DynamoDB
 *
 * @param {DynamoDBStreamEvent} event
 * @param {Context} _context
 * @returns {Promise<APIGatewayProxyResult>}
 */
export const handler = async (
  event: DynamoDBStreamEvent,
  _context: Context,
): Promise<APIGatewayProxyResult> => {
  logger.debug(`Received event: ${JSON.stringify(event)}`);

  const bookings = extractVehicleBookings(event);

  if (bookings.length === 0) {
    logger.info('No valid bookings to be sent to EventBridge');
    return Promise.resolve({
      statusCode: 400,
      body: 'No body in request',
    });  
  }

  const result = await sendBooking(bookings);

  if (result.FailCount >= 1) {
    logger.error(`Failed to send ${result.FailCount} booking${result.FailCount !== 1 ? 's' : ''} to EventBridge, please see logs for details`);
    return Promise.resolve({
      statusCode: 500,
      body: `Failed to send ${result.FailCount} booking${result.FailCount > 1 ? 's' : ''} to EventBridge, please see logs for details`,
    });
  }

  logger.info(`Successfully sent ${result.SuccessCount} booking${result.SuccessCount !== 1 ? 's' : ''} to EventBridge`);
  return Promise.resolve({
    statusCode: 201,
    body: `Successfully sent ${result.SuccessCount} booking${result.SuccessCount > 1 ? 's' : ''} to EventBridge`,
  });
};
