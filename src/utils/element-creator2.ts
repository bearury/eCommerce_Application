import { ParamsElementCreator } from '@utils/element-creator';

type Event = 'click' | 'submit' | 'input' | 'change';

export default class ElementCreator2 {
  public static create(params: ParamsElementCreator): HTMLElement {
    const element: HTMLElement = document.createElement(params.tag);

    if (params.classNames?.length) ElementCreator2.setClasses(element, params.classNames);
    if (params.textContent) element.textContent = params.textContent;
    if (params.callback?.length) ElementCreator2.setCallback(element, params.callback);
    if (params.attribute?.length) ElementCreator2.setAttribute(element, params.attribute);
    if (params.children?.length) ElementCreator2.setChildren(element, params.children);

    return element;
  }

  private static setClasses(element: HTMLElement, classes: Array<string> | undefined): void {
    classes?.forEach((className: string) => element.classList.add(className));
  }

  private static setAttribute(element: HTMLElement, attr: Array<{ type: string; value: string }>): void {
    if (attr) attr.forEach((a) => element.setAttribute(a.type, a.value));
  }

  private static setChildren(element: HTMLElement, children: Array<Element>): void {
    children.forEach((ch: Element) => element.append(ch));
  }

  private static setCallback(element: HTMLElement, callbacks: Array<{ event: Event; callback: Function }>): void {
    callbacks.forEach((c) => element.addEventListener(c.event, (e) => c.callback(e)));
  }
}
