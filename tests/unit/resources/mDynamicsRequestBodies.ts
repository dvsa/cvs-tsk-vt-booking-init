import { IBooking } from '../../../src/interfaces/IBooking';

export const GetRequestBody = (i: number): IBooking[] => {
  switch (i) {
    case 1:
      return [<IBooking>{
        name: 'hello',
        bookingDate: '2022-01-01',
        vrm: '12345',
        testCode: '123',
        testDate: '2022-01-01',
        pNumber: '12345',
      }];
    case 2:
      return [<IBooking>{
        name: 'hello',
        bookingDate: '2022-01-01',
        vrm: '12345',
        testCode: '123',
        testDate: '2022-01-01',
      }];
    case 3:
      return [<IBooking>{
        name: 'hello',
        bookingDate: '2022-01-01',
        vrm: 12345 as unknown,
        testCode: '123',
        testDate: '2022-01-01',
        pNumber: '12345',
      }];
    case 4:
      return [<IBooking>{
        name: 'hello',
        bookingDate: '2022-01-01',
        vrm: 12345 as unknown,
        testCode: '123',
        testDate: '2022-01-01',
      }];
    case 5:
      return [<IBooking>{
        name: 'hello',
        bookingDate: 'Im not a date',
        vrm: '12345',
        testCode: '123',
        testDate: 'Im not a date',
        pNumber: '123456',
      }];
    case 6:
      return [<IBooking>{
        name: 'helloooooooooooo',
        bookingDate: '2022-01-01',
        vrm: '12345',
        testCode: '1234',
        testDate: '2022-01-01',
        pNumber: '22222222222222',
      }];
    default:
      return [<IBooking>{}];
  }
};
