/* eslint-disable */
import { ViewController } from '../../util/view-controller.class';
import Appointment from '../../model/appointment.model';
import CalendarLinkGenerator from '../../service/calendar-link-generator.service';
import MigekApiService from '../../service/migek-api.service';

export const detailViewSelectors: DetailsViewSelectors = {
  reservationDetails: '[data-biometrie_appointment^=reservation-details__]',
  rescheduleBtn: '[data-biometrie_appointment=reschedule]',
  calendarLinks: '[data-biometrie_appointment^=cal-link__]',
  rescheduleSuccesssBox: '[data-biometrie_appointment=reschedule-success]',
  printConfirmationBtn: '[data-biometrie_appointment=printConfirmation]',
};
export interface DetailsViewSelectors {
  reservationDetails: string;
  rescheduleBtn: string;
  printConfirmationBtn: string;
  rescheduleSuccesssBox: string;
  calendarLinks: string;
}
interface DetailsViewData {
  appointment: Appointment;
  loading: boolean;
  rescheduled: boolean;
}
class BiometrieDetailsView extends ViewController<DetailsViewSelectors, DetailsViewData> {
  private calendarLinkGenerator: CalendarLinkGenerator;
  private apiService: MigekApiService;

  private rescheduleCallbackFn: (doReschedule: boolean) => void;

  private appointmentToShow: Appointment;

  constructor(_data: any, _selectors: DetailsViewSelectors, _logFn: Function,
    _apiService: MigekApiService, _calendarLinkGenerator: CalendarLinkGenerator) {
    super(_selectors, _data as DetailsViewData, _logFn);
    this.calendarLinkGenerator = _calendarLinkGenerator;
    this.apiService = _apiService;
  }

  public onRescheduleClicked(callback: (doReschedule: boolean) => void): BiometrieDetailsView {
    this.rescheduleCallbackFn = callback;
    return this;
  }

  initEventListeners(eventDelegate): void {
    eventDelegate.on('click', this.selectors.rescheduleBtn, () => {
      this.log('Click on Reschedule');
      this.rescheduleCallbackFn(true);
    }).on('click', this.selectors.printConfirmationBtn, () => {
      this.log('Click confirmation print');
      this.doPrintConfirmation();
    });
  }

  public prepareView() {
    if (this.data.rescheduled) {
      const successBox = document
        .querySelector<HTMLInputElement>(this.selectors.rescheduleSuccesssBox);
      successBox.classList.add('visible');
    }
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

  private doPrintConfirmation(): void {
    this.apiService.triggerConfirmationDownload();
  }
}

export default BiometrieDetailsView;
