import { EventBridge } from 'aws-sdk';
import { IEventEntry } from '../interfaces/IEventEntry';
import { IEntries } from '../interfaces/IEntries';
import { IBooking } from '../interfaces/IBooking';
import { ISendResponse } from '../interfaces/ISendResponse';
import logger from '../util/logger';
import config from '../config';

const eventbridge = new EventBridge();
const sendBooking = async (
  lineItems: IBooking[],
): Promise<ISendResponse> => {
  const sendResponse: ISendResponse = {
    SuccessCount: 0,
    FailCount: 0,
  };
  
  logger.info('sendBooking starting');

  for (const lineItem of lineItems) {
    logger.info(
      `sending test booking with test date ${lineItem.testDate} for vehicle ${lineItem.vrm} at test station ${lineItem.pNumber} to eventbridge...`,
    );

    try {
      const entry: IEventEntry = {
        Source: config.aws.eventBusSource,
        Detail: JSON.stringify(lineItem),
        DetailType: 'CVS Test Booking',
        EventBusName: config.aws.eventBusName,
        Time: new Date(),
      };

      const params: IEntries = {
        Entries: [entry],
      };

      logger.debug(
        `test booking event about to be sent: ${JSON.stringify(params)}`,
      );
      await eventbridge.putEvents(params).promise();
      sendResponse.SuccessCount++;
    } catch (error) {
      logger.error('line item being processed failed to be put onto eventbridge');
      logger.error('', error);
      sendResponse.FailCount++;
    }
  }

  logger.info('sendBooking ending');

  return sendResponse;
};

export { sendBooking };
