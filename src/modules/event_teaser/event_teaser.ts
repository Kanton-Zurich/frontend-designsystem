/*!
 * EventTeaser
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import template from 'lodash/template';

/**
 * API Response types
 */
export type EventAddress = {
  street: string | null;
  zipCode: string | null;
  city: string | null;
};

export type EventRecurrencePattern = {
  bookableDaysBeforeEvent?: number | null;
  dayOfMonth: number;
  dayOfWeekList?: number[] | null;
  instance: number;
  interval: number;
  monthOfYear: number;
  patternStartDate?: string | null;
  patternEndDate?: string | null;
  startTime: string;
  endTime: string;
  recurrenceType: number;
  monthlyRecurrenceOption?: number | null;
  yearlyRecurrenceOption?: number | null;
  repetitionOption?: number | null;
  instanceOption?: number | null;
  month?: number | null;
  recurrencePatternOption?: number | null;
};

export type EventItem = {
  id: string;
  eventSeriesId?: string | null;
  typeId: number;
  typeName: string;
  name: string;
  organizer: string;
  numberOfRegistrations: number;
  recurrencePatternModel: EventRecurrencePattern | null;
  language?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  format?: number;
  formatName?: string;
  organizerId: string;
  eventCode: string;
  status: number;
  directLinkAccessSelected: boolean;
  statusName?: string | null;
  address: EventAddress;
  accessLink?: string | null;
  googleMapsUrl?: string | null;
  cost?: number | null;
  seesionsMinCost?: number | null;
  seesionsMaxCost?: number | null;
  organizerColor: string | null;
  eventLink: string;
  registrationsRequired: boolean;
  location?: string | null;
  fullyBooked: boolean;
  waitingListFullyBooked: boolean;
  numberOfParticipants: number;
  numberOfParticipantsOnWaitingList: number;
  room?: string | null;
  infiniteNumberOfParticipants: boolean;
  infiniteNumberOfWaitingListParticipants: boolean;
  numberOfSpots?: number | null;
  waitingListSpots?: number | null;
  bookingStartDate?: string | null;
  bookingEndDate?: string | null;
  zhChWebsiteSelected: boolean;
  createdUserId?: string;
  publication: number;
  speakers?: any[] | null;
};

export type EventPagedResponse = {
  totalItemCount: number;
  items: EventItem[];
  link: string;
};

/**
 * Event card format for template
 */
export type EventCardData = {
  title: string;
  month: string;
  day: string;
  teaserText: string[];
  label: string;
  link: string;
  typeLabel: string;
};

const EVENT_FORMAT_ONLINE = 0;
// const EVENT_FORMAT_ONSITE = 1;
const EVENT_FORMAT_HYBRID = 2;
// const EVENT_FORMAT_UNKNOWN = 3;

const EVENT_DAY_DIGITS = 2;

class EventTeaser extends Module {
  public ui: {
    element: HTMLDivElement;
    list: HTMLOListElement;
    link: HTMLAnchorElement;
    placeholder: HTMLDivElement;
    notification: HTMLDivElement;
    template: HTMLScriptElement;
  };

  public options: {
    domSelectors: any;
    stateClasses: any;
  };

