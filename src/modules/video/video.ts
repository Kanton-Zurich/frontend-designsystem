/*!
 * Video
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Video extends Module {
  private youtubeVideoIdSpokenlanguage: string;
  private youtubeVideoIdSignlanguage: string;
  private cookieName: string;
  private daysToExpire: number;
  private setYoutubeIFrameSrc: Function;
  private getAltText: Function;
  private showSignlanguageVideo: Boolean;
  private youtubeConsentGiven: Boolean;

  public ui: {
    element: HTMLDivElement;
    preview: HTMLDivElement;
    previewSpokenLanguage: HTMLDivElement;
    previewSignLanguage: HTMLDivElement;
    captionSpokenLanguage: HTMLDivElement;
    captionSignLanguage: HTMLDivElement;
    previewBtn: HTMLButtonElement;
    dialog: HTMLDivElement;
    dialogCloseBtn: HTMLButtonElement;
    dialogPlayBtn: HTMLButtonElement;
    iFrame: HTMLIFrameElement;
    toggle: HTMLElement;
  };

  public options: {
    domSelectors: {
      preview: string;
      previewSpokenLanguage: string;
      previewSignLanguage: string;
      captionSpokenLanguage: string;
      captionSignLanguage: string;
      previewBtn: string;
      dialogCloseBtn: string;
      dialogPlayBtn: string;
      iFrame: string;
      toggle: string;
    };
    stateClasses: {};
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        preview: '.mdl-video__preview',
        previewSpokenLanguage: '.mdl-video__preview--spoken-language',
        previewSignLanguage: '.mdl-video__preview--sign-language',
        captionSpokenLanguage: '.mdl-video__caption--spoken-language',
        captionSignLanguage: '.mdl-video__caption--sign-language',
        previewBtn: '.mdl-video__preview button',
        dialog: '.mdl-video__cookie-dialog',
        dialogCloseBtn: '.mdl-video__cookie-dialog > button',
        dialogPlayBtn: '.mdl-video__cookie-dialog .atm-button',
        iFrame: '.mdl-video__frame',
        toggle: '.mdl-video .atm-toggle',
      },
      stateClasses: {},
    };

    super($element, defaultData, defaultOptions, data, options);
    this.youtubeVideoIdSpokenlanguage = this.ui.iFrame.dataset.youtubevideoidspokenlanguage;
    this.youtubeVideoIdSignlanguage = this.ui.iFrame.dataset.youtubevideoidsignlanguage;
    this.daysToExpire = parseInt(this.ui.iFrame.dataset.expirydays, 10);
    this.cookieName = this.ui.iFrame.dataset.cookiename;
    this.youtubeConsentGiven = false;
    this.showSignlanguageVideo = false;
    this.setYoutubeIFrameSrc = () => {
      const videoId = this.showSignlanguageVideo
        ? this.youtubeVideoIdSignlanguage
        : this.youtubeVideoIdSpokenlanguage;
      const src = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showInfo=0`;

      this.ui.iFrame.setAttribute('src', src);
    };
    this.getAltText = (videoId: string) => `mdl-video__${videoId}__alt-text`;

    if (this.cookieName) {
      const match = document.cookie.match(new RegExp(`(^| )${this.cookieName}=([^;]+)`));
      if (match && match[2] === 'true') {
        this.log(`${this.cookieName} cookie is accepted.`);
        this.hideElement(this.ui.preview);
        this.hideElement(this.ui.dialog);
        this.youtubeConsentGiven = true;
        this.setYoutubeIFrameSrc();
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
        this.ui.dialogCloseBtn.focus();
        this.updateFlyingFocus();
      })
      .on('click', this.options.domSelectors.dialogCloseBtn, () => {
        this.hideElement(this.ui.dialog);
        this.showElement(this.ui.preview);
        this.ui.previewBtn.focus();
        this.updateFlyingFocus();
      })
      .on('click', this.options.domSelectors.dialogPlayBtn, () => {
        this.hideElement(this.ui.dialog);
        if (this.cookieName) {
          document.cookie = `${this.cookieName}=true; max-age=${this.getExpireDate()}; path=/`;
          this.youtubeConsentGiven = true;
        }
        this.setYoutubeIFrameSrc();
        this.showElement(this.ui.iFrame);
        this.ui.iFrame.contentWindow.focus();
        this.updateFlyingFocus();
      });

    if (this.ui.toggle) {
      this.ui.toggle.addEventListener('change', (event) => {
        const signLanguageChecked = (event.target as HTMLInputElement).checked;

        if (signLanguageChecked) {
          this.showSignlanguageVideo = true;
          this.ui.iFrame.setAttribute(
            'aria-labelledby',
            this.getAltText(this.youtubeVideoIdSignlanguage)
          );
          this.ui.previewBtn.setAttribute(
            'aria-labelledby',
            this.getAltText(this.youtubeVideoIdSignlanguage)
          );
          this.showElement(this.ui.previewSignLanguage);
          this.showElement(this.ui.captionSignLanguage);
          this.hideElement(this.ui.previewSpokenLanguage);
          this.hideElement(this.ui.captionSpokenLanguage);
        } else {
          this.ui.iFrame.setAttribute(
            'aria-labelledby',
            this.getAltText(this.youtubeVideoIdSpokenlanguage)
          );
          this.ui.previewBtn.setAttribute(
            'aria-labelledby',
            this.getAltText(this.youtubeVideoIdSpokenlanguage)
          );
          this.showElement(this.ui.previewSpokenLanguage);
          this.showElement(this.ui.captionSpokenLanguage);
          this.hideElement(this.ui.previewSignLanguage);
          this.hideElement(this.ui.captionSignLanguage);
          this.showSignlanguageVideo = false;
        }

        if (this.youtubeConsentGiven) {
          this.setYoutubeIFrameSrc();
        }
      });
    }
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
    element.classList.remove('hidden');
  }

  /**
   * Calculate the expire date for the cookie
   *
   * @return {string}
   */
  private getExpireDate(): string {
    const date = new Date();
    const hoursADay = 24;
    const minsPerHour = 60;
    const secsPerMin = 60;
    const milliSecs = 1000;
    date.setTime(
      date.getTime() + this.daysToExpire * hoursADay * minsPerHour * secsPerMin * milliSecs
    );

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
