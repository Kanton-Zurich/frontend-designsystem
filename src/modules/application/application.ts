/*!
 * Application
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import WindowEventListener from '../../assets/js/helpers/events';
import HeaderExpand from '../header_expand/header_expand';

// const waitTimeout = 5000;

class Application extends Module {
  public options: {
    domSelectors: any;
    stateClasses: any;
    transitionDelay: number;
  };

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {},
      stateClasses: {
        // activated: 'is-activated'
      },
      transitionDelay: 300,
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
    this.loadSnippet();
  }

  static get events() {
    return {
      initScripts: 'Application.initScripts',
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('Application.initScripts', this.initScripts.bind(this));

    (<any>WindowEventListener).addDebouncedResizeListener(() => {
      this.verticalSizeUpdate();
    });

    this.eventDelegate.on(HeaderExpand.events.expandTriggered, () => {
      this.verticalSizeUpdate();
      window.dispatchEvent(new CustomEvent('resize'));
    });
    this.eventDelegate.on(HeaderExpand.events.collapseTriggered, () => {
      this.verticalSizeUpdate();
      window.dispatchEvent(new CustomEvent('resize'));
    });

    setTimeout(() => {
      this.verticalSizeUpdate();
      window.dispatchEvent(new CustomEvent('resize'));
    }, this.options.transitionDelay);
  }

  /**
   * Re initialize script tags if loaded asynchronously
   */
  initScripts() {
    if (!this.scriptsInitialized) {
      this.runScripts(this.ui.element);
    }
  }

  async loadSnippet() {
    try {
      const url = new URL(this.ui.element.getAttribute('data-snippet-url'), location.href);
      // await new Promise((resolve) => setTimeout(resolve, waitTimeout));
      if (url.origin !== location.origin)
        throw new Error('Applikation kommt nicht vom selben Server');
      const response = await fetch(url);
      if (!response.ok)
        throw new Error('Applikation konnte nicht geladen werden, Fehler: ' + response.statusText);
      const html = await response.text();
      this.ui.element.innerHTML = html ?? '';
      this.ui.element.querySelectorAll('script').forEach((script: HTMLScriptElement) => {
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(script.textContent ?? ''));
        script.replaceWith(newScript);
      });
    } catch (error) {
      const loadingSpinner = this.ui.element.querySelector('.atm-loading_circle');
      const errorNotification = this.ui.element.querySelector('.mdl-notification');
      const errorMsgBox = this.ui.element.querySelector('.mdl-notification__message');
      if (loadingSpinner) loadingSpinner.classList.toggle('hidden', true);
      if (errorNotification && errorMsgBox) {
        errorMsgBox.textContent = String(error);
        errorNotification.classList.toggle('hidden', false);
      }
    }
  }

  verticalSizeUpdate() {
    let pageHeader = document.querySelector('.mdl-page-header');
    let node = this.ui.element.parentNode;
    while (node !== null) {
      if (node.classList && node.classList.contains('mdl-modal')) {
        pageHeader = node.querySelector('.mdl-page-header');
        break;
      }
      node = node.parentNode;
    }
    const element = this.ui.element.closest('.mdl-application__wrapper--fullWidth');
    let headerSize = 0;
    if (pageHeader) {
      headerSize = pageHeader.getBoundingClientRect().bottom;
    }
    if (element) {
      element.style.height = `${window.innerHeight - headerSize}px`;
    }
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
  }
}

class ZHApplication extends HTMLElement {
  async connectedCallback() {
    try {
      const url = new URL(this.getAttribute('src'), location.href);
      if (url.origin !== location.origin)
        throw new Error('Applikation kommt nicht vom selben Server');
      const response = await fetch(url);
      if (!response.ok)
        throw new Error('Applikation konnte nicht geladen werden, Fehler: ' + response.statusText);
      this.attachShadow({ mode: 'open' });
      if (!this.shadowRoot) throw new Error('Shadow Root konnte nicht erstellt werden');

      const html = await response.text();

      // innerHTML replaces all shadow root children, so set snippet content first.
      this.shadowRoot.innerHTML = html ?? '';

      // Sheets parsed from <link>/<style> tags are non-constructed and cannot be adopted. Clone them as DOM nodes
      // instead so that the host page's styles are available inside the shadow root.
      const snippetFirstChild = this.shadowRoot.firstChild;
      document.head.querySelectorAll<Element>('link[rel="stylesheet"], style').forEach((el) => {
        this.shadowRoot!.insertBefore(el.cloneNode(true), snippetFirstChild);
      });

      // Patch document query methods so scripts can find elements inside the shadow root.
      // work correctly. The main document is checked first; the shadow root is the fallback.
      const shadowRoot = this.shadowRoot;
      const prevQS = document.querySelector.bind(document);
      const prevQSA = document.querySelectorAll.bind(document);
      const prevGEBI = document.getElementById.bind(document);
      (document as any).querySelector = (sel: string) =>
        prevQS(sel) ?? shadowRoot.querySelector(sel);
      (document as any).querySelectorAll = (sel: string) => {
        const r = prevQSA(sel);
        return r.length ? r : shadowRoot.querySelectorAll(sel);
      };
      // ShadowRoot has no getElementById; use querySelector with an ID selector as fallback.
      (document as any).getElementById = (id: string) =>
        prevGEBI(id) ?? shadowRoot.querySelector(`#${id}`);

      // Copy script tags to the shadow root to execute them. Scripts added via innerHTML are inert and won't execute,
      // so we need to create new script elements and copy over the attributes and content.
      const SCRIPT_ATTRS = [
        'type',
        'src',
        'async',
        'defer',
        'nomodule',
        'crossorigin',
        'integrity',
        'referrerpolicy',
        'fetchpriority',
      ];
      shadowRoot.querySelectorAll('script').forEach((script) => {
        const newScript = document.createElement('script');
        for (const attr of SCRIPT_ATTRS) {
          if (script.hasAttribute(attr)) newScript.setAttribute(attr, script.getAttribute(attr)!);
        }
        // Only set text content for inline scripts (no src attribute)
        if (!script.hasAttribute('src'))
          newScript.appendChild(document.createTextNode(script.textContent ?? ''));
        shadowRoot.appendChild(newScript);
        script.remove();
      });
    } catch (error) {
      const loadingSpinner = this.querySelector('.atm-loading_circle');
      const errorNotification = this.querySelector('.mdl-notification');
      const errorMsgBox = this.querySelector('.mdl-notification__message');
      if (loadingSpinner) loadingSpinner.classList.toggle('hidden', true);
      if (errorNotification && errorMsgBox) {
        errorMsgBox.textContent = String(error);
        errorNotification.classList.toggle('hidden', false);
      }
    }
  }
}

if (!customElements.get('zh-application')) {
  customElements.define('zh-application', ZHApplication);
}

export default Application;
