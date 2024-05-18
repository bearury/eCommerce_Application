import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import inputStyles from '@components/input/input.module.scss';
import styles from './sign-in-page.module.scss';
import View from '@utils/view.ts';
import Form from '@components/form/form';
import Auth from '@api/auth';
import { loaderState, toastState } from '@state/state.ts';
import { validationEmail } from '@utils/validation/email';
import InputField from '@components/input/input-field/input-field';
import Input, { InputType } from '@components/input/input';
import { validationPassword } from '@utils/validation/password';

const auth = new Auth();
export default class SignInPage extends View {
  passwordInput: InputField;

  emailInput: InputField;

  loginInput: Input;

  isValidPassword: boolean;

  isValidEmail: boolean;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
    };
    super(params);
    this.emailInput = new InputField({ type: 'email', callback: this.validateEmail.bind(this) });
    this.passwordInput = new InputField({ type: 'password', callback: this.validatePassword.bind(this) });

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

  configureView() {
    const section = this.getElement();
    const form = new Form().getElement();

    const labelForm = new ElementCreator({
      tag: 'span',
      classNames: [styles.label],
      textContent: 'Sign In',
    }).getElement();

    const showPassword = new Input({
      inputType: InputType.checkbox,
      inputName: 'showPassword',
      classNames: [inputStyles.checkbox],
      callbacks: [{ event: 'click', callback: this.showPassword.bind(this) }],
    }).getElement();

    const showPasswordWithLabel = new ElementCreator({
      tag: 'label',
      classNames: [inputStyles.label],
      textContent: 'Show password?',
      children: [showPassword],
    }).getElement();

    form.append(
      labelForm,
      this.emailInput.getElement(),
      this.passwordInput.getElement(),
      showPasswordWithLabel,
      this.loginInput.getElement()
    );
    section.append(form);
  }

  login(e: Event) {
    e.preventDefault();
    loaderState.getState().loader.show();
    auth
      .login({ email: this.emailInput.getValue(), password: this.passwordInput.getValue() })
      .then(() => {
        toastState.getState().toast.showSuccess('Welcome');
      })
      .catch((e) => {
        toastState.getState().toast.showError(e.body.message);
      })
      .finally(() => loaderState.getState().loader.close());
  }

  validateEmail() {
    const validationMessages = validationEmail(this.emailInput.getValue());
    this.emailInput.setErrors(validationMessages);
    this.isValidEmail = !validationMessages.length;
    this.isAllFieldsValid();
  }

  validatePassword() {
    const validationMessages = validationPassword(this.passwordInput.getValue());
    this.passwordInput.setErrors(validationMessages);
    this.isValidPassword = !validationMessages.length;
    this.isAllFieldsValid();
  }

  showPassword() {
    this.passwordInput.changeType();
  }

  isAllFieldsValid() {
    const loginButton = this.loginInput.getElement() as HTMLInputElement;
    loginButton.disabled = !(this.isValidPassword && this.isValidEmail);
  }
}
