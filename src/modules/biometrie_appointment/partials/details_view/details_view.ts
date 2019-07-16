import { ViewController } from '../../util/view-controller.class';
import Appointment from '../../model/appointment.model';
import CalendarLinkGenerator from '../../service/calendar-link-generator.service';

export interface DetailsViewSelectors {
  reservationDetails: string,
  rescheduleBtn: string,
  calendarLinks: string,
}
interface DetailsViewData {
  appointment: Appointment;
  loading: boolean;
}
class BiometrieDetailsView extends ViewController<DetailsViewSelectors, DetailsViewData> {
  private calendarLinkGenerator: CalendarLinkGenerator;

  private rescheduleCallbackFn: (doReschedule: boolean) => void;

  private appointmentToShow: Appointment;

  constructor(_data: any, _selectors: DetailsViewSelectors, _logFn: Function, _calendarLinkGenerator: CalendarLinkGenerator) {
    super(_selectors, _data as DetailsViewData, _logFn);
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

  public prepareView() {
    const { appointment } = this.data;

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
}

export default BiometrieDetailsView;
