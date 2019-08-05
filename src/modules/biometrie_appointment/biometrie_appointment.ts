/*!
 * BiometrieAppointment
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import MigekApiService from './service/migek-api.service';
import CalendarLinkGenerator from './service/calendar-link-generator.service';
import BiometrieRescheduleView, {
  rescheduleViewSelectorsValues,
} from './partials/reschedule_view/reschedule_view';
import BiometrieLoginView, { loginViewSelectors } from './partials/login_view/login_view';
import BiometrieDetailsView, { detailViewSelectors } from './partials/details_view/details_view';

// TODO: Marked as unused by eslint although required (?)
/* eslint-disable no-unused-vars */
import Appointment from './model/appointment.model';
import { BiometrieViewController } from './util/view-controller.class';
/* eslint-enable */

class BiometrieAppointment extends Module {
  public data: {
    apiBase: string;
    appointment: Appointment;
    loading: boolean;
    attemptsBeforeTelephone: number;
  };

  public options: {
    domSelectors: {
      loadingSpinner: string;
      viewCon: string;
      logoutLink: string;
    }
    stateClasses: any
  };

  private loginViewCntrl: BiometrieLoginView;
  private detailsViewCntrl: BiometrieDetailsView;
  private rescheduleViewCntrl: BiometrieRescheduleView;
  private viewController: BiometrieViewController[];

  private apiService: MigekApiService;

  private calendarLinkGenerator: CalendarLinkGenerator;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      apiBase: 'https://internet-acc.zh.ch/proxy/migek/',
      appointment: undefined,
      attemptsBeforeTelephone: 3,
      loading: true,
      loggedIn: false,
    };

    const defaultOptions = {
      domSelectors: Object.assign({
        loadingSpinner: '[data-biometrie_appointment=loading-spinner]',
        viewCon: '[data-biometrie_appointment^=view__]',
        logoutLink: '[data-biometrie_appointment=logout]',
      },
      loginViewSelectors, detailViewSelectors, rescheduleViewSelectorsValues),
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.log('Module "Biometrie Appointment" init!', this);
    this.initUi();

    this.initServices();
    this.initViewController();

    this.initEventListeners();
    this.initWatchers();

    this.enterLoginView();
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

    this.loginViewCntrl = new BiometrieLoginView(this.data, loginViewSelectors);
    this.viewController.push(this.loginViewCntrl);

    this.detailsViewCntrl = new BiometrieDetailsView(this.data, detailViewSelectors,
      this.calendarLinkGenerator)
      .onRescheduleClicked((rescheduleIntention) => {
        if (rescheduleIntention) {
          this.enterRescheduleView();
        }
      });
    this.viewController.push(this.detailsViewCntrl);

    this.rescheduleViewCntrl = new BiometrieRescheduleView(this.data,
      rescheduleViewSelectorsValues);
    this.viewController.push(this.rescheduleViewCntrl);

    this.viewController.forEach((cntrl) => {
      cntrl.withLogFn(this.log).withApi(this.apiService);
    });
  }

  static get events() {
    return {
      // eventname: `eventname.${ BiometrieAppointment.name }.${  }`
    };
  }

  /**
   *Initializing the watchers
   *
   */
  initWatchers() {
    this.watch(this.data, 'loading', this.toggleLoadingSpinner.bind(this));
    this.watch(this.data, 'loggedIn', this.toggleLogoutLink.bind(this));
    this.watch(this.data, 'appointment', this.enterDetailsView.bind(this));
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Init Controller Event listeners
    this.viewController.forEach(cntrl => cntrl.initEventListeners(this.eventDelegate));

    this.eventDelegate.on('click', this.options.domSelectors.logoutLink, () => {
      this.doLogout();
    });
  }

  private toggleLoadingSpinner(): void {
    const loadingConClassList = document
      .querySelector<HTMLInputElement>(this.options.domSelectors.loadingSpinner).classList;
    if (loadingConClassList.contains('show')) {
      loadingConClassList.remove('show');
    } else {
      loadingConClassList.add('show');
    }
  }

  private toggleLogoutLink(varName, valOld, valNew): void {
    this.log('Watcher fired for: ', varName, valOld, valNew);
    const logoutLink = document
      .querySelector<HTMLInputElement>(this.options.domSelectors.logoutLink).classList;
    if (valNew) {
      logoutLink.add('show');
    } else {
      logoutLink.remove('show');
    }
  }

  private doLogout(): void {
    this.apiService.logoutReset();
  }

  private enterLoginView():void {
    this.enterView('login');
  }

  private enterDetailsView(): void {
    this.log('Received Appointment: ', this.data.appointment);
    this.detailsViewCntrl.prepareView();
    this.enterView('details');
  }

  private enterRescheduleView(): void {
    this.log('Entering Reschedule View.');
    this.rescheduleViewCntrl.prepareView();
    this.enterView('reschedule');
  }

  private enterView(viewName: string):void {
    const viewCon = document.querySelectorAll<HTMLInputElement>(this.options.domSelectors.viewCon);

    viewCon.forEach((el) => {
      const elViewName = el.getAttribute('data-biometrie_appointment').replace('view__', '');
      if (viewName === elViewName) {
        el.classList.add('show');
      } else {
        el.classList.remove('show');
      }
    });
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
