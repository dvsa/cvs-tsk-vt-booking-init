import 'dotenv/config';
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import logger from '../util/logger';
import { sendBooking } from '../services/eventbridge';
import { validateTestBooking } from '../services/validateTestBooking';
import { IDynamicsBooking } from '../interfaces/IDynamicsBooking';

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

  const payload = JSON.parse(event.body) as unknown as IDynamicsBooking;

  logger.info('Received valid test booking request from Dynamics');
  logger.debug(`Dynamics request body: ${JSON.stringify(payload)}`);

  const result = await sendBooking(payload);

  if (result.FailCount === 1) {
    return Promise.resolve({
      statusCode: 500,
      body: 'Failed to send booking to EventBridge, please see logs for details',
    });
  }

  return Promise.resolve({
    statusCode: 201,
    body: 'Successfully sent booking to EventBridge',
  });
};
