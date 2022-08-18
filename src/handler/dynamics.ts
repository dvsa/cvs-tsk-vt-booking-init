import 'dotenv/config';
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { sendBooking } from '../services/eventbridge';
import { validateRequest } from '../services/validateRequest';
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
  const validationError = await validateRequest(event);
  if (validationError) return Promise.resolve({
    statusCode: 400,
    body: validationError,
  });

  const payload = JSON.parse(event.body) as unknown as IDynamicsBooking[];

  const result = await sendBooking(payload);

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
