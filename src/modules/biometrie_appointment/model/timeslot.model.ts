import DateHelper from '../../../util/date-helper.class';

// TODO: Marked as unused by eslint although required (?)
/* eslint-disable no-unused-vars */
import { TimeslotPayload } from './api-payload.interfaces';
/* eslint-enable */

class Timeslot {
  public readonly id: string;
  public readonly payload: TimeslotPayload;

  constructor(timeslotPayload: TimeslotPayload) {
    this.payload = timeslotPayload;

    this.id = this.startDate.getTime().toString();
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
    return DateHelper.getVerboseDeDateStr(this.startDate);
  }

  public getTimeStr(): string {
    const fromTime = DateHelper.getTrimTimeStr(this.startDate);
    const toTime = DateHelper.getTrimTimeStr(this.endDate);
    return `${fromTime}-${toTime}`;
  }
}

export default Timeslot;
