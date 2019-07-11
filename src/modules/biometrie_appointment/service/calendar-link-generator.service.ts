import * as ics from 'ics';

export interface GeneralEventData {
  title: string;
  description?: string;
  location?: string;
  url?: string;
  geo?: {
    lat: number;
    lon: number;
  }
  status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
  startInputType?: 'utc' | 'local';
}
class DateHelper {
  public static getDateIcsFormated(date: Date): number[] {
    return [
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getMinutes(),
    ];
  }

  // "2019-07-11T14:00:01.839Z" -> "20190711T140001Z" for GoogleCal
  public static getStrippedIsoString(date: Date): string {
    return date.toISOString()
      .replace(/[-:]/g, '')
      .replace(/[.]\d{3}/g, '');
  }
}
class CalendarLinkGenerator {
  public static readonly CALENDER_TYPES = {
    ICAL: 'ical',
    GOOGLE: 'google',
    OUTLOOK: 'outlook',
  };
  public static readonly SUPPORTED_CALENDAR_TYPE_IDS = [
    CalendarLinkGenerator.CALENDER_TYPES.ICAL,
    CalendarLinkGenerator.CALENDER_TYPES.GOOGLE,
    // CalendarLinkGenerator.CALENDER_TYPES.OUTLOOK,
  ];
  private generalData: GeneralEventData;

  constructor(generalEventData: GeneralEventData) {
    this.generalData = Object.assign({ status: 'CONFIRMED', startInputType: 'utc' }, generalEventData);
  }

  public static isSupportedCalType(calType: string): boolean {
    return CalendarLinkGenerator.SUPPORTED_CALENDAR_TYPE_IDS.indexOf(calType) > -1;
  }

  public getCalendarLinkHrefVal(calType: string, start: Date, end: Date): string {
    if (calType === CalendarLinkGenerator.CALENDER_TYPES.ICAL) {
      const baseEncodedIcs = this.getIcsBase64String(start, end);
      return `data:application/octet-stream;charset=utf-16le;base64,${baseEncodedIcs}`;
    }
    if (calType === CalendarLinkGenerator.CALENDER_TYPES.GOOGLE) {
      return this.getGoogleCalendarLink(start, end);
    }
    if (calType === CalendarLinkGenerator.CALENDER_TYPES.OUTLOOK) {
      // TODO Outlook uses .ics doesn't it?
      return 'unhandled';
    }
    return '';
  }

  private getGoogleCalendarLink(start: Date, end: Date): string {
    let details = this.generalData.description;
    if (this.generalData.url) {
      const linktag = `<a href="${this.generalData.url}">Link</a>`;
      if (details) {
        details += `, ${linktag}`;
      } else {
        details = linktag;
      }
    }

    const calURL = new URL('https://calendar.google.com/calendar/r/eventedit');
    const { searchParams } = calURL;
    searchParams.append('text', this.generalData.title);
    searchParams.append('details', details);
    searchParams.append('location', this.generalData.location);
    searchParams.append('dates', `${DateHelper.getStrippedIsoString(start)}/${DateHelper.getStrippedIsoString(end)}`);
    searchParams.append('ctz', 'CET');
    return calURL.href;
  }

  private getIcsBase64String(appointmentFrom: Date, appointmentUntil: Date): string {
    const start = DateHelper.getDateIcsFormated(appointmentFrom);
    const end = DateHelper.getDateIcsFormated(appointmentUntil);
    const appointmentData = Object.assign({
      start,
      end,
    }, this.generalData);

    return ics.createEvent(appointmentData, (error, value) => {
      if (error) {
        throw error;
      }
      return window.btoa(unescape(encodeURIComponent(value)));
    });
  }
}

export default CalendarLinkGenerator;
