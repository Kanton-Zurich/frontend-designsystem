/*!
 * FileUpload
 *
 * @author
 * @copyright
 */
import { template } from 'lodash';

import Module from '../../assets/js/helpers/module';

class FileUpload extends Module {
  public options: {
    domSelectors: any,
    stateClasses: any,
    isMultiple: boolean,
  }

  public ui: {
    element: HTMLDivElement,
    input: HTMLInputElement,
    itemTemplate: HTMLScriptElement,
    list: HTMLDivElement | HTMLUListElement,
    dropzone: HTMLDivElement,
  }

  public data: {
    hasDropzone: boolean,
    files: FileList,
  }

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
      hasDropzone: true,
    };
    const defaultOptions = {
      isMultiple: false,
      domSelectors: {
        input: '[data-file_upload="input"]',
        itemTemplate: '[data-file_upload="item-template"]',
        list: '[data-file_upload="list"]',
        dropzone: '[data-file_upload="dropzone"]',
        delete: '[data-file_upload="delete"]',
      },
      stateClasses: {
        activeDropzone: 'mdl-file_upload--active-dropzone',
        dropzoneDragOver: 'mdl-file_upload__dropzone--dragover',
        noDropzone: 'mdl-file_upload--no-dropzone',
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();

    this.options.isMultiple = this.ui.input.hasAttribute('multiple');

    // Test if i can set the files attribute, this allows drag'n'drop behaviour
    try {
      this.ui.input.files = this.ui.input.files;
      this.ui.element.classList.add(this.options.stateClasses.activeDropzone);
    } catch (e) {
      this.data.hasDropzone = false;
    }

    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: `eventname.${ FileUpload.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    this.eventDelegate.on('change', this.options.domSelectors.input, this.onChange.bind(this));

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
        this.ui.input.files = e.dataTransfer.files;

        this.onChange();
      });
    }
  }

  onChange() {
    this.initFileList();

    if (this.ui.input.files.length > 0) {
      this.ui.element.classList.add(this.options.stateClasses.noDropzone);
    } else {
      this.ui.element.classList.remove(this.options.stateClasses.noDropzone);
    }
  }

  addDropzoneClass() {
    this.ui.dropzone.classList.add(this.options.stateClasses.dropzoneDragOver);
  }

  removeDropzoneClass() {
    this.ui.dropzone.classList.remove(this.options.stateClasses.dropzoneDragOver);
  }

  initFileList() {
    const compiled = template(this.ui.itemTemplate.innerHTML);
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
    const fileSize = this.sanitizeFileSize(file.size);

    return {
      fileTitle,
      fileType,
      fileSize,
      fileID: index,
    };
  }

  sanitizeFileSize(fileSize) {
    if (fileSize === 0) return '0 Bytes';

    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(fileSize) / Math.log(k));

    return `${parseFloat((fileSize / (k ** i)).toFixed(dm))} ${sizes[i]}`;
  }

  deleteFile() {
    this.ui.input.value = '';

    this.ui.input.type = '';
    this.ui.input.type = 'file';

    this.onChange();
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
