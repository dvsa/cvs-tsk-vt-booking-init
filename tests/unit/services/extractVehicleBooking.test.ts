import { extractVehicleBookings } from "../../../src/services/extractVehicleBooking";
import logger from "../../../src/util/logger";
import { GetDynamoStream } from "../resources/mTestResultRecords";

jest.mock('../../../src/util/logger');

describe('extractVehicleBooking', () => {
    it('should return array of valid vehicle bookings for psv/hgv', () => {
        const event = GetDynamoStream(1);

        const result = extractVehicleBookings(event);

        expect(result.length).toEqual(2)
        expect(result[0]).toEqual({
            name:"Rowe, Wuns",
            bookingDate:"2021-01-14T10:36:33.987Z",
            vrm: "JY58FPP",
            testDate: "2021-01-14T10:36:33.987Z",
            testCode: "ffv",
            pNumber: "87-1369569",
        })
        expect(result[1]).toEqual({
            name:"Rowe, Wuns",
            bookingDate:"2021-01-14T10:36:33.987Z",
            vrm: "JY58FPP",
            testDate: "2021-01-14T10:36:33.987Z",
            testCode: "lec",
            pNumber: "87-1369569",
        })
    })

    it('should return array of valid vehicle bookings for trailer', () => {
        const event = GetDynamoStream(2);

        const result = extractVehicleBookings(event);

        expect(result.length).toEqual(2)
        expect(result[0]).toEqual({
            name:"MyATF",
            bookingDate:"2021-01-14T10:36:33.987Z",
            vrm: "C000001",
            testDate: "2021-01-14T10:36:33.987Z",
            testCode: "art",
            pNumber: "87-1369569",
        })
        expect(result[1]).toEqual({
            name:"MyATF",
            bookingDate:"2021-01-14T10:36:33.987Z",
            vrm: "C000001",
            testDate: "2021-01-14T10:36:33.987Z",
            testCode: "aat",
            pNumber: "87-1369569",
        })
    })

    it('should ignore dynamo modify stream events', () => {
        const event = GetDynamoStream(3);

        const result = extractVehicleBookings(event);

        expect(result).toEqual([]);
        expect(logger.info).toHaveBeenLastCalledWith('MODIFY event - ignoring')

    })

    it('should ignore dynamo remove stream events', () => {
        const event = GetDynamoStream(4);

        const result = extractVehicleBookings(event);

        expect(result).toEqual([]);
        expect(logger.info).toHaveBeenLastCalledWith('REMOVE event - ignoring')

    })

    it('should ignore test results that are legacy', () => {
        const event = GetDynamoStream(5);

        const result = extractVehicleBookings(event);

        expect(result).toEqual([]);
        expect(logger.info).toHaveBeenLastCalledWith('legacy test result - ignoring')
    })

    it('should throw error if no vrm or trailerId is present', () => {
        const event = GetDynamoStream(6);

        const fn = () => {
            extractVehicleBookings(event)
        }

        expect(fn).toThrow()
        expect(logger.error).toHaveBeenLastCalledWith(new Error("Vehicle test result does not contain defined vrm or trailerId"))
    })

    it('should throw error if 4th char of test code is not numeric - should be the number of axles i.e. a number', () => {
        const event = GetDynamoStream(8);

        const fn = () => {
            extractVehicleBookings(event)
        }

        expect(fn).toThrow()
        expect(logger.error).toHaveBeenLastCalledWith(new Error("4th char of test code is non-numeric: ffva"))
    })
})