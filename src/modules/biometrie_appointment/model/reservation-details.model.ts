

export interface ReservationDetails {
  id: number;
  from: string;
  until: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
}

class Reservation {
  private details: ReservationDetails;
  private locale: string[] = ['de-CH'];

  private timeFormatOptions = { hour: '2-digit', minute: '2-digit' };

  constructor(_details: ReservationDetails, _locale?: string) {
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
    const date = this.getAppointmentDate();
    return date.toLocaleDateString(this.locale);
  }

  get fromTimeString(): string {
    const fromDate = new Date(this.details.from);
    return fromDate.toLocaleTimeString(this.locale, this.timeFormatOptions);
  }

  get untilTimeString(): string {
    const untilDate = new Date(this.details.until);
    return untilDate.toLocaleTimeString(this.locale, this.timeFormatOptions);
  }

  getAppointmentDate(): Date {
    return new Date(this.details.from);
  }
}

export default Reservation;
