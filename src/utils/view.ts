import { ElementCreator, ParamsElementCreator } from './element-creator';

interface ElCreator extends ElementCreator {}

abstract class View {
  elementCreator: ElCreator;

  protected constructor(params: ParamsElementCreator) {
    this.elementCreator = this.createView(params);
  }

  public getElement(): HTMLElement {
    return this.elementCreator.element;
  }

  private createView(params: ParamsElementCreator): ElementCreator {
    const elementParams = {
      tag: params.tag,
      classNames: params.classNames,
      textContent: params.textContent,
      callback: params.callback,
      attribute: params.attribute,
    };
    return new ElementCreator(elementParams);
  }
}

export default View;
