import Joi from 'joi';

export async function validateTestBooking(testBooking: unknown): Promise<unknown> {
  const schema = Joi.array().items(Joi.object().keys({
    name: Joi.string().required(),
    bookingDate: Joi.string().required(),
    vrm: Joi.string().required(),
    testCode: Joi.string().required(),
    testDate: Joi.string().required(),
    pNumber: Joi.string().required(),
  }));
  return schema.validateAsync(testBooking, { abortEarly: false });
}
