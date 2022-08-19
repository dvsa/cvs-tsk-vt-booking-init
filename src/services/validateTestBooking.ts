import * as JoiImport from 'joi';
import JoiDateFactory from '@joi/date';

const Joi = JoiImport.extend(JoiDateFactory) as unknown as JoiImport.Root;

export default async function validateTestBooking(testBooking: unknown): Promise<unknown> {
  const schema = Joi.array().items(Joi.object().keys({
    name: Joi.string().max(10).required(),
    bookingDate: Joi.date().format('YYYY-MM-DD').required(),
    vrm: Joi.string().required(),
    testCode: Joi.string().max(3).required(),
    testDate: Joi.date().format('YYYY-MM-DD').required(),
    pNumber: Joi.string().max(6).required(),
  }));
  return schema.validateAsync(testBooking, { abortEarly: false });
}