  public apiUrl: string;
  public organizerId: string;
  public attributeOptionIds: string[];
  public pageSize: number;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        list: '.mdl-event_teaser__list',
        link: '.mdl-event_teaser > .atm-text_link',
        placeholder: '[data-event-teaser-placeholder]',
        notification: '[data-event-teaser-notification]',
        template: '[data-event-teaser-template]',
      },
      stateClasses: {
        loading: 'mdl-event_teaser--loading',
        error: 'mdl-event_teaser--error',
        apiUrlAttr: 'data-api-url',
        organizerIdAttr: 'data-organizer-id',
        attributeOptionIdsAttr: 'data-attribute-option-ids',
        pageSizeAttr: 'data-page-size',
        headingCardLevelAttr: 'data-heading-card-level',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();

    // Read configuration from data attributes
    this.apiUrl = this.ui.element.getAttribute(this.options.stateClasses.apiUrlAttr);
    this.organizerId =
      this.ui.element.getAttribute(this.options.stateClasses.organizerIdAttr) || '';
    const attributeOptionIdsAttr =
      this.ui.element.getAttribute(this.options.stateClasses.attributeOptionIdsAttr) || '';
    this.attributeOptionIds = attributeOptionIdsAttr
      ? attributeOptionIdsAttr
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id)
      : [];
    const pageSizeAttr = this.ui.element.getAttribute(this.options.stateClasses.pageSizeAttr);
    this.pageSize = pageSizeAttr ? parseInt(pageSizeAttr, 10) : 10;

    this.initEventListeners();
  }

  static get events() {
    return {};
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Fetch events on initialization if organizerId is present
    if (this.organizerId) {
      this.fetchEvents();
    } else {
      this.log('No organizerId found, skipping event fetch');
    }
  }

  /**
   * Fetch events from API
   */
  async fetchEvents() {
    if (!this.organizerId) {
      this.log('Cannot fetch events without data-organizer-id attribute');
      return;
    }

    if (!this.apiUrl) {
      this.log('Cannot fetch events without data-api-url attribute');
      return;
    }

    // Add loading state
    this.ui.element.classList.add(this.options.stateClasses.loading);
    this.ui.element.classList.remove(this.options.stateClasses.error);

    const payload = {
      pageNumber: 1,
      pageSize: this.pageSize,
      organizerId: this.organizerId,
      attributeOptionIds: this.attributeOptionIds,
      sort: 'date',
      sortDirection: 0,
    };

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Post failed with status ${response.status}`);
      }

      const data: EventPagedResponse = await response.json();

      if (data) this.renderEvents(data);
    } catch (error) {
      this.log('Error fetching events:', error);
      this.ui.element.classList.add(this.options.stateClasses.error);
      if (this.ui.notification) this.ui.notification.hidden = false;
      if (this.ui.link) this.ui.link.hidden = true;
    } finally {
      this.ui.element.classList.remove(this.options.stateClasses.loading);
    }
  }

  /**
   * Transform API event item to event card format
   * @param event EventItem from API
   * @returns EventCardData for template
   */
  transformEventToCard(event: EventItem): EventCardData {
    const i18nLabels = JSON.parse(this.ui.element.getAttribute('data-i18n-labels') || '{}');

    // Parse date
    const eventDate = new Date(event.date);
    const day = eventDate.getDate().toString().padStart(EVENT_DAY_DIGITS, '0');
    const month = this.getShortMonthName(eventDate.getMonth());

    // Build teaser text array
    const teaserText: string[] = [];

    // Date and time line
    const dateStr = this.formatDate(eventDate);
    const timeStr = `${event.startTime} bis ${event.endTime}`;
    teaserText.push(`${dateStr}, ${timeStr}`);

    // Location line
    if (event.format === EVENT_FORMAT_ONLINE) {
      // Online event
      teaserText.push(i18nLabels.remote);
    } else {
      // On site or hybrid event
      teaserText.push(
        `${this.formatAddress(event.address)}${
          event.format === EVENT_FORMAT_HYBRID ? ` und ${i18nLabels.remote}` : ''
        }`
      );
    }

    // Cost line
    teaserText.push(event.cost ? `CHF ${event.cost}` : i18nLabels.free);

    // Determine label based on status or registrations
    let label = '';
    if (event.statusName && event.statusName !== 'Aktiv') {
      label = event.statusName; // 'Abgesagt'
    } else if (event.fullyBooked) {
      label = event.waitingListFullyBooked
        ? i18nLabels.fullyBooked // 'Ausgebucht'
        : i18nLabels.waitingList; // 'Warteliste vorhanden'
    }

    return {
      title: event.name,
      month,
      day,
      teaserText,
      label,
      link: event.eventLink,
      typeLabel: 'Event',
    };
  }

  /**
   * Get short month name in German
   * @param monthIndex 0-based month index
   * @returns Short month name (Jan, Feb, etc.)
   */
  getShortMonthName(monthIndex: number): string {
    const monthNames = [
      'Jan',
      'Feb',
      'Mär',
      'Apr',
      'Mai',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Okt',
      'Nov',
      'Dez',
    ];
    return monthNames[monthIndex] || '';
  }

  /**
   * Format date to DD.MM.YYYY
   * @param date Date object
   * @returns Formatted date string
   */
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0'); //eslint-disable-line
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); //eslint-disable-line
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  /**
   * Format address for display
   * @param address EventAddress
   * @returns Formatted address string or empty string
   */
  formatAddress(address: EventAddress): string {
    const parts: string[] = [];

    if (address.street) parts.push(address.street);
    if (address.zipCode && address.city) {
      parts.push(`${address.zipCode} ${address.city}`);
    } else if (address.city) {
      parts.push(address.city);
    }

    return parts.join(', ');
  }

  /**
   * Render events to the list
   * @param {EventPagedResponse} events - Data from API response
   */
  renderEvents(events: EventPagedResponse) {
    if (!this.ui.template) {
      this.log('No template element found');
      return;
    }

    if (!this.ui.list) {
      this.log('No list element found');
      return;
    }

    const hasEvents = events.items.length > 0;
    this.ui.list.hidden = !hasEvents;
    if (this.ui.notification) this.ui.notification.hidden = true;
    if (this.ui.placeholder) this.ui.placeholder.hidden = hasEvents;
    if (this.ui.link) {
      this.ui.link.hidden = false;
      this.ui.link.href = events.link;
    }

    if (!hasEvents) return;

    // Transform events to card format
    const eventCards: EventCardData[] = events.items.map((event) =>
      this.transformEventToCard(event)
    );

    // Compile template
    const scriptTemplate = this.ui.template.innerHTML;
    let eventsCompiled = '';

    eventCards.forEach((card) => {
      const compiled = template(scriptTemplate.replace(/this\./gm, 'self.'));
      eventsCompiled += compiled(card);
    });

    // Update DOM
    this.ui.list.innerHTML = eventsCompiled;
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default EventTeaser;
