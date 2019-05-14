import Helper from './helper';

class AssetLoader extends Helper {
  public logger: Function;
  public dataHref: string;
  public dataAttr: string;
  public assetType: string;

  constructor(dataAttr, type = 'style') {
    super();
    this.logger = this.log(AssetLoader.name);
    this.dataAttr = dataAttr;
    this.assetType = type;

    // once cached, the css file is stored on the client forever unless
    // the URL below is changed. Any change will invalidate the cache
    document.addEventListener('DOMContentLoaded', () => {
      this.dataHref = document.body.getAttribute(this.dataAttr);
      if (this.dataHref !== null) {
        this.logger(`don't block the loading of the page; wait until it's done; then download asset ${this.dataHref}`);
        this.on(window, 'load', this.injectAsset.bind(this));
      }
    });
  }

  public injectAsset() {
    if (this.assetType === 'style') {
      this.createStylesheet();
    }
    if (this.assetType === 'script') {
      this.createScript();
    }
  }

  public createStylesheet() {
    const stylesheet = document.createElement('link');

    stylesheet.href = this.dataHref;
    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';

    document.getElementsByTagName('head')[0].appendChild(stylesheet);
  }

  public createScript() {
    const script = document.createElement('script');

    script.src = this.dataHref;
    script.type = 'text/javascript';

    document.getElementsByTagName('head')[0].appendChild(script);
  }
}

export default AssetLoader;
