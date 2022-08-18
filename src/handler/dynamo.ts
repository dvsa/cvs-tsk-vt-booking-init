import 'dotenv/config';
import type { DynamoDBStreamEvent, Context } from 'aws-lambda';
import logger from '../util/logger';

/**
 * Handler for vehicle bookings received from test-result DynamoDB
 *
 * @param {APIGatewayProxyEvent} event
 * @param {Context} _context
 * @returns {Promise<VoidFunction>}
 */
export const handler = (
  _event: DynamoDBStreamEvent,
  _context: Context,
): void => {
  logger.info('Received test booking request from test-result DynamoDB');
};
