import validateTestBooking from '../../../src/services/validateTestBooking';
import { GetRequestBody } from '../resources/mDynamicsRequestBodies';

async function t(request: number) {
  await validateTestBooking(GetRequestBody(request));
}

describe('validatTestBooking', () => {
  it('returns undefined if parameters in body are valid', async () => {
    await expect(t(1)).resolves.not.toThrow();
  });
  it('throws error if parameter is missing', async () => {
    await expect(t(2)).rejects.toThrow('"[0].pNumber" is required');
  });
  it('throws error if parameters are not all strings', async () => {
    await expect(t(3)).rejects.toThrow('"[0].vrm" must be a string');
  });
  it('throws error showing multiple errors in validation', async () => {
    await expect(t(4)).rejects.toThrow(
      '"[0].vrm" must be a string. "[0].pNumber" is required',
    );
  });
  it('throws error when date fields aren`t dates', async () => {
    await expect(t(5)).rejects.toThrow(
      '"[0].bookingDate" must be in YYYY-MM-DD format. "[0].testDate" must be in YYYY-MM-DD forma',
    );
  });
  it('throws error if parameters are above character limit', async () => {
    await expect(t(6)).rejects.toThrow(
      '"[0].name" length must be less than or equal to 10 characters long. "[0].testCode" length must be less than or equal to 3 characters long. "[0].pNumber" length must be less than or equal to 6 characters long',
    );
  });
});
