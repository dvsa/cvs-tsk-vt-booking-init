import { EventBridge } from 'aws-sdk';
import { IEventEntry } from '../interfaces/IEventEntry';
import { IEntries } from '../interfaces/IEntries';
import { IDynamicsBooking } from '../interfaces/IDynamicsBooking';
import { ISendResponse } from '../interfaces/ISendResponse';
import logger from '../util/logger';
import config from '../config';

const eventbridge = new EventBridge();
const sendBooking = async (
  testBooking: IDynamicsBooking,
): Promise<ISendResponse> => {
  logger.info('sendBooking starting');
  logger.info('Test booking ready to send to eventbridge.');

  const sendResponse: ISendResponse = {
    SuccessCount: 0,
    FailCount: 0,
  };

  // eslint-disable-next-line security/detect-object-injection
  logger.info(
    `sending test booking with test date ${testBooking.testDate} for test station ${testBooking.pNumber} to eventbridge...`,
  );

  try {
    const entry: IEventEntry = {
      Source: config.aws.eventBusSource,
      // eslint-disable-next-line security/detect-object-injection
      Detail: JSON.stringify(testBooking),
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
    // eslint-disable-next-line no-await-in-loop
    await eventbridge.putEvents(params).promise();
    sendResponse.SuccessCount++;
  } catch (error) {
    logger.error('', error);
    sendResponse.FailCount++;
  }

  logger.info('sendBooking ending');

  return sendResponse;
};

export { sendBooking };