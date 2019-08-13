import { ViewController } from '../../util/view-controller.class';
import Timeslot from '../../model/timeslot.model';

/* eslint-disable no-unused-vars */
import Appointment from '../../model/appointment.model';
import DateHelper from '../../../../util/date-helper.class';
import { ApiConnectionFailure, ApiFailureType } from '../../service/migek-api.service';
/* eslint-enable */

// Selector groups
const NEXT_DETAILS_GROUP_STR = 'nextslot-details__';
const SELECTION_DETAILS_GROUP_STR = 'selection-details__';
const SLOT_DETAILS = {
  wrapper: 'wrapper',
  date: 'date',
  capacity: 'capacity',
};
export const rescheduleViewSelectorsValues: RescheduleViewSelectors = {
  rescheduleBackLink: '[data-biometrie_appointment=rescheduleBack]',
  nextOpenSlotDetails: `[data-biometrie_appointment^=${NEXT_DETAILS_GROUP_STR}]`,
  rescheduleToNextBtn: '[data-biometrie_appointment=doRescheduleNext]',
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
  slotTimescaleTemplate: '[data-biometrie_appointment=slotTimescaleTemplate]',
  timescaleCon: '[data-biometrie_appointment=timescale]',
  slotSelect: '[data-biometrie_appointment=timeSlotSelect]',
  selectionDetails: `[data-biometrie_appointment^=${SELECTION_DETAILS_GROUP_STR}]`,
  cancelBtn: '[data-biometrie_appointment=cancelBtn]',
  doRescheduleBtn: '[data-biometrie_appointment=doScheduleSelected]',
  slotFullOverlay: '[data-biometrie_appointment=slotFullOverlay]',
};

export interface RescheduleViewSelectors {
  rescheduleBackLink: string,
  nextOpenSlotDetails: string,
  rescheduleToNextBtn: string,
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
  slotTimescaleTemplate: string,
  timescaleCon: string,
  slotSelect: string,
  selectionDetails: string,
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
const SLOTS_MAX_WITHOUT_SCROLL = 11; // TODO: Configurable?
const MIN_SLOTS_FOR_DETAILED_VIEW = 33; // TODO: Configurable?
class BiometrieRescheduleView extends ViewController<RescheduleViewSelectors, RescheduleViewData> {
  private allSlots: Timeslot[];
  private nextOpenSlot: Timeslot;
  private selectedSlot: Timeslot;

  private currentNotBefore: Date;
  private nextNotBefore: Date;
  private prevNotBefore: Date[] = [];

  private compressedView = true;
  private detailedView = false;

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
      .on('click', this.selectors.rescheduleToNextBtn, () => {
        this.log('Do Reschedule to next open slot.');
        if (this.nextOpenSlot) {
          this.requestTimeslot(this.nextOpenSlot);
        }
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
        this.fillInSlotDetails(
          document.querySelectorAll<HTMLElement>(this.selectors.nextOpenSlotDetails),
          NEXT_DETAILS_GROUP_STR,
          nextOpen,
        );
        this.nextOpenSlot = nextOpen;

        this.prepareOtherSlotsSelectView();
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
      this.log('Timeslots', timeslots);

      if (timeslots && timeslots.length > 0) {
        if (doGetNextWeek) {
          this.prevNotBefore.push(this.currentNotBefore);
        }
        this.allSlots = timeslots
          .map(p => new Timeslot(p))
          .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

        this.resetView();
        this.prepareOtherSlotsSelectView();
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

  private prepareOtherSlotsSelectView(): void {
    const { 0: earliest } = this.allSlots;
    const earliestDate = earliest.startDate;
    // Enable prev week btn only if the current slots earliest date is after the next slots date.
    this.prevBtnActive(this.nextOpenSlot.startDate.getTime() < earliestDate.getTime());

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
    this.compressedView = maxSlotsPerDay < SLOTS_MAX_WITHOUT_SCROLL;
    this.detailedView = totalSlotsInWeek > MIN_SLOTS_FOR_DETAILED_VIEW;

    // Disable next btn if there are no more slots than shown in this week.
    this.nextBtnActive(totalSlotsInWeek < this.allSlots.length);

    this.otherSlotsContainer = document
      .querySelector<HTMLElement>(this.selectors.otherSlotsContainer);
    if (maxSlotsPerDay > SLOTS_MAX_WITHOUT_SCROLL) {
      this.otherSlotsContainer.nextElementSibling.classList.add('dropshadow-top');
    } else {
      this.otherSlotsContainer.nextElementSibling.classList.remove('dropshadow-top');
    }

    let idxWithMax;
    // detect one of the most filled columns for timescale rendering
    if (this.detailedView) {
      idxWithMax = openSlotsPerWeekDay.findIndex(slots => slots.length >= maxSlotsPerDay);
    }

    this.fillWeekDayTableHeads(weeksDates);

    const slotSelectTemplate = document
      .querySelector<HTMLElement>(this.selectors.slotSelectTemplate).firstElementChild;
    const slotEmptyTemplate = document
      .querySelector<HTMLElement>(this.selectors.slotEmptyTemplate).firstElementChild;

    const weekdayColumnsNodeList = this.otherSlotsContainer
      .querySelectorAll<HTMLDivElement>(this.selectors.weekDayColumns);
    weekdayColumnsNodeList.forEach((colEl, i) => {
      let daysSlots = openSlotsPerWeekDay[i];
      if (this.compressedView) {
        daysSlots = daysSlots.filter(slot => slot.capacity > 0);
      }
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
        if (this.detailedView && idxWithMax === i) {
          this.fillAndShowTimeScale(daysSlots);
        }
      } else if (!colEl.classList.contains('no-slots-available')) {
        colEl.classList.add('no-slots-available');
      }
    });
  }

  private appendSlotBtn(slotsCon: HTMLElement,
    templateContent: Element, timeslot: Timeslot): void {
    if (templateContent) {
      const slotElement = document.importNode(templateContent, true);
      // const slotElement = clone.firstElementChild;
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
      headEl.innerHTML = colDate.toLocaleDateString('de', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
      }).replace(', ', '<br>');
    });
  }

