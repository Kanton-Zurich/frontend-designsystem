import { ViewController } from '../../util/view-controller.class';
import Timeslot from '../../model/timeslot.model';

/* eslint-disable no-unused-vars */
import Appointment from '../../model/appointment.model';
import DateHelper from '../../../../util/date-helper.class';
import { ApiConnectionFailure, ApiFailureType } from '../../service/migek-api.service';
/* eslint-enable */

export const rescheduleViewSelectorsValues: RescheduleViewSelectors = {
  rescheduleBackLink: '[data-biometrie_appointment=rescheduleBack]',
  otherSlotsContainer: '[data-biometrie_appointment=otherSlotsSelect]',
  capacityMsgTemplate: '[data-biometrie_appointment=capacityMsgTemplate]',
  toPrevWeekBtn: '[data-biometrie_appointment=toPrevWeek]',
  toNextWeekBtn: '[data-biometrie_appointment=toNextWeek]',
  weekIndicator: '[data-biometrie_appointment=selectedWeek]',
  weekRange: '[data-biometrie_appointment=selectedWeekRange]',
  weekDayColumns: '[data-biometrie_appointment=weekDayColumn]',
  weekDayHeads: '[data-biometrie_appointment=weekDayHead]',
  weekDaySlotsContainer: '[data-biometrie_appointment=weekDaySlots]',
  slotSelectTemplate: '[data-biometrie_appointment=slotSelectTemplate]',
  slotEmptyTemplate: '[data-biometrie_appointment=slotEmptyTemplate]',
  slotSelect: '[data-biometrie_appointment=timeSlotSelect]',
  selectionDetailsWrapper: '[data-biometrie_appointment=selection-details__wrapper',
  selectionDetailsDate: '[data-biometrie_appointment=selection-details__date',
  selectionDetailsCapacity: '[data-biometrie_appointment=selection-details__capacity',
  cancelBtn: '[data-biometrie_appointment=cancelBtn]',
  doRescheduleBtn: '[data-biometrie_appointment=doScheduleSelected]',
  slotFullOverlay: '[data-biometrie_appointment=slotFullOverlay]',
};

export interface RescheduleViewSelectors {
  rescheduleBackLink: string,
  otherSlotsContainer: string,
  capacityMsgTemplate: string,
  toPrevWeekBtn: string,
  toNextWeekBtn: string,
  weekIndicator: string,
  weekRange: string,
  weekDayColumns: string,
  weekDayHeads: string,
  weekDaySlotsContainer: string,
  slotSelectTemplate: string,
  slotEmptyTemplate: string,
  slotSelect: string,
  selectionDetailsWrapper: string;
  selectionDetailsDate: string,
  selectionDetailsCapacity: string;
  cancelBtn: string,
  doRescheduleBtn: string,
  slotFullOverlay: string;
}
interface RescheduleViewData {
  appointment: Appointment;
  loading: boolean;
  rescheduled: boolean;
  apiAvailable: boolean;
}
class BiometrieRescheduleView extends ViewController<RescheduleViewSelectors, RescheduleViewData> {
  private firstOpenSlot: Timeslot;
  private allSlots: Timeslot[];
  private selectedSlot: Timeslot;

  private currentNotBefore: Date;
  private nextNotBefore: Date;
  private prevNotBefore: Date[] = [];

  private capacityMsgClone = document
    .querySelector<HTMLDivElement>(this.selectors.capacityMsgTemplate).firstChild.cloneNode(true);
  private otherSlotsContainer = document
    .querySelector<HTMLElement>(this.selectors.otherSlotsContainer);
  private slotFullOverlay = document.querySelector<HTMLElement>(this.selectors.slotFullOverlay);

  constructor(_data: any, _selectors: RescheduleViewSelectors) {
    super(_selectors, _data);
  }

  initEventListeners(eventDelegate): void {
    eventDelegate
      .on('click', this.selectors.rescheduleBackLink, () => {
        this.data.loading = true;
        this.apiService.getReservationDetails()
        // Refresh details, to prevent inconsistency between views
          .then((refreshedAppointment) => {
            this.data.appointment = refreshedAppointment;
          })
          .finally(() => {
            this.data.loading = false;
          });
        this.resetView(true);
      })
      .on('click', this.selectors.toNextWeekBtn, () => {
        this.log('Request to next week slots triggered');
        this.getAndRenderWeek();
      })
      .on('click', this.selectors.toPrevWeekBtn, () => {
        this.log('Request to previous week slots triggered');
        this.getAndRenderWeek(false);
      })
      .on('click', this.selectors.cancelBtn, () => {
        this.prepareView();
        this.resetView();
      })
      .on('click', this.selectors.doRescheduleBtn, () => {
        this.requestTimeslot(this.selectedSlot);
      });
  }


