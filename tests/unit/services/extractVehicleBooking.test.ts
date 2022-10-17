import { extractVehicleBookings } from '../../../src/services/extractVehicleBooking';
import logger from '../../../src/util/logger';
import { GetDynamoStream } from '../resources/mTestResultRecords';

jest.mock('../../../src/util/logger');

describe('extractVehicleBooking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return array of valid vehicle bookings for psv/hgv', () => {
    const event = GetDynamoStream(1);

    const result = extractVehicleBookings(event);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      name: 'Rowe, Wunsch and Wisoky',
      bookingDate: '2021-01-14 10:36:33',
      vrm: 'JY58FPP',
      testDate: '2021-01-14 15:36:33',
      testCode: 'FFV',
      pNumber: '87-1369569',
    });
    expect(result[1]).toEqual({
      name: 'Rowe, Wunsch and Wisoky',
      bookingDate: '2021-01-14 10:36:33',
      vrm: 'JY58FPP',
      testDate: '2021-01-14 10:36:33',
      testCode: 'LEC',
      pNumber: '87-1369569',
    });
  });

  it('should return array of valid vehicle bookings for trailer', () => {
    const event = GetDynamoStream(2);

    const result = extractVehicleBookings(event);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      name: 'MyATF',
      bookingDate: '2021-01-14 10:36:33',
      trailerId: 'C000001',
      testDate: '2021-01-15 10:36:33',
      testCode: 'ART',
      pNumber: '87-1369569',
    });
    expect(result[1]).toEqual({
      name: 'MyATF',
      bookingDate: '2021-01-14 10:36:33',
      trailerId: 'C000001',
      testDate: '2021-01-14 10:36:33',
      testCode: 'AAT',
      pNumber: '87-1369569',
    });
  });

  it('should ignore dynamo modify stream events', () => {
    const event = GetDynamoStream(3);

    const result = extractVehicleBookings(event);

    expect(result).toEqual([]);
    expect(logger.info).toHaveBeenLastCalledWith('MODIFY event - ignoring');
  });

  it('should ignore dynamo remove stream events', () => {
    const event = GetDynamoStream(4);

    const result = extractVehicleBookings(event);

    expect(result).toEqual([]);
    expect(logger.info).toHaveBeenLastCalledWith('REMOVE event - ignoring');
  });

  it('should ignore test results that are legacy', () => {
    const event = GetDynamoStream(5);

    const result = extractVehicleBookings(event);

    expect(result).toEqual([]);
    expect(logger.info).toHaveBeenLastCalledWith(
      'legacy test result with ID LEGACYa1b16bae-ae57-4605-96a5-989e0f71f5e3 - ignoring',
    );
  });

  it('should throw error if no vrm or trailerId is present', () => {
    const event = GetDynamoStream(6);

    const fn = () => {
      extractVehicleBookings(event);
    };

    expect(fn).toThrow();
    expect(logger.error).toHaveBeenNthCalledWith(
      1,
      'Unable to process test result with ID: a1b16bae-ae57-4605-96a5-989e0f71f5e3',
    );
    expect(logger.error).toHaveBeenNthCalledWith(
      2,
      '',
      new Error('psv does not have associated vrm'),
    );
  });

  it('should throw error if 4th char of test code is not numeric - should be the number of axles i.e. a number', () => {
    const event = GetDynamoStream(8);

    const fn = () => {
      extractVehicleBookings(event);
    };

    expect(fn).toThrow();
    expect(logger.error).toHaveBeenNthCalledWith(
      1,
      'Unable to process test result with ID: a1b16bae-ae57-4605-96a5-989e0f71f5e3',
    );
    expect(logger.error).toHaveBeenNthCalledWith(
      2,
      '',
      new Error('4th char of test code is non-numeric: ffva'),
    );
  });

  it('should ignore test results that have a status of cancelled', () => {
    const event = GetDynamoStream(9);

    const result = extractVehicleBookings(event);

    expect(result).toEqual([]);
    expect(logger.info).toHaveBeenLastCalledWith(
      'test result with ID: a1b16bae-ae57-4605-96a5-989e0f71f5e3 has a status of cancelled and will not be resulted',
    );
  });
});