  /**
   * Fill the timescale container for detailed view (i.e. when there are many slots available)
   * or empty the container if no slots are given
   *
   * @param { Timeslot[] } slots an array of timeslots from which to receive the time strings.
   *    If omitted this method will empty the timescale container.
   */
  private fillAndShowTimeScale(slots?: Timeslot[]): void {
    const timescale = this.otherSlotsContainer.querySelector(this.selectors.timescaleCon);
    timescale.innerHTML = '';

    if (slots && slots.length > 0) {
      this.log('Rendering timescale for detailed view.');
      const timescaleSlotTemplate = document
        .querySelector<HTMLElement>(this.selectors.slotTimescaleTemplate).firstElementChild;
      if (timescaleSlotTemplate) {
        slots.forEach((timeslot) => {
          const slotElement = document.importNode(timescaleSlotTemplate, true);
          const { innerHTML } = slotElement;
          const startDateStr = DateHelper.getTrimTimeStr(timeslot.startDate);
          if (innerHTML) {
            slotElement.innerHTML = innerHTML.replace('{timeString}', startDateStr);
          }
          timescale.appendChild(slotElement);
        });
      }

      if (!this.otherSlotsContainer.classList.contains('detailed')) {
        this.otherSlotsContainer.classList.add('detailed');
      }
    } else {
      this.log('Hiding detailed view.');
      this.otherSlotsContainer.classList.remove('detailed');
    }
  }

  private onSlotSelect(ev: Event): void {
    const target = ev.currentTarget;
    if (target && target instanceof HTMLElement) {
      // unselect others
      document.querySelectorAll<HTMLElement>(this.selectors.slotSelect).forEach((el) => {
        el.classList.remove('selected');
      });

      const timeSlotId = (target as HTMLElement).getAttribute('data-timeslot-id');
      this.selectedSlot = this.allSlots.find(slot => slot.id === timeSlotId);
      this.fillInSlotDetails(
        document.querySelectorAll<HTMLElement>(this.selectors.selectionDetails),
        SELECTION_DETAILS_GROUP_STR,
        this.selectedSlot,
      );

      target.classList.add('selected');
    }
  }

  private fillInSlotDetails(slotDetailElements: NodeListOf<HTMLElement>,
    groupSelectorPrefix: string, slot?: Timeslot): void {
    this.log('Fill in called: ', slotDetailElements, slot);
    slotDetailElements.forEach((el) => {
      const suffix = el
        .getAttribute('data-biometrie_appointment').replace(groupSelectorPrefix, '');

      if (slot) {
        if (suffix === SLOT_DETAILS.wrapper) {
          el.classList.add('show');
        } else if (suffix === SLOT_DETAILS.date) {
          el.innerText = `${slot.getDateStr()} ${slot.getTimeStr()}`;
        } else if (suffix === SLOT_DETAILS.capacity) {
          const capacityMsg = this.capacityMsgClone.textContent;
          el.innerText = capacityMsg.replace('{schalter}', slot.capacity.toString());
        }
      } else if (suffix === SLOT_DETAILS.wrapper) {
        el.classList.remove('show');
      } else if (suffix === SLOT_DETAILS.date) {
        el.innerText = '';
      } else if (suffix === SLOT_DETAILS.capacity) {
        el.innerText = '';
      }
    });
  }

  /**
   * Method to handle exceptions that the current view can not recover from.
   * @param exception
   */
  private handleFatal(exception): void {
    this.log('Unexpected exception connecting to API', exception);
    this.data.apiAvailable = true;
  }

  private resetView(doClearNextOpenSlot?: boolean): void {
    this.slotFullOverlay.classList.remove('show');
    this.otherSlotsContainer.nextElementSibling.classList.remove('dropshadow-top');
    this.fillInSlotDetails(
      document.querySelectorAll<HTMLElement>(this.selectors.selectionDetails),
      SELECTION_DETAILS_GROUP_STR,
    );
    document.querySelectorAll<HTMLElement>(this.selectors.weekDaySlotsContainer)
      .forEach((slotCon) => {
        slotCon.innerHTML = '';
      });

    if (doClearNextOpenSlot) {
      this.fillInSlotDetails(
        document.querySelectorAll<HTMLElement>(this.selectors.nextOpenSlotDetails),
        NEXT_DETAILS_GROUP_STR,
      );
    }
  }
}
export default BiometrieRescheduleView;
