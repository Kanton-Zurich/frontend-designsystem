import ViewController from '../../util/view-controller.interface';
import Timeslot from '../../model/timeslot.model';
import MigekApiService from '../../service/migek-api.service';

export interface RescheduleViewSelectors {
  nextOpenSlotField: string,
  otherSlotsContainer: string,
  rescheduleToNextBtn: string,
}

class BiometrieRescheduleView implements ViewController {
  selectors: RescheduleViewSelectors;
  logFn: Function;

  private apiService: MigekApiService;

  private nextOpenSlot: Timeslot;

  constructor(_selectors: RescheduleViewSelectors, _apiService: MigekApiService) {
    this.selectors = _selectors;
    this.apiService = _apiService;
  }

  initEventListeners(eventDelegate): void {
    eventDelegate.on('click', this.selectors.rescheduleToNextBtn, () => {
      this.log('Do Reschedule to next open slot.');
      if (this.nextOpenSlot) {
        this.apiService.rescheduleToTimeslot(this.nextOpenSlot);
      }
    });
  }

  public prepareView(): void {
    this.apiService.getTimeSlots().then((timeslots) => {
      this.log('Timeslots', timeslots);

      if (timeslots && timeslots.length > 0) {
        const nextSlot = new Timeslot(timeslots[0]);
        const nextOpenSpan = document
          .querySelector<HTMLElement>(this.selectors.nextOpenSlotField);
        nextOpenSpan.innerText = `${nextSlot.getDateStr()} ${nextSlot.getTimeStr()}`;
        this.nextOpenSlot = nextSlot;
      }
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
export default BiometrieRescheduleView;
