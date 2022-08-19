import { validateTestBooking } from '../../../src/services/validateTestBooking';
import { GetRequestBody } from '../resources/mDynamicsRequestBodies';

async function t(request: number) {
  await validateTestBooking(GetRequestBody(request));
}

describe('validatTestBooking', () => {
  it('returns undefined if parameters in body are valid', async () => {
    await expect(t(1)).resolves.not.toThrow();
  });
  it('throws error if parameter is missing', async () => {
    await expect(t(2)).rejects.toThrow('\"[0].pNumber\" is required');
  });
  it('throws error if parameters are not all strings', async () => {
    await expect(t(3)).rejects.toThrow('\"[0].vrm\" must be a string');
  });
  it('throws error showing multiple errors in validation', async () => {
    await expect(t(4)).rejects.toThrow('\"[0].vrm\" must be a string. \"[0].pNumber\" is required');       
  });
});
