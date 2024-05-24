import { describe, expect, it } from 'vitest';
import { ElementCreator } from '@utils/element-creator';

describe('Element creator', (): void => {
  const htmlDivElement = new ElementCreator({
    tag: 'div',
    textContent: 'test',
  });
  const host = document.body.appendChild(htmlDivElement.getElement());

  it('Header pages instance of HeaderPages class', (): void => {
    expect(htmlDivElement).toBeInstanceOf(ElementCreator);
  });

  it('htmlDivElement has a text content', (): void => {
    expect(host.innerHTML).toContain('test');
  });
});
