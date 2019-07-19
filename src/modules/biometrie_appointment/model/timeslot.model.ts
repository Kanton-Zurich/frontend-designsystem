import { TimeslotPayload } from './api-payload.interfaces';
import DateHelper from '../../../util/date-helper.class';

class Timeslot {
  public readonly payload: TimeslotPayload;

  constructor(timeslotPayload: TimeslotPayload) {
    this.payload = timeslotPayload;
  }

  get startDate(): Date {
    return new Date(this.payload.startTime);
  }

  get endDate(): Date {
    return new Date(this.payload.endTime);
  }

  get capacity(): number {
    return this.payload.capacity;
  }

  public getDateStr(): string {
    return DateHelper.getDeDateStr(this.startDate);
  }

  public getTimeStr(): string {
    const fromTime = DateHelper.getTrimTimeStr(this.startDate);
    const toTime = DateHelper.getTrimTimeStr(this.endDate);
    return `${fromTime}-${toTime}`;
  }
}

export default Timeslot;
