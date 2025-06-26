/*!
 * ContactBlock
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';
import Modal from '../modal/modal';
import {
  stripWhitespace,
  removeProtocol,
  isExternalURL,
  isSafeURL,
} from '../../assets/js/helpers/common';

class ContactBlock extends Module {
  constructor($element: any, data: Object, options: Object) {
    const defaultData = {};
    const defaultOptions = {
      domSelectors: {
        hGroupElement: '.mdl-contact_block__name-group',
        titleElement: '[data-text="title"]',
        firstnameElement: '[data-text="firstname"]',
        lastnameElement: '[data-text="lastname"]',
        jobTitleElement: '[data-text="jobtitle"]',
        detailWrappers: '.mdl-contact_block__detail-wrapper',
        sectionCells: '.mdl-contact_block__section-cell',
      },
      stateClasses: {},
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  setData(contactEntryList) {
    const contactBlock = this.ui.element;
    const sectionCells = contactBlock.querySelectorAll(this.options.domSelectors.sectionCells);
    const titleElement = contactBlock.querySelector(this.options.domSelectors.titleElement);
    const MAX_LEADERS = 2;
    const firstItem = contactEntryList[0] || {};
    const hasLeader = contactEntryList.length > 0 && contactEntryList.length <= MAX_LEADERS;
    const leaderHasContactInfo =
      firstItem.phone ||
      firstItem.email ||
      firstItem.website ||
      firstItem.firstName ||
      firstItem.lastName ||
      firstItem.jobTitle;

    contactBlock.classList.add('hidden');
    sectionCells.forEach((sectionCell) => {
      sectionCell.classList.add('hidden');
    });

    if (hasLeader && leaderHasContactInfo) {
      contactBlock.classList.remove('hidden');

      if (titleElement) {
        if (titleElement && firstItem.type === 'authority' && firstItem.title) {
          titleElement.textContent = firstItem.title;
        } else if (firstItem.role) {
          titleElement.textContent = titleElement.dataset[firstItem.role.toLowerCase()];
        }
      }

      contactEntryList.forEach((contactEntry, contactEntryListIndex) => {
        const { domSelectors } = this.options;
        const sectionCell = sectionCells[contactEntryListIndex];
        const hGroupElement = sectionCell.querySelector(domSelectors.hGroupElement);
        const firstnameElement = sectionCell.querySelector(domSelectors.firstnameElement);
        const lastnameElement = sectionCell.querySelector(domSelectors.lastnameElement);
        const jobTitleElement = sectionCell.querySelector(domSelectors.jobTitleElement);
        const detailWrappers = sectionCell.querySelectorAll(domSelectors.detailWrappers);

        sectionCell.classList.remove('hidden');

        if (contactEntry.jobTitle && contactEntry.firstName && contactEntry.lastName) {
          hGroupElement.classList.remove('hidden');
          firstnameElement.textContent = contactEntry.firstName;
          lastnameElement.textContent = contactEntry.lastName;
          jobTitleElement.textContent = contactEntry.jobTitle;
        } else {
          hGroupElement.classList.add('hidden');
        }

        ['phone', 'email', 'website'].forEach((type, sectionCellIndex) => {
          const contactDataElement = detailWrappers[sectionCellIndex];
          const contactDataLink = contactDataElement.querySelector('a');

          if (contactEntry[type]) {
            const hrefData = stripWhitespace(contactEntry[type]);
            let linkText = contactEntry[type];
            let href = '';

            contactDataElement.classList.remove('hidden');

            switch (type) {
              case 'phone':
                href = `tel:${stripWhitespace(hrefData)}`;
                break;
              case 'email':
                href = `mailto:${hrefData}`;
                break;
              case 'website':
                href = isSafeURL(hrefData) ? hrefData : '#';
                linkText = removeProtocol(linkText);
                if (isExternalURL(href)) {
                  contactDataLink.setAttribute('target', '_blank');
                } else {
                  contactDataLink.removeAttribute('target');
                }
                break;
              default:
                href = hrefData;
            }

            contactDataLink.setAttribute('href', href);
            contactDataLink.textContent = linkText;
          } else {
            contactDataElement.classList.add('hidden');
          }
        });
      });
    }
  }
  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on(Modal.events.setData, (event) => {
      this.setData(event.detail);
    });
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();
  }
}

export default ContactBlock;