  private requestTimeslot(timeslot: Timeslot): void {
    if (timeslot) {
      this.data.loading = true;
      const p = timeslot.payload;
      this.apiService.rescheduleTo(p.startTime, p.endTime)
        .then((appointment) => {
          this.data.rescheduled = true;
          this.data.appointment = appointment;
        }).catch((rejectionCause) => {
          this.log('Postpone request rejected');

          if (rejectionCause && rejectionCause instanceof ApiConnectionFailure) {
            if ((rejectionCause as ApiConnectionFailure).type === ApiFailureType.SLOT_FULL) {
              this.slotFullOverlay.classList.add('show');
              return;
            }
          }
          this.handleFatal(rejectionCause);
        }).finally(() => {
          this.data.loading = false;
        });
    }
  }

  public prepareView(): void {
    this.data.loading = true;
    this.apiService.getTimeSlots().then((timeslots) => {
      this.log('Timeslots', timeslots);

      if (timeslots && timeslots.length > 0) {
        this.allSlots = timeslots
          .map(p => new Timeslot(p))
          .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

        const { 0: nextOpen } = this.allSlots.filter(slot => slot.capacity > 0);
        this.firstOpenSlot = nextOpen;

        this.prepareSlotsSelectView();
      }
    }).catch((rejectionCause) => {
      this.handleFatal(rejectionCause);
    }).finally(() => {
      this.data.loading = false;
    });
  }

  private getAndRenderWeek(doGetNextWeek = true): void {
    this.data.loading = true;
    const notBeforeDate = doGetNextWeek ? this.nextNotBefore : this.prevNotBefore.pop();
    this.apiService.getTimeSlots(notBeforeDate).then((timeslots) => {
      if (timeslots && timeslots.length > 0) {
        if (doGetNextWeek) {
          this.prevNotBefore.push(this.currentNotBefore);
        }
        this.allSlots = timeslots
          .map(p => new Timeslot(p))
          .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

        this.resetView();
        this.prepareSlotsSelectView();
      }
    }).catch((rejectionCause) => {
      this.handleFatal(rejectionCause);
    }).finally(() => {
      this.data.loading = false;
    });
  }

  private nextBtnActive(active: boolean) {
    this.toggleSetClass(
      document.querySelector<HTMLElement>(this.selectors.toNextWeekBtn),
      'disabled',
      !active,
    );
  }

  private prevBtnActive(active: boolean) {
    this.toggleSetClass(
      document.querySelector<HTMLElement>(this.selectors.toPrevWeekBtn),
      'disabled',
      !active,
    );
  }

  private toggleSetClass(el: HTMLElement, className: string, doSet: boolean) {
    const classlist = el.classList;
    const currentlySet = classlist.contains(className);
    if (doSet && !currentlySet) {
      classlist.add(className);
    } else if (!doSet && currentlySet) {
      classlist.remove(className);
    }
  }

  private prepareSlotsSelectView(): void {
    const { 0: earliest } = this.allSlots;
    const earliestDate = earliest.startDate;
    // Enable prev week btn only if the current slots earliest date is after the next slots date.
    this.prevBtnActive(this.firstOpenSlot.startDate.getTime() < earliestDate.getTime());

    const weekNo = DateHelper.getWeekNumber(earliestDate);
    const weekIndicator = document
      .querySelector<HTMLElement>(this.selectors.weekIndicator);
    weekIndicator.innerText = `KW ${weekNo.toString()}`;

    const weeksDates = DateHelper.getDatesOfWeek(earliestDate);
    // Setting sunday as the "notBefore" parameter for request to this weeks timeslots.
    this.currentNotBefore = weeksDates.shift();
    // Setting saturday as the "notBefore" parameter for next week request (and remove from array)
    this.nextNotBefore = weeksDates.pop();
    const [weeksMonday,,,, weeksFriday ] = weeksDates;
    const weekRangeEl = document
      .querySelector<HTMLElement>(this.selectors.weekRange);
    weekRangeEl.innerText = `${DateHelper.getDeDateStr(weeksMonday)}-${DateHelper.getDeDateStr(weeksFriday)}`;

    const openSlotsPerWeekDay: Timeslot[][] = [];
    let maxSlotsPerDay = 0;
    let totalSlotsInWeek = 0;
    weeksDates.forEach((date, i) => {
      const filteredForDay = this.allSlots.filter((slot) => {
        const { startDate } = slot;
        return startDate > date && startDate < weeksDates[i + 1];
      });
      maxSlotsPerDay = Math.max(maxSlotsPerDay, filteredForDay.length);
      totalSlotsInWeek += filteredForDay.length;
      openSlotsPerWeekDay.push(filteredForDay);
    });

    // Disable next btn if there are no more slots than shown in this week.
    this.nextBtnActive(totalSlotsInWeek < this.allSlots.length);

    this.otherSlotsContainer = document
      .querySelector<HTMLElement>(this.selectors.otherSlotsContainer);

    this.fillWeekDayTableHeads(weeksDates);

    const slotSelectTemplate = document
      .querySelector<HTMLElement>(this.selectors.slotSelectTemplate).firstElementChild;
    const slotEmptyTemplate = document
      .querySelector<HTMLElement>(this.selectors.slotEmptyTemplate).firstElementChild;

    const weekdayColumnsNodeList = this.otherSlotsContainer
      .querySelectorAll<HTMLDivElement>(this.selectors.weekDayColumns);
    weekdayColumnsNodeList.forEach((colEl, i) => {
      const daysSlots = openSlotsPerWeekDay[i].filter(slot => slot.capacity > 0);
      if (daysSlots.length > 0) {
        colEl.classList.remove('no-slots-available');
        const slotsCon = colEl.querySelector<HTMLElement>(this.selectors.weekDaySlotsContainer);
        slotsCon.innerHTML = ''; // empty

        daysSlots.forEach((timeslot) => {
          if (timeslot.capacity > 0) {
            this.appendSlotBtn(slotsCon, slotSelectTemplate, timeslot);
          } else {
            slotsCon.appendChild(document.importNode(slotEmptyTemplate, true));
          }
        });
      } else if (!colEl.classList.contains('no-slots-available')) {
        colEl.classList.add('no-slots-available');
      }
    });
    // after rendering select the first slot available if none selected.
    if (!this.selectedSlot) {
      const firstFoundSlot = this.otherSlotsContainer
        .querySelector<HTMLElement>('[data-timeslot-id]');
      if (firstFoundSlot) {
        firstFoundSlot.click();
        const detailWrapper = document
          .querySelector<HTMLElement>(this.selectors.selectionDetailsWrapper);
        detailWrapper.classList.add('next');
      }
    }
  }

