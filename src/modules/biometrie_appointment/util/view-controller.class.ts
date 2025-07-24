import Delegate from 'ftdomdelegate/main';
import MigekApiService from '../service/migek-api.service';

export interface BiometrieViewController {
  // eslint-disable-next-line no-unused-vars
  initEventListeners(eventDelegate: Delegate): void;
  // eslint-disable-next-line no-unused-vars
  withApi(apiService: MigekApiService): BiometrieViewController;
  // eslint-disable-next-line no-unused-vars
  withLogFn(_logFn: Function): BiometrieViewController;
}

export abstract class ViewController<T, U> implements BiometrieViewController {
  private logFn: Function;

  private api;

  data: U;
  selectors: T;

  constructor(_selectors: T, _data: U) {
    this.selectors = _selectors;
    this.data = _data;
  }

  // eslint-disable-next-line no-unused-vars
  abstract initEventListeners(eventDelegate: Delegate): void;

  withApi(apiService: MigekApiService): BiometrieViewController {
    this.api = apiService;
    return this;
  }

  get apiService(): MigekApiService {
    if (this.api) {
      return this.api;
    }
    throw new Error('ViewController has not been extended by ApiService!');
  }

  withLogFn(_logFn: Function): BiometrieViewController {
    this.logFn = _logFn;
    return this;
  }

  log(msg: string, ...args: any[]): void {
    if (this.logFn) {
      this.logFn(msg, args);
    }
  }
}
