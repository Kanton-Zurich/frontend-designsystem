/* eslint-disable */
import { Delegate } from 'dom-delegate';

export interface WithEventListeners {
  initEventListeners(eventDelegate: Delegate): void;
}

export abstract class ViewController<T, U> implements WithEventListeners {
  private logFn: Function;

  data: U;
  selectors: T;

  constructor(_selectors: T, _data: U, _logFn: Function) {
    this.selectors = _selectors;
    this.data = _data;
    this.logFn = _logFn;
  }

  abstract initEventListeners(eventDelegate: Delegate): void;

  log(msg: string, ...args: any[]): void {
    if (this.logFn) {
      this.logFn(msg, args);
    }
  }
}
