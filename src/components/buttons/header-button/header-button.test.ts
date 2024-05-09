import { describe, expect, it } from 'vitest';
import HeaderButton from '@components/buttons/header-button/header-button.ts';
import { RouterPages } from '@app/app.ts';

describe('Header button component', (): void => {
  const callback = (): void => {};
  const headerButton = new HeaderButton({ buttonType: RouterPages.signup, callback });

  it('Header button instance of HeaderButton class', (): void => {
    expect(headerButton).toBeInstanceOf(HeaderButton);
  });

  it('check that the class instance is not empty', (): void => {
    expect(headerButton).toBeTruthy();
  });
});
