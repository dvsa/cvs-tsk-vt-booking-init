import config from '../../../src/config';
import { Booking } from '../../../src/interfaces/Booking';
import { Entries } from '../../../src/interfaces/Entries';
import { EventEntry } from '../../../src/interfaces/EventEntry';

export const mDynamicsEvent: Entries = <Entries>{
  Entries: [
    <EventEntry>{
      Source: config.aws.eventBusSource,
      Detail: JSON.stringify(<Booking>{
        name: 'hello',
        bookingDate: '2022-01-01',
        vrm: '12345',
        testCode: '123',
        testDate: '2022-01-01',
        pNumber: '12345',
      }),
      DetailType: 'CVS Test Booking',
      EventBusName: config.aws.eventBusName,
      Time: new Date('2022-01-01'),
    },
  ],
};

export const mDynamicsFailedEvent: Entries = <Entries>{
  Entries: [
    <EventEntry>{
      Source: config.aws.eventBusSource,
      Detail: JSON.stringify(<Booking>{
        name: 'Error',
        bookingDate: '2022-01-01',
        vrm: '12345',
        testCode: '123',
        testDate: '2022-01-01',
        pNumber: '12345',
      }),
      DetailType: 'CVS Test Booking',
      EventBusName: config.aws.eventBusName,
      Time: new Date('2022-01-01'),
    },
  ],
};
