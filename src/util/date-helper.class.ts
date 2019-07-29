class DateHelper {
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
    return date.toISOString()
      .replace(/[-:]/g, '')
      .replace(/[.]\d{3}/g, '');
  }

  /**
   * Generates a string representing the date of a DateObject in german language.
   *
   * @param { Date } date date object to parse
   * @returns { string } a string like "Freitag, 19.07.2019"
   */
  public static getDeDateStr(date: Date): string {
    return date.toLocaleDateString('de', {
      weekday: 'long',
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
}

export default DateHelper;
