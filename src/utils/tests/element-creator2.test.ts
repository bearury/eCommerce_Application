import { describe, expect, it } from 'vitest';
import ElementCreator2 from '@utils/element-creator2';

describe('Element creator', (): void => {
  const htmlDivElement = ElementCreator2.create({
    tag: 'div',
    textContent: 'test',
  });
  const host = document.body.appendChild(htmlDivElement);

  it('htmlDivElement has a text content', (): void => {
    expect(host.innerHTML).toContain('test');
  });
});
