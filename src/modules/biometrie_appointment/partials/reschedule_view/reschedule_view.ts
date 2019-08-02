/* eslint-disable */
import { ViewController } from '../../util/view-controller.class';
import Timeslot from '../../model/timeslot.model';

// TODO: Marked as unused by eslint although required (?)
/* eslint-disable no-unused-vars */
import Appointment from '../../model/appointment.model';
import DateHelper from '../../../../util/date-helper.class';
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
  weekIndicator: '[data-biometrie_appointment=selectedWeek]',
  weekRange: '[data-biometrie_appointment=selectedWeekRange]',
  weekDayColumns: '[data-biometrie_appointment=weekDayColumn]',
  weekDayHeads: '[data-biometrie_appointment=weekDayHead]',
  weekDaySlotsContainer: '[data-biometrie_appointment=weekDaySlots]',
  slotSelectTemplate: '[data-biometrie_appointment=slotSelectTemplate]',
  slotEmptyTemplate: '[data-biometrie_appointment=slotEmptyTemplate]',
  slotSelect: '[data-biometrie_appointment=timeSlotSelect]',
  selectionDetails: `[data-biometrie_appointment^=${SELECTION_DETAILS_GROUP_STR}]`,
  cancelBtn: '[data-biometrie_appointment=cancelBtn]',
  doRescheduleBtn: '[data-biometrie_appointment=doScheduleSelected]',
};

export interface RescheduleViewSelectors {
  rescheduleBackLink: string,
  nextOpenSlotDetails: string,
  rescheduleToNextBtn: string,
  otherSlotsContainer: string,
  capacityMsgTemplate: string,
  weekIndicator: string,
  weekRange: string,
  weekDayColumns: string,
  weekDayHeads: string,
  weekDaySlotsContainer: string,
  slotSelectTemplate: string,
  slotEmptyTemplate: string,
  slotSelect: string,
  selectionDetails: string,
  cancelBtn: string,
  doRescheduleBtn: string,
}
interface RescheduleViewData {
  appointment: Appointment;
  loading: boolean;
  rescheduled: boolean;
}
const SLOTS_MAX_FOR_COMPRESSED = 10; // TODO: Configurable?
const SLOTS_MAX_WITHOUT_SCROLL = 11; // TODO: Configurable?
class BiometrieRescheduleView extends ViewController<RescheduleViewSelectors, RescheduleViewData> {
  private allSlots: Timeslot[];
  private nextOpenSlot: Timeslot;
  private selectedSlot: Timeslot;

  private compressedView = true;

  private capacityMsgClone = document
    .querySelector<HTMLTemplateElement>(this.selectors.capacityMsgTemplate).content.cloneNode(true);
  private otherSlotsContainer = document
    .querySelector<HTMLElement>(this.selectors.otherSlotsContainer);

