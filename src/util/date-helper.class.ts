const daysInWeek = 7;
const dowThursday = 4;

const msInDay = 86400000;

class DateHelper {
  public static readonly DAYS_IN_WEEK = daysInWeek;
  public static readonly MS_IN_DAY = msInDay;
  /**
   * Generates a number array representing the DateObject.
   * I.e. "2019-07-11T14:00:01.839Z" -> [ 2017, 7, 11, 14, 0]
   *
   * @param { Date } date date object to parse
   * @returns { number[] } an array of number values
   */
  public static getDateIcsFormated(date: Date): number[] {
    return [
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getMinutes(),
    ];
  }

  /**
   * Generates a string representing a DateObject.
   * I.e. "2019-07-11T14:00:01.839Z" -> "20190711T140001Z"
   *
   * @param { Date } date date object to parse
   * @returns { string } a string like "20190711T140001Z"
   */
  public static getStrippedIsoString(date: Date): string {
    return date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/[.]\d{3}/g, '');
  }

  /**
   * Generates a string representing the date of a DateObject in german language.
   *
   * @param { Date } date date object to parse
   * @returns { string } a string like "Freitag, 19.07.2019"
   */
  public static getVerboseDeDateStr(date: Date): string {
    return date.toLocaleDateString('de', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Generates a string representing the date of a DateObject in german language.
   *
   * @param { Date } date date object to parse
   * @returns { string } a string like "Freitag, 19.07.2019"
   */
  public static getDeDateStr(date: Date): string {
    return date.toLocaleDateString('de', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /**
   * Generates a string representing the time of a DateObject
   *
   * @param { Date } date date object to parse
   * @returns { string } a string like "12:44"
   */
  public static getTrimTimeStr(date: Date): string {
    return date.toLocaleTimeString('de', {
      minute: '2-digit',
      hour: '2-digit',
    });
  }

  /**
   * Calculates the WeekNo to a date.
   *
   * @param { Date } date the date to process
   * @returns { number } the week number
   */
  public static getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + dowThursday - (d.getUTCDay() || DateHelper.DAYS_IN_WEEK));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1)).getTime();
    return Math.ceil(
      ((d.getTime() - yearStart) / DateHelper.MS_IN_DAY + 1) / DateHelper.DAYS_IN_WEEK
    );
  }

  /**
   * Returns another week days date in the same week as the argument date.
   *
   * @param { Date } date the date to process
   * @param { number } dow the day of the week request (i.e. 1 for Monday, 5 for Friday)
   * @returns { Date } the date for the requested weekday.
   */
  public static getWeekDayOfSameWeek(date: Date, dow: number) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? 1 - DateHelper.DAYS_IN_WEEK : dow);
    return new Date(d.setDate(diff));
  }

  /**
   * Returns an array containing the dates of the week the given date lies in.
   *
   * @param { Date } date the date to process
   * @returns { Date[] } an array of dates
   */
  public static getDatesOfWeek(date: Date): Date[] {
    const datesOfWeek: Date[] = [];
    for (let dow = 0; dow <= DateHelper.DAYS_IN_WEEK; dow += 1) {
      const d = new Date(date);
      d.setHours(0, 0, 0);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? 1 - DateHelper.DAYS_IN_WEEK : dow);
      datesOfWeek.push(new Date(d.setDate(diff)));
    }
    return datesOfWeek;
  }

  public static getDateFromString(str: string): Date {
    return new Date(str.replace(/([+-]\d{2})(\d{2})$/g, '$1:$2')); // Adds colon in timezone for IE
  }
}

export default DateHelper;
