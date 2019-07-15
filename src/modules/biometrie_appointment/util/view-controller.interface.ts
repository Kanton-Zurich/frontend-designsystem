import { Delegate } from 'dom-delegate';

export default interface ViewController {
  selectors: any;
  logFn: Function;
  initEventListeners(eventDelegate: Delegate): void;
  appendLogFunction(logFn: Function): void;
}
