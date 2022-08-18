import { IDynamicsBooking } from './IDynamicsBooking';

export interface IEventEntry {
  Source: string;
  EventBusName: string;
  DetailType: string;
  Time: Date;
  Detail: string;
}
