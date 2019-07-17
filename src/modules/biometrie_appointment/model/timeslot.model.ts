import moment, { Moment } from 'moment';
import { TimeslotPayload } from './api-payload.interfaces';

class Timeslot {
  from: string;
  until: string;
  start: Moment;
  end: Moment;

  constructor(timeslot: TimeslotPayload) {
    this.from = timeslot.startTime;
    this.until = timeslot.endTime;

    this.start = moment(this.from);
    this.end = moment(this.until);
  }

  public getDateStr(): string {
    return this.start.format('dddd, DD.MM.YYYY');
  }

  public getTimeStr(): string {
    return `${this.start.format('hh:mm')}-${this.end.format('hh:mm')}`;
  }
}

export default Timeslot;
