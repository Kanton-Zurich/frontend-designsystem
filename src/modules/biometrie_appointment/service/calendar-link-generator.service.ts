import DateHelper from '../../../util/date-helper.class';

export interface GeneralEventData {
  title: string;
  description?: string;
  htmlDescription?: string;
  location?: string;
  url?: string;
  geo?: {
    lat: number;
    lon: number;
  }
  status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
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
    let details = this.generalData.htmlDescription
      ? this.generalData.htmlDescription : this.generalData.description;
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
    const value = this.buildIcsFileContent({
      start: appointmentFrom,
      end: appointmentUntil,
      summary: this.generalData.title,
    });
    return window.btoa(unescape(encodeURIComponent(value)));
  }

  private buildIcsFileContent(eventData: {
    start: Date;
    end: Date;
    summary: string;
  }): string {
    const dtstamp = DateHelper.getStrippedIsoString(new Date());
    const dtstart = DateHelper.getStrippedIsoString(eventData.start);
    const dtend = DateHelper.getStrippedIsoString(eventData.end);

    let contentStr = 'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nPRODID:czbdev\nMETHOD:PUBLISH\nX-PUBLISHED-TTL:PT1H\nBEGIN:VEVENT\n';

    contentStr += `UID:${this.generateGuid()}\n`;
    contentStr += `SUMMARY:${eventData.summary}\n`;

    contentStr += `DTSTAMP:${dtstamp}\n`;
    contentStr += `DTSTART:${dtstart}\n`;
    contentStr += `DTEND:${dtend}\n`;

    if (this.generalData.geo) {
      const geoStr = `${this.generalData.geo.lat};${this.generalData.geo.lon}`;
      contentStr += `GEO:${geoStr}\n`;
    }

    if (this.generalData.location) {
      contentStr += `LOCATION:${this.generalData.location}\n`;
    }

    let escapedDesc = '';
    if (this.generalData.description) {
      escapedDesc += this.generalData.description
        .replace(/\n/gm, '\\n');
    }
    if (this.generalData.url) {
      escapedDesc += `\\n\\n${this.generalData.url}\\n\\n`;
    }
    contentStr += `DESCRIPTION:${escapedDesc}\n`;

    if (this.generalData.htmlDescription) {
      contentStr += `X-ALT-DESC;FMTTYPE=text/html:${this.generalData.htmlDescription}\n`;
    }

    contentStr += 'STATUS:CONFIRMED\n';

    contentStr += 'END:VEVENT\nEND:VCALENDAR';
    return contentStr;
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // Sorry! I dont intend to translate this hence disabling linting.
      /* eslint-disable no-bitwise, no-magic-numbers, no-mixed-operators */
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
      /* eslint-enable */
    });
  }
}

export default CalendarLinkGenerator;
