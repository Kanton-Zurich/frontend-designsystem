// SearchHighlight.ts
//
// Highlights terms from the "search" query param inside #main by wrapping matched
// ranges in <mark class="searchhighlight">…</mark> without touching innerHTML.

type SearchHighlightOptions = {
  root?: HTMLElement | null;
  paramName?: string; // default: "search"
  highlightClass?: string; // default: "searchhighlight"
  minTokenLength?: number; // default: 2
  skipTags?: ReadonlySet<string>; // tagName set, compared uppercase
  skipHiddenSelector?: string; // default: ".visuallyhidden"
};

const MIN_TOKEN_LENGTH = 2;

export default class SearchHighlight {
  private readonly root: HTMLElement;
  private readonly paramName: string;
  private readonly highlightClass: string;
  private readonly minTokenLength: number;
  private readonly skipTags: ReadonlySet<string>;
  private readonly skipHiddenSelector: string;

  constructor(options: SearchHighlightOptions = {}) {
    this.root = options.root ?? document.getElementById('main');
    this.paramName = options.paramName ?? 'search';
    this.highlightClass = options.highlightClass ?? 'searchhighlight';
    this.minTokenLength = options.minTokenLength ?? MIN_TOKEN_LENGTH;
    this.skipTags = options.skipTags ?? new Set(['SCRIPT', 'LABEL', 'NOSCRIPT']);
    this.skipHiddenSelector = options.skipHiddenSelector ?? '.visuallyhidden';

    if (!this.root) return;

    const query = this.getQueryParam(this.paramName);
    const tokens = this.tokenize(query, this.minTokenLength);
    if (tokens.length === 0) return;

    const regex = this.buildRegex(tokens);
    this.highlightAllMatches(regex);
  }

  private getQueryParam(name: string): string {
    const raw = new URL(window.location.href).searchParams.get(name) ?? '';
    // URLSearchParams already decodes; keep this resilient to malformed encodings.
    try {
      return raw.trim();
    } catch {
      return '';
    }
  }

  private tokenize(input: string, minLen: number): string[] {
    const dedupe = (arr: string[]) => {
      const seen = new Set<string>();
      const out: string[] = [];
      for (const m of arr) {
        const k = m.toLocaleLowerCase();
        if (!seen.has(k)) {
          seen.add(k);
          out.push(m);
        }
      }
      return out;
    };

    try {
      // Unicode-aware tokenization: any letters/numbers in any language.
      const rx = new RegExp(`[\\p{L}\\p{N}]{${minLen},}`, 'gu');
      return dedupe(input.match(rx) ?? []);
    } catch {
      // Fallback for browsers without Unicode property escapes
      const rx = new RegExp(`[A-Za-z0-9]{${minLen},}`, 'g');
      return dedupe(input.match(rx) ?? []);
    }
  }

  private buildRegex(tokens: string[]): RegExp {
    // Escape tokens so user input can't change the regex.
    const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    // Longer tokens first to prefer longer matches when alternatives overlap.
    escaped.sort((a, b) => b.length - a.length);
    return new RegExp(`(${escaped.join('|')})`, 'giu');
  }

  private shouldSkipTextNode(node: Node): boolean {
    let el: Element | null = node.parentElement;
    if (!el) return true;

    // Reject if nested in a skipped tag or hidden container (ancestor-aware).
    while (el) {
      if (this.skipTags.has(el.tagName)) return true;
      if (el.matches?.(this.skipHiddenSelector)) return true;
      if (el === this.root) break;
      el = el.parentElement;
    }
    return false;
  }

  private highlightAllMatches(regex: RegExp): void {
    const textNodes = this.collectMatchingTextNodes(regex);

    // Important: we replace text nodes; don't reuse stale references later.
    for (const textNode of textNodes) {
      this.wrapMatchesInTextNode(textNode, regex);
    }
  }

  private collectMatchingTextNodes(regex: RegExp): Text[] {
    const out: Text[] = [];

    const it = document.createNodeIterator(this.root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (this.shouldSkipTextNode(node)) return NodeFilter.FILTER_REJECT;

        const text = node.nodeValue ?? '';
        if (!text) return NodeFilter.FILTER_REJECT;

        // Reset because /g or /y regex carries state.
        regex.lastIndex = 0;
        return regex.test(text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });

    let n: Node | null;
    while ((n = it.nextNode())) out.push(n as Text);

    return out;
  }

  private wrapMatchesInTextNode(textNode: Text, regex: RegExp): void {
    const text = textNode.nodeValue ?? '';
    if (!text) return;

    const parent = textNode.parentNode;
    if (!parent) return;

    regex.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let last = 0;
    let m: RegExpExecArray | null;

    while ((m = regex.exec(text)) !== null) {
      const start = m.index;
      const matchText = m[0];
      const end = start + matchText.length;

      if (start > last) frag.append(text.slice(last, start));

      const mark = document.createElement('mark');
      mark.className = this.highlightClass;
      mark.textContent = matchText; // safe: no innerHTML
      frag.append(mark);

      last = end;

      // Prevent infinite loops on zero-length matches (defensive).
      if (matchText.length === 0) regex.lastIndex++;
    }

    if (last < text.length) frag.append(text.slice(last));

    parent.replaceChild(frag, textNode);
  }
}
