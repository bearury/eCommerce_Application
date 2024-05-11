import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import inputStyles from '@components/input/input.module.scss';
import styles from './sign-in-page.module.scss';
import View from '@utils/view.ts';
import Form from '@components/form/form';
import Input, { InputType } from '@components/input/input';

export default class SignInPage extends View {
  passwordInput: Input;

  emailInput: Input;

  formattedEmailError: ElementCreator;

  noWhiteSpaceError: ElementCreator;

  noDomainError: ElementCreator;

  noSeparatingError: ElementCreator;

  passMinLengthError: ElementCreator;

  oneUppercaseError: ElementCreator;

  oneDigitError: ElementCreator;

  oneLowerCaseError: ElementCreator;

  passNoWhiteSpaceError: ElementCreator;

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
    this.formattedEmailError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent: 'Email address must be properly formatted (e.g., user@example.com).',
    });
    this.noWhiteSpaceError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent: 'Email address must not contain leading or trailing whitespace.',
    });
    this.noDomainError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent: 'Email address must contain a domain name (e.g., example.com).',
    });
    this.noSeparatingError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent: 'Email address must contain an "@" symbol separating local part and domain name.',
    });

    this.passMinLengthError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongPasswordText, inputStyles.hidden],
      textContent: 'Password must be at least 8 characters long.',
    });

    this.oneUppercaseError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongPasswordText, inputStyles.hidden],
      textContent: 'Password must contain at least one uppercase letter (A-Z).',
    });

    this.oneLowerCaseError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongPasswordText, inputStyles.hidden],
      textContent: 'Password must contain at least one lowercase letter (a-z).',
    });

    this.oneDigitError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongPasswordText, inputStyles.hidden],
      textContent: 'Password must contain at least one digit (0-9).',
    });

    this.passNoWhiteSpaceError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongPasswordText, inputStyles.hidden],
      textContent: 'Password must not contain leading or trailing whitespace.',
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
    const emailErrors = new ElementCreator({
      tag: 'div',
      classNames: [inputStyles.emailErrors],
      children: [
        this.formattedEmailError.getElement(),
        this.noWhiteSpaceError.getElement(),
        this.noDomainError.getElement(),
        this.noSeparatingError.getElement(),
      ],
    });
    const passwordErrors = new ElementCreator({
      tag: 'div',
      classNames: [inputStyles.emailErrors],
      children: [
        this.passMinLengthError.getElement(),
        this.oneUppercaseError.getElement(),
        this.oneLowerCaseError.getElement(),
        this.oneDigitError.getElement(),
        this.passNoWhiteSpaceError.getElement(),
      ],
    });

    form.append(
      this.emailInput.getElement(),
      emailErrors.getElement(),
      this.passwordInput.getElement(),
      showPasswordWithLabel.getElement(),
      passwordErrors.getElement(),
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
    const emailRegex = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const isValidEmail = emailRegex.test(emailValue);
    const noWhiteSpace = emailValue.trim() === emailValue;
    const domainRegex = /@[^\s@]+\.[^\s@]{2,}$/;
    const hasDomain = domainRegex.test(emailValue);
    const atIndex = emailValue.indexOf('@');
    const dotIndex = emailValue.lastIndexOf('.');
    const hasValidAtSymbol = atIndex > 0 && dotIndex > atIndex;
    this.formattedEmailError.getElement().classList.toggle(inputStyles.hidden, isValidEmail);
    this.noWhiteSpaceError.getElement().classList.toggle(inputStyles.hidden, noWhiteSpace);
    this.noDomainError.getElement().classList.toggle(inputStyles.hidden, hasDomain);
    this.noSeparatingError.getElement().classList.toggle(inputStyles.hidden, hasValidAtSymbol);
  }

  validatePassword(event: Event) {
    const passwordInput = event.target as HTMLInputElement;
    const passwordValue = passwordInput.value;
    const isLengthValid = passwordValue.length >= 8;
    const hasUppercaseLetter = /[A-Z]/.test(passwordValue);
    const hasLowercaseLetter = /[a-z]/.test(passwordValue);
    const hasDigit = /\d/.test(passwordValue);
    const hasNoWhitespace = passwordValue.trim() === passwordValue;
    this.passMinLengthError.getElement().classList.toggle(inputStyles.hidden, isLengthValid);
    this.oneUppercaseError.getElement().classList.toggle(inputStyles.hidden, hasUppercaseLetter);
    this.oneLowerCaseError.getElement().classList.toggle(inputStyles.hidden, hasLowercaseLetter);
    this.oneDigitError.getElement().classList.toggle(inputStyles.hidden, hasDigit);
    this.passNoWhiteSpaceError.getElement().classList.toggle(inputStyles.hidden, hasNoWhitespace);
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
}
