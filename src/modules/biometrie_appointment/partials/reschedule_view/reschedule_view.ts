import { ViewController } from '../../util/view-controller.class';
import Timeslot from '../../model/timeslot.model';
import MigekApiService from '../../service/migek-api.service';
import Appointment from '../../model/appointment.model';

export const rescheduleViewSelectorsValues: RescheduleViewSelectors = {
  rescheduleBackLink: '[data-biometrie_appointment=rescheduleBack]',
  nextOpenSlotField: '[data-biometrie_appointment=nextOpenSlot]',
  nextOpenSlotCapacity: '[data-biometrie_appointment=nextOpenSlot__capacity]',
  otherSlotsContainer: '[data-biometrie_appointment=otherSlotsSelect]',
  rescheduleToNextBtn: '[data-biometrie_appointment=doRescheduleNext]',
};

export interface RescheduleViewSelectors {
  rescheduleBackLink: string,
  nextOpenSlotField: string,
  nextOpenSlotCapacity: string;
  otherSlotsContainer: string,
  rescheduleToNextBtn: string,
}
interface RescheduleViewData {
  appointment: Appointment;
  loading: boolean;
  rescheduled: boolean;
}
class BiometrieRescheduleView extends ViewController<RescheduleViewSelectors, RescheduleViewData> {
  private apiService: MigekApiService;

  private nextOpenSlot: Timeslot;

  constructor(_data: any, _selectors: RescheduleViewSelectors, _logFn: Function, _apiService: MigekApiService) {
    super(_selectors, _data, _logFn);
    this.apiService = _apiService;
  }

  initEventListeners(eventDelegate): void {
    eventDelegate
      .on('click', this.selectors.rescheduleToNextBtn, () => {
        this.log('Do Reschedule to next open slot.');
        if (this.nextOpenSlot) {
          this.requestTimeslot(this.nextOpenSlot);
        }
      })
      .on('click', this.selectors.rescheduleBackLink, () => {
        this.log('Backlink clicked.');
        this.data.loading = true;
        this.apiService.getReservationDetails()
          // Refresh details, to prevent inconsistency between views
          .then((refreshedAppointment) => {
            this.data.appointment = refreshedAppointment;
          })
          .finally(() => {
            this.data.loading = false;
          });
        if (this.nextOpenSlot) {
          this.apiService.rescheduleToTimeslot(this.nextOpenSlot);
        }
      });
  }

  private requestTimeslot(timeslot: Timeslot): void {
    if (timeslot) {
      this.apiService.rescheduleToTimeslot(timeslot)
        .then((appointment) => {
          this.data.rescheduled = true;
          this.data.appointment = appointment;
        });
    }
  }

  public prepareView(): void {
    this.apiService.getTimeSlots().then((timeslots) => {
      this.log('Timeslots', timeslots);

      if (timeslots && timeslots.length > 0) {
        const openSlots = timeslots.filter(slot => slot.capacity > 0);
        const nextSlot = new Timeslot(openSlots[0]);
        const nextOpenSpan = document
          .querySelector<HTMLElement>(this.selectors.nextOpenSlotField);
        nextOpenSpan.innerText = `${nextSlot.getDateStr()} ${nextSlot.getTimeStr()}`;
        const nextOpenCapacityField = document
          .querySelector<HTMLElement>(this.selectors.nextOpenSlotCapacity);
        nextOpenCapacityField.innerText = nextSlot.capacity.toString();

        this.nextOpenSlot = nextSlot;
      }
    });
  }
}
export default BiometrieRescheduleView;
