import A11y from './helpers/a11y';
import Inspector from './helpers/inspector';
import Grid from './helpers/grid';

const inspector = new Inspector();
const a11y = new A11y();
const grid = new Grid();

// Keyboard triggered helpers
document.onkeydown = (e: any) => {
  const event = e || window.event;
  const keyA = 65;
  const keyM = 77;
  const keyG = 71;

  if (event.keyCode === keyM && event.ctrlKey) {
    // ctrl+m
    inspector.run();
  } else if (e.keyCode === keyA && event.ctrlKey) {
    // ctrl+a
    a11y.run();
  } else if (e.keyCode === keyG && event.ctrlKey) {
    // ctrl+g
    grid.run();
  }
};

// global object for dev helpers
(window as any).czhdev = {
  addLinkToChat(url = '/pages/office/office.html') {
    // add a link to an internal page to webchat, to allow testing of backToChat
    // chatbot has to be open before use.
    // turns the last previous message into a link
    const lastBubbleP = [...document.querySelectorAll('.webchat__text-content p')].at(-1);
    if (!lastBubbleP) {
      console.error('No last bubble found - chatbot has to be open before use.');
      return;
    }
    lastBubbleP.innerHTML = `<a href="${url}">Testlink zu ${url}</a>`;
  },
};
