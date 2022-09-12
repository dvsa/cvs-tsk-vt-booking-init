import { TestResult } from '../interfaces/TestResult';
import { Booking } from '../interfaces/Booking';
import { DynamoDBStreamEvent } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import logger from '../util/logger';
import dateFormat from 'dateformat';

const trimTestCode = (testCode: string | undefined): string => {
  if (testCode === undefined)
    throw new Error('testCode not defined in test result');

  if (testCode.length === 4) {
    if (+testCode[3] !== +testCode[3])
      throw new Error(`4th char of test code is non-numeric: ${testCode}`);

    return testCode.slice(0, 3).toUpperCase();
  }

  return testCode.toUpperCase();
};

const trimTestStationName = (testStationName: string): string => {
  if (testStationName.length > 10) return testStationName.slice(0, 10);

  return testStationName;
};

export const extractVehicleBookings = (
  event: DynamoDBStreamEvent,
): Booking[] => {
  let bookings: Booking[] = [];

  for (const dbRecord of event.Records) {
    if (dbRecord.eventName !== 'INSERT') {
      logger.info(`${dbRecord.eventName} event - ignoring`);
      continue;
    }

    if (!dbRecord.dynamodb?.NewImage) continue;

    const newImage = DynamoDB.Converter.unmarshall(
      dbRecord.dynamodb.NewImage,
    ) as TestResult;

    if (newImage.testResultId.toLowerCase().includes('legacy')) {
      logger.info(
        `legacy test result with ID ${newImage.testResultId} - ignoring`,
      );
      continue;
    }

    if (newImage.testStatus === 'cancelled') {
      logger.info(
        `test result with ID: ${newImage.testResultId} has a status of cancelled and will not be resulted`,
      );
      continue;
    }

    bookings = [...bookings, ...extractBookingDetails(newImage)];
  }

  return bookings;
};

export const extractBookingDetails = (testResult: TestResult): Booking[] => {
  try {
    logger.info(
      `Extracting vehicle booking details for testResultId: ${testResult.testResultId}`,
    );
    return testResult.testTypes.map((testType) => {
      if (testResult.vehicleType === 'trl') {
        if (testResult.trailerId)
          return {
            name: trimTestStationName(testResult.testStationName),
            bookingDate: dateFormat(testResult.testStartTimestamp, 'isoDate'),
            vrm: testResult.trailerId,
            testCode: trimTestCode(testType.testCode),
            testDate: dateFormat(testResult.testStartTimestamp, 'isoDate'),
            pNumber: testResult.testStationPNumber,
          };
        throw new Error('trailer does not have trailerId available');
      }

      if (testResult.vrm)
        return {
          name: trimTestStationName(testResult.testStationName),
          bookingDate: dateFormat(testResult.testStartTimestamp, 'isoDate'),
          vrm: testResult.vrm,
          testCode: trimTestCode(testType.testCode),
          testDate: dateFormat(testResult.testStartTimestamp, 'isoDate'),
          pNumber: testResult.testStationPNumber,
        };

      throw new Error(`${testResult.vehicleType} does not have associated vrm`);
    });
  } catch (error) {
    logger.error(
      `Unable to process test result with ID: ${testResult.testResultId}`,
    );
    logger.error('', error);
  }
};
