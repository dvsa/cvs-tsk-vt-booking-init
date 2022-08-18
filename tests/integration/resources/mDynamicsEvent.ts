import config from '../../../src/config';
import { IDynamicsBooking } from '../../../src/interfaces/IDynamicsBooking';
import { IEntries } from '../../../src/interfaces/IEntries';
import { IEventEntry } from '../../../src/interfaces/IEventEntry';

export const mDynamicsEvent: IEntries = <IEntries>{
  Entries: [
    <IEventEntry>{
      Source: config.aws.eventBusSource,
      Detail: JSON.stringify(<IDynamicsBooking>{
        name: 'hello',
        bookingDate: '2022-01-01',
        vrm: '12345',
        testCode: '12345',
        testDate: '2022-01-01',
        pNumber: '12345',
      }),
      DetailType: 'CVS Test Booking',
      EventBusName: config.aws.eventBusName,
      Time: new Date('2022-01-01'),
    },
  ],
};
