import moment, { Moment } from 'moment';
import { TimeslotPayload } from './api-payload.interfaces';

class Timeslot {
  from: string;
  until: string;
  start: Moment;
  end: Moment;
  capacity: number;

  constructor(timeslotPayload: TimeslotPayload) {
    this.from = timeslotPayload.startTime;
    this.until = timeslotPayload.endTime;

    this.start = moment(this.from);
    this.end = moment(this.until);

    this.capacity = timeslotPayload.capacity;
  }

  public getDateStr(): string {
    return this.start.format('dddd, DD.MM.YYYY');
  }

  public getTimeStr(): string {
    return `${this.start.format('hh:mm')}-${this.end.format('hh:mm')}`;
  }
}

export default Timeslot;
