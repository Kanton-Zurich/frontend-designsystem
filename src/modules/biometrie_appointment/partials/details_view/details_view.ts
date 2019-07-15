import ViewController from '../../util/view-controller.interface';
import Appointment from '../../model/appointment.model';
import CalendarLinkGenerator from '../../service/calendar-link-generator.service';

export interface DetailsViewSelectors {
  reservationDetails: string,
  rescheduleBtn: string,
  calendarLinks: string,
}

class BiometrieDetailsView implements ViewController {
  selectors: DetailsViewSelectors;

  private calendarLinkGenerator: CalendarLinkGenerator;

  private rescheduleCallbackFn: (doReschedule: boolean) => void;

  private appointmentToShow: Appointment;

  logFn: Function;

  constructor(_selectors: any, _calendarLinkGenerator: CalendarLinkGenerator) {
    this.selectors = _selectors;
    this.calendarLinkGenerator = _calendarLinkGenerator;
  }

  public onRescheduleClicked(callback: (doReschedule: boolean) => void): BiometrieDetailsView {
    this.rescheduleCallbackFn = callback;
    return this;
  }

  initEventListeners(eventDelegate): void {
    eventDelegate.on('click', this.selectors.rescheduleBtn, () => {
      this.log('Click on Reschedule');
      this.rescheduleCallbackFn(true);
    });
  }

  public prepareView(appointment: Appointment) {
    this.appointmentToShow = appointment;
    const detailFields = document
      .querySelectorAll<HTMLInputElement>(this.selectors.reservationDetails);
    detailFields.forEach((el) => {
      const fn = el
        .getAttribute('data-biometrie_appointment').replace('reservation-details__', '');
      if (appointment[fn]) {
        el.innerText = appointment[fn];
      }
    });

    const start = appointment.getAppointmentStartDate();
    const end = appointment.getAppointmentEndDate();
    this.fillCalendarLinks(start, end);
  }

  private fillCalendarLinks(start: Date, end: Date): void {
    const calLinkEls = document
      .querySelectorAll<HTMLInputElement>(this.selectors.calendarLinks);
    calLinkEls.forEach((el) => {
      let hrefVal: string;
      const calType = el.getAttribute('data-biometrie_appointment').replace('cal-link__', '');
      if (CalendarLinkGenerator.isSupportedCalType(calType)) {
        hrefVal = this.calendarLinkGenerator.getCalendarLinkHrefVal(calType, start, end);
      }
      el.setAttribute('href', hrefVal);
    });
  }

  log(msg: string, ...args: any[]): void {
    if (this.logFn) {
      this.logFn(msg, args);
    }
  }

  public appendLogFunction(logFn: Function): void {
    this.logFn = logFn;
  }
}

export default BiometrieDetailsView;
