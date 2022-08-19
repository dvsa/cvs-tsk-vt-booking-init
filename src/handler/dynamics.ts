import 'dotenv/config';
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { sendBooking } from '../services/eventbridge';
import { IDynamicsBooking } from '../interfaces/IDynamicsBooking';
import validateTestBooking from '../services/validateTestBooking';
import logger from '../util/logger';

/**
 * Handler for vehicle bookings received from Dynamics CE via API Gateway
 *
 * @param {APIGatewayProxyEvent} event
 * @param {Context} _context
 * @returns {Promise<APIGatewayProxyResult>}
 */
export const handler = async (
  event: APIGatewayProxyEvent,
  _context: Context,
): Promise<APIGatewayProxyResult> => {
  if (!event.body) return Promise.resolve({
    statusCode: 400,
    body: 'No body in request',
  });

  try {
    await validateTestBooking(JSON.parse(event.body));
    logger.info('validateTestBooking ending');
  } catch (error: unknown) {
    logger.error('Request body failed validation');
    logger.error('', error);
    return Promise.resolve({
      statusCode: 400,
      body: `Received event failed validation: ${error as string}`,
    });
  }

  const result = await sendBooking(JSON.parse(event.body) as unknown as IDynamicsBooking[]);

  if (result.FailCount >= 1) {
    return Promise.resolve({
      statusCode: 500,
      body: `Failed to send ${result.FailCount} booking${result.FailCount > 1 ? 's' : ''} to EventBridge, please see logs for details`,
    });
  }

  return Promise.resolve({
    statusCode: 201,
    body: `Successfully sent ${result.SuccessCount} booking${result.SuccessCount > 1 ? 's' : ''} to EventBridge`,
  });
};