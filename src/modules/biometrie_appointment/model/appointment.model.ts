import DateHelper from '../../../util/date-helper.class';
/* eslint-disable no-unused-vars */
import { AppointmentPayload } from './api-payload.interfaces';
/* eslint-enable */

class Appointment {
  private details: AppointmentPayload;
  private locale: string[] = ['de-CH'];

  private timeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  private dateFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    weekday: 'short',
    year: 'numeric',
  };

  constructor(_details: AppointmentPayload, _locale?: string) {
    this.details = _details;

    if (_locale) {
      this.locale.unshift(_locale);
    }
  }

  get firstName(): string {
    return this.details.firstName;
  }

  get lastName(): string {
    return this.details.lastName;
  }

  get dateOfBirth(): string {
    return this.details.dateOfBirth;
  }

  get appointmentDateString(): string {
    const date = this.getAppointmentStartDate();
    return date.toLocaleDateString(this.locale, this.dateFormatOptions).replace('.', '');
  }

  get fromTimeString(): string {
    const fromDate = DateHelper.getDateFromString(this.details.from);
    return fromDate.toLocaleTimeString(this.locale, this.timeFormatOptions);
  }

  get untilTimeString(): string {
    const untilDate = DateHelper.getDateFromString(this.details.until);
    return untilDate.toLocaleTimeString(this.locale, this.timeFormatOptions);
  }

  getAppointmentStartDate(): Date {
    return DateHelper.getDateFromString(this.details.from);
  }

  getAppointmentEndDate(): Date {
    return DateHelper.getDateFromString(this.details.until);
  }
}

export default Appointment;
