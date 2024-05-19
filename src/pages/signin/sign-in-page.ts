import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import inputStyles from '@components/input/input.module.scss';
import styles from './sign-in-page.module.scss';
import View from '@utils/view.ts';
import Form from '@components/form/form';
import Auth from '@api/auth';
import { loaderState, toastState } from '@state/state.ts';
import { validationEmail } from '@utils/validation/email';
import Input, { InputType } from '@components/input/input';
import { validationPassword } from '@utils/validation/password';
import { RouterPages } from '@app/app.ts';
import Router from '@router/router.ts';
import InputTextField from '@components/input/input-field/input-password-field/input-text-field.ts';
import InputPasswordField from '@components/input/input-field/input-text-field/input-password-field.ts';

export default class SignInPage extends View {
  passwordInput: InputPasswordField;

  emailInput: InputTextField;

  loginInput: Input;

  isValidPassword: boolean;

  isValidEmail: boolean;

  router: Router;

  auth: Auth;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
    };
    super(params);

    this.router = router;
    this.auth = new Auth();

    this.emailInput = new InputTextField({
      name: 'email',
      callback: this.validateEmail.bind(this),
    });
    this.passwordInput = new InputPasswordField({ name: 'password', callback: this.validatePassword.bind(this) });

    this.loginInput = new Input({
      inputType: InputType.submit,
      callbacks: [{ event: 'click', callback: this.login.bind(this) }],
      classNames: [inputStyles.submit],
      value: 'Login',
      disabled: true,
    });

    this.configureView();
    this.isValidPassword = false;
    this.isValidEmail = false;
  }

  private login(e: Event): void {
    e.preventDefault();
    loaderState.getState().loader.show();

    this.auth
      .login({ email: this.emailInput.getValue(), password: this.passwordInput.getValue() })
      .then(() => {
        toastState.getState().toast.showSuccess('Welcome');
        this.router.navigate(RouterPages.main);
      })
      .catch((e) => {
        const message = e.body ? e.body.message : 'Unforeseen error';
        toastState.getState().toast.showError(message);
      })
      .finally(() => loaderState.getState().loader.close());
  }

  private validateEmail(): void {
    const validationMessages: string[] = validationEmail(this.emailInput.getValue());
    this.emailInput.setErrors(validationMessages);
    this.isValidEmail = !validationMessages.length;
    this.isAllFieldsValid();
  }

  private validatePassword(): void {
    const validationMessages: string[] = validationPassword(this.passwordInput.getValue());
    this.passwordInput.setErrors(validationMessages);
    this.isValidPassword = !validationMessages.length;
    this.isAllFieldsValid();
  }

  private isAllFieldsValid(): void {
    const loginButton: HTMLInputElement = this.loginInput.getElement() as HTMLInputElement;
    loginButton.disabled = !(this.isValidPassword && this.isValidEmail);
  }

  private configureView(): void {
    const section: HTMLElement = this.getElement();
    const form: HTMLElement = new Form().getElement();

    const labelForm: HTMLElement = new ElementCreator({
      tag: 'span',
      classNames: [styles.label],
      textContent: 'Login',
    }).getElement();

    form.append(labelForm, this.emailInput.getElement(), this.passwordInput.getElement(), this.loginInput.getElement());
    section.append(form);
  }
}
