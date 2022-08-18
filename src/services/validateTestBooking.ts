import Joi from 'joi';
import logger from '../util/logger';

export async function validateTestBooking(testBooking: any) {
  logger.info('validateTestBooking starting');
  const schema = Joi.object({
    name: Joi.string().required(),
    bookingDate: Joi.string().required(),
    vrm: Joi.string().required(),
    testCode: Joi.string().required(),
    testDate: Joi.string().required(),
    pNumber: Joi.string().required(),
  });
  await schema.validateAsync(testBooking, { abortEarly: false });
  logger.info('validateTestBooking ending');
}
