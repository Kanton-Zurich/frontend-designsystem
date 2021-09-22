/*!
 * Searchhighlight
 *
 * @author
 * @copyright
 */
import Module from '../../assets/js/helpers/module';

class Searchhighlight extends Module {
  private paramsObject: object;
  private searchRegex: RegExp;
  private basicRequirementsRegex: RegExp;
  private params: string;
  private parameterName: string;
  private decodedParams: string;
  private pipeSeperatedQueryParams: string;
  private highLightStart: string;
  private highLightEnd: string;
  private matchedElements: Array<Node>;

  constructor($element: any, data: Object, options: Object) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {},
      stateClasses: {},
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();

    this.paramsObject = this.getAllURLParams();
    this.parameterName = 'search';
    this.params = this.paramsObject[this.parameterName];
    this.decodedParams = decodeURIComponent(this.paramsObject[this.parameterName]).trim();
    // this.params = decodeURIComponent(this.paramsObject[this.parameterName]);
    this.highLightStart = '<span class="mdl-searchhighlight">';
    this.highLightEnd = '</span>';
    this.matchedElements = [];
    this.basicRequirementsRegex = new RegExp('[a-zA-ZäöüÄÖÜß|0-9]{2,}', 'g');


    if (this.params && this.decodedParams.match(this.basicRequirementsRegex)) {
      this.prepareRegexPattern();
      this.getMatchingElementsFrom(document.getElementById('main'));
      this.insertHighlights();
    }
  }

  /**
   * Construct the regex pattern for the search query parameters.
   *
   * @param query
   * @private
   */
  private prepareRegexPattern() {
    this.pipeSeperatedQueryParams = `(${this.decodedParams.match(this.basicRequirementsRegex).join(')|(')})`;
    if (this.pipeSeperatedQueryParams.indexOf('|') !== -1) {
      // Combine piped-string with full/original querystring
      this.pipeSeperatedQueryParams = `(${this.decodedParams})|${this.pipeSeperatedQueryParams}`;
    }

    this.searchRegex = new RegExp(this.pipeSeperatedQueryParams, 'gi');
  }

  /**
   * Configure and run the NodeIterator
   *
   * @param rootElement
   * @private
   */
  private getMatchingElementsFrom(rootElement:HTMLElement) {
    // Configure NodeIterator to only consider text-nodes that matches the query string
    // and exclude elements that have the screenreader class
    const nodeIterator = document.createNodeIterator(
      rootElement,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (node.nodeValue.match(this.searchRegex)
            && !node.parentElement.classList.contains('visuallyhidden')) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return -1;
        },
      },
    );
    // Run the iterator
    let node = nodeIterator.nextNode();
    while (node) {
      this.matchedElements.push(node);
      node = nodeIterator.nextNode();
    }
  }

  /**
   * Insert the highlight into the innerHtml of a match
   *
   * @private
   */
  private insertHighlights() {
    const matches = this.matchedElements.length;

    for (let i = 0; i < matches; i += 1) {
      // Insert replace placeholder
      const currentNode = this.matchedElements[i];
      currentNode.nodeValue = currentNode.nodeValue.replace(this.searchRegex, subString => `<%>${subString}</%>`);

      // Insert highlight-spans
      const currentElement = currentNode.parentElement;
      if (currentElement) { // Prevent new null-parent
        const tmpContent = currentElement.innerHTML
          .replace(/&lt;%&gt;/g, this.highLightStart)
          .replace(/&lt;\/%&gt;/g, this.highLightEnd);
        currentElement.innerHTML = tmpContent;
      }
    }
  }

  static get events() {
    return {
      // eventname: `eventname.${ Searchhighlight.name }.${  }`
    };
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default Searchhighlight;
