import Helper from './helper';

class AssetLoader extends Helper {
  public logger: Function;
  public dataHref: string;
  public dataAttr: string;
  public assetType: string;
  public callback: any;
  public cache: boolean;
  public dataHash: string;
  public timeout = 864000000; // eslint-disable-line

  constructor(dataAttr, type = 'style', cache = false, callback = null) {
    super();
    this.logger = this.log(AssetLoader.name);
    this.dataAttr = dataAttr;
    this.assetType = type;
    this.cache = cache;
    this.dataHash = dataAttr;
    this.callback = callback;

    // once cached, the css file is stored on the client forever unless
    // the URL below is changed. Any change will invalidate the cache
    document.addEventListener('DOMContentLoaded', () => {
      this.dataHref = document.body.getAttribute(this.dataAttr);
      if (this.dataHref) {
        const matches = this.dataHref.match(/\.[^\s/]+(\.min\.|\.)/g);
        if (matches && matches[0]) {
          const splitMatches = matches[0].split('.');
          if (splitMatches && splitMatches[1]) {
            this.dataHash += '_' + splitMatches[1]; // eslint-disable-line
          }
        }
        if (!this.cache) {
          this.logger(`don't block the loading of the page; wait until it's done; then download asset ${this.dataHref}`);
          this.on(window, 'load', this.loadAsset.bind(this));
        } else {
          this.loadAsset();
        }
      }
    });
  }

  public loadAsset() {
    if (!this.cache || !this.supportsLocalStorage()) {
      this.logger(`Fetching ${this.dataHref}`);
      this.injectAsset();
    } else if (localStorage[`asset__${this.dataHash}`]
      && (Date.now() - localStorage[`asset-timestamp__${this.dataHash}`] < this.timeout)) {
      this.logger(`Loading ${this.dataHref} from cache`);
      this.injectRaw(localStorage[`asset__${this.dataHash}`]);
    } else {
      this.logger(`Storing ${this.dataHref}`);
      this.fetchAndStore();
    }
    if (this.callback) {
      this.callback();
      this.logger(`Callback from asset ${this.dataAttr}`);
    }
  }

  public injectAsset() {
    let assets: any;
    if (this.assetType === 'style') {
      assets = document.createElement('link');
      assets.href = this.dataHref;
      assets.rel = 'stylesheet';
      assets.type = 'text/css';
    }
    if (this.assetType === 'script') {
      assets = document.createElement('script');
      assets.src = this.dataHref;
      assets.type = 'text/javascript';
    }
    document.getElementsByTagName('head')[0].appendChild(assets);
  }

  public injectRaw(text) {
    let assets: any;
    if (this.assetType === 'style') {
      assets = document.createElement('style');
      assets.setAttribute('type', 'text/css');
    }
    if (this.assetType === 'script') {
      assets = document.createElement('script');
      assets.setAttribute('type', 'text/javascript');
    }

    assets.innerHTML = text;
    document.getElementsByTagName('head')[0].appendChild(assets);
  }

  public fetchAndStore() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.dataHref, true);
    // cater for IE8 which does not support addEventListener or attachEvent on XMLHttpRequest
    xhr.onreadystatechange = () => {
      const ajaxDone = 4;
      const statusOk = 200;

      if (xhr.readyState === ajaxDone && xhr.status === statusOk) {
        // once we have the content, quickly inject the css rules
        this.injectRaw(xhr.responseText);

        localStorage[`asset__${this.dataHash}`] = xhr.responseText;
        localStorage[`asset-timestamp__${this.dataHash}`] = Date.now();
      }
    };
    xhr.send();
  }
}

export default AssetLoader;
