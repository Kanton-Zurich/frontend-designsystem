/*!
 * Video
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Video extends Module {
  private youTubeSrc: string;
  private cookieName: string;
  private daysToExpire: number;

  public ui: {
    element: HTMLDivElement,
    preview: HTMLDivElement,
    previewBtn: HTMLButtonElement,
    dialog: HTMLDivElement,
    dialogCloseBtn: HTMLButtonElement,
    dialogPlayBtn: HTMLButtonElement,
    iFrame: HTMLIFrameElement
  };

  public options: {
    domSelectors: {
      preview: string,
      previewBtn: string,
      dialogCloseBtn: string,
      dialogPlayBtn: string,
      iFrame: string,
    }
    stateClasses: {

    }
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        preview: '.mdl-video__preview',
        previewBtn: '.mdl-video__preview button',
        dialog: '.mdl-video__cookie-dialog',
        dialogCloseBtn: '.mdl-video__cookie-dialog > button',
        dialogPlayBtn: '.mdl-video__cookie-dialog .atm-button',
        iFrame: '.mdl-video__frame',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);
    this.youTubeSrc = this.ui.iFrame.dataset.youtubesrc;
    this.daysToExpire = parseInt(this.ui.iFrame.dataset.expirydays, 10);
    this.cookieName = this.ui.iFrame.dataset.cookiename;

    if (this.cookieName) {
      const match = document.cookie.match(new RegExp(`(^| )${this.cookieName}=([^;]+)`));
      if (match && match[2] === 'true') {
        this.log(`${this.cookieName} cookie is accepted.`);
        this.hideElement(this.ui.preview);
        this.hideElement(this.ui.dialog);
        this.ui.iFrame.setAttribute('src', this.youTubeSrc);
        this.showElement(this.ui.iFrame);
      } else {
        this.log(`${this.cookieName} cookie value not found or its not accepted.`);
      }
    }

    this.initUi();
    this.initEventListeners();
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate
      .on('click', this.options.domSelectors.preview, () => {
        this.hideElement(this.ui.preview);
        this.showElement(this.ui.dialog);
        this.ui.dialog.focus();
      }).on('click', this.options.domSelectors.dialogCloseBtn, () => {
        this.hideElement(this.ui.dialog);
        this.showElement(this.ui.preview);
        this.ui.preview.focus();
      }).on('click', this.options.domSelectors.dialogPlayBtn, () => {
        this.hideElement(this.ui.dialog);
        if (this.cookieName) {
          document.cookie = `${this.cookieName}=true; max-age=${this.getExpireDate()}; path=/`;
        }
        this.ui.iFrame.setAttribute('src', `${this.youTubeSrc}&autoplay=1&mute=0`);
        this.showElement(this.ui.iFrame);
      });
  }

  /**
   * Hide the given element by setting the disaply style to none and
   * updates the relevant attributes for accessibility
   *
   * @param {HTMLDivElement} element
   */
  private hideElement(element: HTMLDivElement) {
    element.style.display = 'none';
  }

  /**
   * Shows the given element by setting the disaply style to flex and
   * updates the relevant attributes for accessibility
   *
   * @param {HTMLDivElement} element
   */
  private showElement(element: HTMLDivElement) {
    element.style.display = 'flex';
  }

  /**
   * Calculate the expire date for the cookie
   *
   * @return {string}
   */
  private getExpireDate():string {
    const date = new Date();
    const hoursADay = 24;
    const minsPerHour = 60;
    const secsPerMin = 60;
    const milliSecs = 1000;
    date.setTime(date.getTime()
      + this.daysToExpire * hoursADay * minsPerHour * secsPerMin * milliSecs);

    return date.toUTCString();
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Video;
