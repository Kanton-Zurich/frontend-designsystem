import App from './helpers/app';

let app;

const loadApp = () => {
  app = new App();
  app.start();
};

if (document.querySelector('[load-main-script-deferred]')) {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      loadApp();
    }, 0);
  });
} else {
  loadApp();
}