  private appendSlotBtn(slotsCon: HTMLElement,
    templateContent: Element, timeslot: Timeslot): void {
    if (templateContent) {
      const slotElement = document.importNode(templateContent, true);
      const { innerHTML } = slotElement;
      const timeStr = timeslot.getTimeStr();
      const startDateStr = DateHelper.getTrimTimeStr(timeslot.startDate);
      const timeHtml = `<span class="hidden-small-down">${timeStr}</span><span class="hidden-small-up">${startDateStr}</span>`;
      if (innerHTML) {
        slotElement.innerHTML = innerHTML.replace('{timeslot-range}', timeHtml);
      }
      const slotSelect = slotElement.querySelector(this.selectors.slotSelect);
      if (slotSelect) {
        slotSelect.setAttribute('data-timeslot-id', timeslot.id);
        slotSelect.addEventListener('click', ev => this.onSlotSelect(ev));
      }

      slotsCon.appendChild(slotElement);
    }
  }

  private fillWeekDayTableHeads(weeksDates: Date[]): void {
    const weekdayHeads = this.otherSlotsContainer
      .querySelectorAll<HTMLDivElement>(this.selectors.weekDayHeads);
    weekdayHeads.forEach((headEl, i) => {
      const colDate = weeksDates[i];
      const dayName = colDate.toLocaleDateString('de', {
        weekday: 'long',
      });
      // eslint-disable-next-line no-magic-numbers
      const dayShort = dayName.substr(0, 2);
      const dayDate = colDate.toLocaleDateString('de', {
        day: '2-digit',
      });
      headEl.innerHTML = `<div class="weekday-head__day_short">${dayShort}</div><div class="weekday-head__day">${dayName}</div><div class="weekday-head__date">${dayDate}</div>`;
    });
  }

  private onSlotSelect(ev: Event): void {
    const target = ev.currentTarget;
    if (target && target instanceof HTMLElement) {
      // unselect others
      document.querySelectorAll<HTMLElement>(this.selectors.slotSelect).forEach((el) => {
        el.classList.remove('selected');
      });
      this.doSlotSelect(target);
    }
  }

  private doSlotSelect(target: HTMLElement): void {
    if (target) {
      const timeSlotId = target.getAttribute('data-timeslot-id');
      this.selectedSlot = this.allSlots.find(slot => slot.id === timeSlotId);
      this.fillInSlotDetails(this.selectedSlot);

      target.classList.add('selected');
    }
  }

  private fillInSlotDetails(slot?: Timeslot): void {
    const detailWrapper = document
      .querySelector<HTMLElement>(this.selectors.selectionDetailsWrapper);
    const detailDate = document.querySelector<HTMLElement>(this.selectors.selectionDetailsDate);
    const detailCapacity = document
      .querySelector<HTMLElement>(this.selectors.selectionDetailsCapacity);
    if (slot) {
      detailWrapper.classList.add('show');
      detailWrapper.classList.remove('next');
      detailDate.innerText = `${slot.getDateStr()} ${slot.getTimeStr()}`;

      const capacityMsg = this.capacityMsgClone.textContent;
      detailCapacity.innerText = capacityMsg.replace('{schalter}', slot.capacity.toString());
    } else {
      detailWrapper.classList.remove('show');
      detailDate.innerText = '';
      detailCapacity.innerText = '';
    }
  }

  /**
   * Method to handle exceptions that the current view can not recover from.
   * @param exception
   */
  private handleFatal(exception): void {
    this.log('Unexpected exception connecting to API', exception);
    this.data.apiAvailable = true;
  }

  private resetView(doClearSelection?: boolean): void {
    this.slotFullOverlay.classList.remove('show');
    document.querySelectorAll<HTMLElement>(this.selectors.weekDaySlotsContainer)
      .forEach((slotCon) => {
        slotCon.innerHTML = '';
      });

    if (doClearSelection) {
      this.fillInSlotDetails();
    }
  }
}
export default BiometrieRescheduleView;
