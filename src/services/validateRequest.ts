import { APIGatewayProxyEvent } from 'aws-lambda';
import { validateTestBooking } from './validateTestBooking';
import logger from '../util/logger';

export async function validateRequest(event: APIGatewayProxyEvent): Promise<string | void> {
  if (!event.body) return 'No body received in request';

  let lineItems: unknown;
  logger.debug(`Dynamics request body: ${JSON.stringify(lineItems)}`);

  try { 
    lineItems = JSON.parse(event.body); 
  } catch (e) {
    return 'Request body does not contain valid JSON';
  }
  
  if (!Array.isArray(lineItems)) return 'Line items must come in form of array';
  
  logger.info(`Received ${lineItems.length} line items from Dynamics`);
  
  logger.info('validateTestBooking starting');
  
  let failedLineItems: unknown[] = [];
  
  for (const lineItem of lineItems) {
    try {
      logger.debug(`Validating line item: ${JSON.stringify(lineItem)}`);
      await validateTestBooking(lineItem);
    } catch (error: unknown) {
      logger.debug(`Invalid line item: ${JSON.stringify(lineItem)}`);
      logger.error('Request body failed validation');
      logger.error('', error);
      failedLineItems = [...failedLineItems, lineItem];
    }
  }
  
  if (failedLineItems.length) return `Following line items failed validation ${JSON.stringify(failedLineItems)}`;
  
  logger.info('validateTestBooking ending');
  
  logger.info('Received valid array of test bookings in request from Dynamics');
}
