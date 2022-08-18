import { IDynamicsBooking } from '../../../src/interfaces/IDynamicsBooking';

export const GetRequestBody = (i: number): IDynamicsBooking => {
  switch (i) {
    case 1:
      return <IDynamicsBooking>{
        name: 'hello',
        bookingDate: '2022-01-01',
        vrm: '12345',
        testCode: '12345',
        testDate: '2022-01-01',
        pNumber: '12345',
      };
    case 2:
      return <IDynamicsBooking>{
        name: 'hello',
        bookingDate: '2022-01-01',
        vrm: '12345',
        testCode: '12345',
        testDate: '2022-01-01',
      };
    case 3:
      return <IDynamicsBooking>{
        name: 'hello',
        bookingDate: '2022-01-01',
        vrm: 12345 as unknown,
        testCode: '12345',
        testDate: '2022-01-01',
        pNumber: '12345',
      };
    case 4:
      return <IDynamicsBooking>{
        name: 'hello',
        bookingDate: '2022-01-01',
        vrm: 12345 as unknown,
        testCode: '12345',
        testDate: '2022-01-01',
      };
    default:
      return <IDynamicsBooking>{};
  }
};
