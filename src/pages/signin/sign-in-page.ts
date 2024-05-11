import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import inputStyles from '@components/input/input.module.scss';
import styles from './sign-in-page.module.scss';
import View from '@utils/view.ts';
import Form from '@components/form/form';
import Input, { InputType } from '@components/input/input';

export default class SignInPage extends View {
  passwordInput: Input;

  emailInput: Input;

  wrongPasswordText: ElementCreator;

  wrongEmailText: ElementCreator;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
      textContent: 'SignInPage',
    };
    super(params);
    this.passwordInput = new Input({
      inputType: InputType.password,
      callbacks: [{ event: 'input', callback: this.validatePassword.bind(this) }],
      classNames: [inputStyles.input, inputStyles.passwordInput],
      placeholder: 'Your password',
    });
    this.emailInput = new Input({
      inputType: InputType.text,
      callbacks: [{ event: 'input', callback: this.validateEmail.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      placeholder: 'Your e-mail',
    });
    this.wrongEmailText = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent: 'Please check that you entered the email correctly',
    });
    this.wrongPasswordText = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongPasswordText, inputStyles.hidden],
      textContent: 'Please check that you entered the password correctly',
    });

    this.configureView();
  }

  configureView() {
    const section = this.getElement();
    const form = new Form().getElement();
    const showPassword = new Input({
      inputType: InputType.checkbox,
      inputName: 'showPassword',
      callbacks: [{ event: 'click', callback: this.showPassword.bind(this) }],
    });
    const loginInput = new Input({
      inputType: InputType.submit,
      callbacks: [{ event: 'click', callback: this.login.bind(this) }],
      value: 'Login',
    });
    const showPasswordWithLabel = new ElementCreator({
      tag: 'label',
      classNames: [inputStyles.label],
      textContent: 'Show password?',
      children: [showPassword.getElement()],
    });
    form.append(
      this.emailInput.getElement(),
      this.wrongEmailText.getElement(),
      this.passwordInput.getElement(),
      showPasswordWithLabel.getElement(),
      this.wrongPasswordText.getElement(),
      loginInput.getElement()
    );
    section.append(form);
  }

  login(e: Event) {
    e.preventDefault();
    console.log('Login callBack');
  }

  validateEmail(event: Event) {
    const emailInput = event.target as HTMLInputElement;
    const emailValue = emailInput.value;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const isValidEmail = emailRegex.test(emailValue);
    const errorText = this.wrongEmailText.getElement() as HTMLSpanElement;
    errorText.classList.toggle(inputStyles.hidden, isValidEmail);
  }

  validatePassword(event: Event) {
    const passwordInput = event.target as HTMLInputElement;
    const passwordValue = passwordInput.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    const isValidPassword = passwordRegex.test(passwordValue);
    const errorText = this.wrongPasswordText.getElement() as HTMLSpanElement;
    errorText.classList.toggle(inputStyles.hidden, isValidPassword);
  }

  showPassword() {
    const passwordInput = this.passwordInput.getElement() as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  submit() {
    console.log('submit');
  }

  click() {
    console.log('click');
  }
}
