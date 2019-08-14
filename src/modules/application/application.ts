/*!
 * Application
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Application extends Module {
  private runScriptTypes;
  private scriptsInitialized:boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        fullWidth: 'mdl-application--fullWidth',
        pageHeader: 'mdl-page-header',
      },
      stateClasses: {
        // activated: 'is-activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.runScriptTypes = [
      'application/javascript',
      'application/ecmascript',
      'application/x-ecmascript',
      'application/x-javascript',
      'text/ecmascript',
      'text/javascript',
      'text/javascript1.0',
      'text/javascript1.1',
      'text/javascript1.2',
      'text/javascript1.3',
      'text/javascript1.4',
      'text/javascript1.5',
      'text/jscript',
      'text/livescript',
      'text/x-ecmascript',
      'text/x-javascript',
    ];
    this.scriptsInitialized = false;

    this.initUi();
    this.initEventListeners();
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
  }

  /**
   * Re initialize script tags if loaded asynchronously
   */
  initScripts() {
    if (!this.scriptsInitialized) {
      this.runScripts(this.ui.element);
    }
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }

  scriptsDone() {
    const DOMContentLoadedEvent = document.createEvent('Event');
    DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(DOMContentLoadedEvent);
  }

  seq(arr, callback, idx = 0) {
    let index = idx;
    arr[index](() => {
      index += 1;
      if (index === arr.length) {
        callback();
      } else {
        this.seq(arr, callback, index);
      }
    });
  }

  insertScript($script, callback) {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    if ($script.src) {
      s.onload = callback;
      s.onerror = callback;
      s.src = $script.src;
    } else {
      s.textContent = $script.innerText;
    }

    // re-insert the script tag so it executes.
    document.head.appendChild(s);

    // clean-up
    $script.parentNode.removeChild($script);

    // run the callback immediately for inline scripts
    if (!$script.src) {
      callback();
    }
  }

  runScripts($container) {
    this.scriptsInitialized = true;
    // get scripts tags from a node
    const $scripts = $container.querySelectorAll('script');
    const runList = [];
    let typeAttr;

    [].forEach.call($scripts, ($script) => {
      typeAttr = $script.getAttribute('type');

      // only run script tags without the type attribute
      // or with a javascript mime attribute value
      if (!typeAttr || this.runScriptTypes.indexOf(typeAttr) !== -1) {
        runList.push((callback) => {
          this.insertScript($script, callback);
        });
      }
    });

    // insert the script tags sequentially
    // to preserve execution order
    this.seq(runList, this.scriptsDone);
  }
}

export default Application;