  constructor(_data: any, _selectors: RescheduleViewSelectors) {
    super(_selectors, _data);
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
        this.data.loading = true;
        this.apiService.getReservationDetails()
        // Refresh details, to prevent inconsistency between views
          .then((refreshedAppointment) => {
            this.data.appointment = refreshedAppointment;
          })
          .finally(() => {
            this.data.loading = false;
          });
        this.resetView();
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
    }).finally(() => {
      this.data.loading = false;
    });
  }

  private prepareOtherSlotsSelectView(): void {
    const { 0: earliest } = this.allSlots;
    const earliestDate = earliest.startDate;
    const weekNo = DateHelper.getWeekNumber(earliestDate);
    const weekIndicator = document
      .querySelector<HTMLElement>(this.selectors.weekIndicator);
    weekIndicator.innerText = `KW ${weekNo.toString()}`;

    const weeksDates = DateHelper.getDatesOfWeek(earliestDate);
    weeksDates.shift(); // Dropping sunday
    weeksDates.pop(); // and saturday since they are not used.
    const [weeksMonday,,,, weeksFriday ] = weeksDates;
    const weekRangeEl = document
      .querySelector<HTMLElement>(this.selectors.weekRange);
    weekRangeEl.innerText = `${DateHelper.getDeDateStr(weeksMonday)}-${DateHelper.getDeDateStr(weeksFriday)}`;

    const openSlotsPerWeekDay: Timeslot[][] = [];
    let maxSlotsPerDay = 0;
    weeksDates.forEach((date, i) => {
      const filteredForDay = this.allSlots.filter((slot) => {
        const { startDate } = slot;
        return startDate > date && startDate < weeksDates[i + 1];
      });
      maxSlotsPerDay = Math.max(maxSlotsPerDay, filteredForDay.length);
      openSlotsPerWeekDay.push(filteredForDay);
    });
    this.compressedView = maxSlotsPerDay < SLOTS_MAX_FOR_COMPRESSED;
    this.otherSlotsContainer = document
      .querySelector<HTMLElement>(this.selectors.otherSlotsContainer);
    if (maxSlotsPerDay > SLOTS_MAX_WITHOUT_SCROLL) {
      this.otherSlotsContainer.nextElementSibling.classList.add('dropshadow-top');
    } else {
      this.otherSlotsContainer.nextElementSibling.classList.remove('dropshadow-top');
    }

    const slotSelectTemplate = document
      .querySelector<HTMLTemplateElement>(this.selectors.slotSelectTemplate);
    const slotEmptyTemplate = document
      .querySelector<HTMLTemplateElement>(this.selectors.slotEmptyTemplate);
    const weekdayColumnsNodeList = this.otherSlotsContainer
      .querySelectorAll<HTMLDivElement>(this.selectors.weekDayColumns);
    weekdayColumnsNodeList.forEach((colEl, i) => {
      const colDate = weeksDates[i];
      const colHeadEl = colEl.querySelector<HTMLElement>(this.selectors.weekDayHeads);
      colHeadEl.innerHTML = colDate.toLocaleDateString('de', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
      }).replace(', ', '<br>');

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
            const { content } = slotSelectTemplate;
            if (content) {
              const clone = document.importNode(content, true);
              const slotElement = clone.firstElementChild;
              const { innerHTML } = slotElement;
              if (innerHTML) {
                slotElement.innerHTML = innerHTML.replace('{timeslot-range}', timeslot.getTimeStr());
              }
              const slotSelect = slotElement.querySelector(this.selectors.slotSelect);
              if (slotSelect) {
                slotSelect.setAttribute('data-timeslot-id', timeslot.id);
                slotSelect.addEventListener('click', ev => this.onSlotSelect(ev));
              }

              slotsCon.appendChild(clone);
            }
          } else {
            const { content } = slotEmptyTemplate;
            if (content) {
              slotsCon.appendChild(document.importNode(content, true));
            }
          }
        });
      } else {
        colEl.classList.add('no-slots-available');
      }
    });
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
    groupSelectorPrefix: string, slot: Timeslot): void {
    this.log('Fill in called: ', slotDetailElements, slot);
    slotDetailElements.forEach((el) => {
      const suffix = el
        .getAttribute('data-biometrie_appointment').replace(groupSelectorPrefix, '');

      if (suffix === SLOT_DETAILS.wrapper) {
        el.classList.add('show');
      } else if (suffix === SLOT_DETAILS.date) {
        el.innerText = `${slot.getDateStr()} ${slot.getTimeStr()}`;
      } else if (suffix === SLOT_DETAILS.capacity) {
        const capacityMsg = this.capacityMsgClone.textContent;
        el.innerText = capacityMsg.replace('{schalter}', slot.capacity.toString());
      }
    });
  }

  private resetView(): void {
    this.otherSlotsContainer.nextElementSibling.classList.remove('dropshadow-top');
    Object.values(SLOT_DETAILS).forEach((val) => {
      const selector = `[data-biometrie_appointment*=-details__${val}]`;
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        if (val === SLOT_DETAILS.wrapper) {
          el.classList.remove('show');
        } else if (val === SLOT_DETAILS.date) {
          el.innerText = '';
        } else if (val === SLOT_DETAILS.capacity) {
          el.innerText = '';
        }
      });
    });
  }
}
export default BiometrieRescheduleView;
