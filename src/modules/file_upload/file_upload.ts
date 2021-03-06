/*!
 * FileUpload
 *
 * @author
 * @copyright
 */
import { template } from 'lodash';

import Module from '../../assets/js/helpers/module';
import { sanitizeFileSize } from '../../assets/js/helpers/common';

class FileUpload extends Module {
  public options: {
    domSelectors: any,
    stateClasses: any,
    isMultiple: boolean,
    isDuplicated: boolean,
    fileuploadSelector: string,
  };

  public ui: {
    element: HTMLDivElement,
    input: HTMLInputElement,
    itemTemplate: HTMLScriptElement,
    list: HTMLDivElement | HTMLUListElement,
    dropzone: HTMLDivElement,
    form: HTMLFormElement,
    onlyOneFile: HTMLParagraphElement,
  };

  public data: {
    hasDropzone: boolean,
    files: FileList,
    counter: number,
    htmlAttributes: any,
  };

  private changePending: boolean;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      hasDropzone: true,
      counter: 0,
    };
    const defaultOptions = {
      isMultiple: false,
      isDuplicated: false,
      domSelectors: {
        input: '[data-file_upload="input"]',
        itemTemplate: '[data-file_upload="item-template"]',
        list: '[data-file_upload="list"]',
        dropzone: '[data-file_upload="dropzone"]',
        delete: '[data-file_upload="delete"]',
        onlyOneFile: '[data-message="onlyonefile"]',
      },
      stateClasses: {
        activeDropzone: 'mdl-file_upload--active-dropzone',
        dropzoneDragOver: 'mdl-file_upload__dropzone--dragover',
        noDropzone: 'mdl-file_upload--no-dropzone',
        duplicated: 'mdl-file_upload--duplicated',

      },
      fileuploadSelector: '[data-init="fileUpload"]',
    };

    super($element, defaultData, defaultOptions, data, options);

    this.changePending = false;
    this.initUi();

    this.options.isMultiple = this.ui.input.hasAttribute('data-multiple');

    // Test if i can set the files attribute, this allows drag'n'drop behaviour
    try {
      this.ui.input.files = this.ui.input.files;
      this.ui.element.classList.add(this.options.stateClasses.activeDropzone);
    } catch (e) {
      this.data.hasDropzone = false;
    }

    this.ui.form = this.ui.element.closest('form');

    if (this.options.isDuplicated) {
      this.onChange();
      this.initDuplicatedUpload();
    } else {
      this.data.htmlAttributes = {
        id: this.ui.input.getAttribute('id'),
        name: this.ui.input.getAttribute('name'),
      };
    }

    this.initEventListeners();
  }

  static get events() {
    return {
      duplicated: 'duplicated.FileUpload',
      mainMoved: 'mainMoved.FileUpload',
    };
  }

  initDuplicatedUpload() {
    this.ui.element.classList.add(this.options.stateClasses.duplicated);

    this.ui.input.setAttribute('id', `${this.data.htmlAttributes.id}_${this.data.counter}`);
    this.ui.input.setAttribute('name', `${this.data.htmlAttributes.name}_${this.data.counter}`);

    const allForElements = this.ui.element.querySelectorAll('[for]');

    allForElements.forEach((elementWithFor) => {
      elementWithFor.setAttribute('for', `${this.data.htmlAttributes.id}_${this.data.counter}`);
    });
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('change', this.options.domSelectors.input, this.onChange.bind(this));

    this.eventDelegate.on(FileUpload.events.mainMoved, (event) => {
      if (event.detail) this.ui.input.setAttribute('required', 'true');

      if (this.options.isDuplicated && this.ui.input.files.length === 0) {
        this.ui.element.remove();
      }
    });

    if (this.data.hasDropzone) {
      const dragEvents = ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'];

      dragEvents.forEach((eventName) => {
        this.eventDelegate.on(eventName, this.options.domSelectors.dropzone, (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });

      this.eventDelegate.on('dragover', this.options.domSelectors.dropzone, this.addDropzoneClass.bind(this));
      this.eventDelegate.on('dragenter', this.options.domSelectors.dropzone, this.addDropzoneClass.bind(this));

      this.eventDelegate.on('dragleave', this.options.domSelectors.dropzone, this.removeDropzoneClass.bind(this));
      this.eventDelegate.on('dragend', this.options.domSelectors.dropzone, this.removeDropzoneClass.bind(this));

      this.eventDelegate.on('drop', this.options.domSelectors.dropzone, (e) => {
        this.removeDropzoneClass();

        if (e.dataTransfer.files.length === 1) {
          this.ui.input.files = e.dataTransfer.files;
          this.onChange();
        } else {
          this.ui.onlyOneFile.classList.add('show');
        }
      });
    }
  }

  onChange() {
    if (!this.changePending) {
      this.changePending = true;
      this.initFileList();
      this.ui.onlyOneFile.classList.remove('show');
      if (this.ui.input.files.length > 0) {
        this.ui.element.classList.add(this.options.stateClasses.noDropzone);

        if (this.options.isMultiple) {
          this.duplicateItself();
        }
      } else {
        this.ui.element.classList.remove(this.options.stateClasses.noDropzone);
      }
      this.updateFlyingFocus(0);
      // prevent double triggering on safari
      setTimeout(() => {
        this.changePending = false;
      }, 1);
    }
  }

  addDropzoneClass() {
    this.ui.dropzone.classList.add(this.options.stateClasses.dropzoneDragOver);
  }

  removeDropzoneClass() {
    this.ui.dropzone.classList.remove(this.options.stateClasses.dropzoneDragOver);
  }

  initFileList() {
    const compiled = template(this.ui.itemTemplate.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    const fileListLength = this.ui.input.files.length;

    this.ui.list.innerHTML = '';

    for (let i = 0; i < fileListLength; i += 1) {
      const fileItem = this.sanitizeFile(this.ui.input.files.item(i), i);
      let html = compiled(fileItem);

      if (this.options.isMultiple) {
        html = `<li>${html}</li>`;
      }

      const parsedHTML = new DOMParser().parseFromString(html, 'text/html').querySelector('div');

      this.ui.list.appendChild(parsedHTML);

      parsedHTML.querySelector(this.options.domSelectors.delete).addEventListener('click', this.deleteFile.bind(this));
    }
  }

  sanitizeFile(file, index) {
    const lastIndexOfPoint = file.name.lastIndexOf('.');
    const fileTitle = file.name.substr(0, lastIndexOfPoint);
    const fileType = file.name.substr(lastIndexOfPoint + 1).toUpperCase();
    const fileSize = sanitizeFileSize(file.size);

    return {
      fileTitle,
      fileType,
      fileSize,
      fileID: index,
    };
  }

  deleteFile() {
    const parent = this.ui.element.parentElement;
    const isRequired = this.ui.input.hasAttribute('required');
    const isFirst = this.ui.element.previousElementSibling === null;
    let fileUploads = parent.querySelectorAll(this.options.fileuploadSelector);

    if (!this.options.isDuplicated) {
      this.ui.input.value = '';

      this.ui.input.type = '';
      this.ui.input.type = 'file';

      this.onChange();

      if (fileUploads.length > 1) {
        parent.appendChild(this.ui.element);
        fileUploads = parent.querySelectorAll(this.options.fileuploadSelector);

        if (this.options.isDuplicated) {
          this.ui.input.removeAttribute('required');
        }
      }

      this.ui.input.dispatchEvent(new CustomEvent('validateDeferred', {
        detail: {
          field: this.ui.input,
        },
      }));
    } else {
      this.ui.element.remove();
    }

    if (isFirst) {
      fileUploads.forEach((uploadElement, counter) => {
        uploadElement.dispatchEvent(new CustomEvent(FileUpload.events.mainMoved, {
          detail: counter === 0 && isRequired,
        }));
      });
    }

    // Change focus
    parent.querySelector('input').focus();
  }

  duplicateItself() {
    const clone = this.ui.element.cloneNode(true);
    const cloneInput = (<HTMLElement>clone).querySelector('input');

    cloneInput.value = '';
    cloneInput.type = '';
    cloneInput.type = 'file';
    cloneInput.removeAttribute('required');

    this.ui.element.parentElement.appendChild(clone);

    new FileUpload(clone, {
      counter: this.data.counter + 1,
      htmlAttributes: this.data.htmlAttributes,
    }, {
      isDuplicated: true,
    });

    if (this.ui.form) {
      this.ui.form.dispatchEvent(new CustomEvent(FileUpload.events.duplicated, {
        detail: clone,
      }));
    }
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default FileUpload;
