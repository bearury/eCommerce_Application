interface ParamsElementCreator {
  tag: keyof HTMLElementTagNameMap;
  classNames?: Array<string>;
  textContent?: string;
  callback?: Array<{ event: Event; callback: Function }>;
  attribute?: Array<{ type: string; value: string }>;
  children?: Array<HTMLElement>;
}

type Event = 'click' | 'submit' | 'input' | 'change';

class ElementCreator {
  element: HTMLElement;

  constructor(params: ParamsElementCreator) {
    this.element = document.createElement(params.tag);
    this.createElement(params);
  }

  private createElement(params: ParamsElementCreator): HTMLElement {
    if (params.classNames && params.classNames.length) {
      this.setClasses(params.classNames);
    }
    if (params.textContent && params.textContent.length) {
      this.setTextContent(params.textContent);
    }

    if (params.callback && params.callback.length) {
      this.setCallback(params.callback);
    }
    if (params.attribute && params.attribute.length) {
      this.setAttribute(params.attribute);
    }

    if (params.children && params.children.length) {
      this.setChildren(params.children);
    }

    return this.getElement();
  }

  private getElement(): HTMLElement {
    return this.element;
  }

  private setAttribute(attr: Array<{ type: string; value: string }>): void {
    if (attr) {
      attr.forEach((a) => this.element.setAttribute(a.type, a.value));
    }
  }

  private setChildren(children: Array<HTMLElement>): void {
    if (children.length) {
      children.forEach((child: HTMLElement) => this.element.append(child));
    }
  }

  private setClasses(classes: Array<string> | undefined): void {
    classes?.forEach((className: string) => this.element.classList.add(className));
  }

  private setTextContent(text: string): void {
    this.element.textContent = text;
  }

  private setCallback(callbacks: Array<{ event: Event; callback: Function }>): void {
    if (callbacks.length && this.element) {
      callbacks.forEach((c) => this.element.addEventListener(c.event, (e) => c.callback(e)));
    }
  }
}

export { ElementCreator };
export type { ParamsElementCreator };
