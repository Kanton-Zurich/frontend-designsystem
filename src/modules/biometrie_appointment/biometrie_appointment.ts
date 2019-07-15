/*!
 * BiometrieAppointment
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import MigekApiService from './service/migek-api.service';
import Appointment from './model/appointment.model';
import CalendarLinkGenerator from './service/calendar-link-generator.service';
import ViewController from './util/view-controller.interface';
import BiometrieLoginView, { LoginViewSelectors } from './partials/login_view/login_view';
import BiometrieDetailsView, { DetailsViewSelectors } from './partials/details_view/details_view';
import BiometrieRescheduleView, { RescheduleViewSelectors } from './partials/reschedule_view/reschedule_view';

class BiometrieAppointment extends Module {
  public data: {
    apiBase: string,
  };

  public options: {
    domSelectors: any
    stateClasses: any
  };

  private loginViewSelectors: LoginViewSelectors;
  private detailsViewSelectors: DetailsViewSelectors;
  private rescheduleViewSelectors: RescheduleViewSelectors;

  private loginViewCntrl: BiometrieLoginView;
  private detailsViewCntrl: BiometrieDetailsView;
  private rescheduleViewCntrl: BiometrieRescheduleView;
  private viewController: ViewController[];

  private apiService: MigekApiService;

  private calendarLinkGenerator: CalendarLinkGenerator;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      apiBase: 'https://internet-acc.zh.ch/proxy/migek/',
    };
    const loginViewSelectors: LoginViewSelectors = {
      inputFieldsWrapper: '[data-biometrie_appointment=inputfieldswrapper]',
      inputFields: '[data-biometrie_appointment=input]',
      submitBtn: '[data-biometrie_appointment=submit]',
      loginAlertErr1: '[data-biometrie_appointment=loginAlertErr1]',
      loginAlertErr2: '[data-biometrie_appointment=loginAlertErr2]',
      loginAlertErr3: '[data-biometrie_appointment=loginAlertErr3]',
      loginHint: '[data-biometrie_appointment=loginHint]',
    };
    const detailViewSelectors: DetailsViewSelectors = {
      reservationDetails: '[data-biometrie_appointment^=reservation-details__]',
      rescheduleBtn: '[data-biometrie_appointment=reschedule]',
      calendarLinks: '[data-biometrie_appointment^=cal-link__]',
    };
    const rescheduleViewSelectors: RescheduleViewSelectors = {
      nextOpenSlotField: '[data-biometrie_appointment=nextOpenSlot]',
      otherSlotsContainer: '[data-biometrie_appointment=otherSlotsSelect]',
      rescheduleToNextBtn: '[data-biometrie_appointment=doRescheduleNext]',
    };
    const defaultOptions = {
      domSelectors: Object.assign({},
        loginViewSelectors, detailViewSelectors, rescheduleViewSelectors),
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.loginViewSelectors = loginViewSelectors;
    this.detailsViewSelectors = detailViewSelectors;
    this.rescheduleViewSelectors = rescheduleViewSelectors;

    this.initUi();

    this.log('Biometrie appointment init!', this);

    this.initServices();
    this.initViewController();

    this.initEventListeners();
  }

  private initServices(): void {
    this.apiService = new MigekApiService(this.data.apiBase, this.log);

    this.calendarLinkGenerator = new CalendarLinkGenerator({
      title: 'Kanton Zürich - Erfassung biometrischer Daten',
      location: 'Migrationsamt des Kantons Zürich',
      geo: {
        lat: 47.403555,
        lon: 8.546418,
      },
    });
  }

  private initViewController() {
    this.viewController = [];

    this.loginViewCntrl = new BiometrieLoginView(this.loginViewSelectors, this.apiService)
      .onAppointment((appointment) => {
        this.enterDetailsView(appointment);
      });
    this.viewController.push(this.loginViewCntrl);

    this.detailsViewCntrl = new BiometrieDetailsView(this.detailsViewSelectors,
      this.calendarLinkGenerator).onRescheduleClicked((rescheduleIntention) => {
      if (rescheduleIntention) {
        this.enterRescheduleView();
      }
    });
    this.viewController.push(this.detailsViewCntrl);

    this.rescheduleViewCntrl = new BiometrieRescheduleView(this.rescheduleViewSelectors,
      this.apiService);
    this.viewController.push(this.rescheduleViewCntrl);

    this.viewController.forEach(cntrl => (cntrl as ViewController).appendLogFunction(this.log));
  }


  static get events() {
    return {
      // eventname: `eventname.${ BiometrieAppointment.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Init Controller Event listeners
    this.viewController.forEach(cntrl => cntrl.initEventListeners(this.eventDelegate));
  }

  private enterDetailsView(appointment: Appointment): void {
    this.log('Received Appointment: ', appointment);
    this.detailsViewCntrl.prepareView(appointment);
  }

  private enterRescheduleView(): void {
    this.log('Entering Reschedule View.');
    this.rescheduleViewCntrl.prepareView();
    // this.apiService.getTimeSlots().then((timeslots) => {
    //   this.log('Timeslots', timeslots);
    //
    //   if (timeslots && timeslots.length > 0) {
    //     const nextSlot = new Timeslot(timeslots[0]);
    //     const nextOpenSpan = document
    //       .querySelector<HTMLElement>(this.options.domSelectors.nextOpenSlotField);
    //     nextOpenSpan.innerText = `${nextSlot.getDateStr()} ${nextSlot.getTimeStr()}`;
    //   }
    // });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default BiometrieAppointment;
