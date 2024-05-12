import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './sign-up-page.module.scss';
import inputStyles from '@components/input/input.module.scss';
import Input, { InputType } from '@components/input/input';
import Form from '@components/form/form';
import Auth from '@api/auth';

type Address = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  streetName: string;
  city: string;
  postalCode: string;
};

type CustomerDraft = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
  defaultShippingAddress?: number; // Optional property
};

const auth = new Auth();
export default class SignUpPage extends View {
  passwordInput: Input;

  emailInput: Input;

  countryInputUS: Input;

  countryInputDE: Input;

  countryInputGB: Input;

  postalCodeInput: Input;

  cityInput: Input;

  streetNameInput: Input;

  dateOfBirthInput: Input;

  lastNameInput: Input;

  firstNameInput: Input;

  signUp: Input;

  setDefaultAddressInput: Input;

  isValidEmail: boolean;

  isValidPassword: boolean;

  isValidName: boolean;

  isValidLastName: boolean;

  isValidDateOfBirth: boolean;

  isValidStreet: boolean;

  isValidCity: boolean;

  isValidPostalCode: boolean;

  formattedEmailError: ElementCreator;

  passwordError: ElementCreator;

  firstNameError: ElementCreator;

  lastNameError: ElementCreator;

  dateOfBirthError: ElementCreator;

  streetError: ElementCreator;

  cityError: ElementCreator;

  postalCodeError: ElementCreator;

  usa: HTMLInputElement;

  germany: HTMLInputElement;

  britain: HTMLInputElement;

  setDefaultShippingAddress: HTMLInputElement;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
      textContent: 'SignUpPage',
    };
    super(params);

    this.isValidEmail = false;
    this.isValidPassword = false;
    this.isValidName = false;
    this.isValidLastName = false;
    this.isValidDateOfBirth = false;
    this.isValidStreet = false;
    this.isValidCity = false;
    this.isValidPostalCode = false;
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
    this.firstNameInput = new Input({
      inputType: InputType.text,
      callbacks: [{ event: 'input', callback: this.validateName.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      placeholder: 'Your first name',
    });
    this.lastNameInput = new Input({
      inputType: InputType.text,
      callbacks: [{ event: 'input', callback: this.validateLastName.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      placeholder: 'Your last name',
    });
    this.dateOfBirthInput = new Input({
      inputType: InputType.text,
      callbacks: [
        { event: 'focus', callback: this.dateOnFocus.bind(this) },
        { event: 'input', callback: this.validateDateOfBirth.bind(this) },
      ],
      classNames: [inputStyles.input, inputStyles.emailInput],
      placeholder: 'Date of birth',
    });
    this.streetNameInput = new Input({
      inputType: InputType.text,
      callbacks: [{ event: 'input', callback: this.validateStreet.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      placeholder: 'Street name',
    });
    this.cityInput = new Input({
      inputType: InputType.text,
      callbacks: [{ event: 'input', callback: this.validateCity.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      placeholder: 'City',
    });
    this.postalCodeInput = new Input({
      inputType: InputType.text,
      callbacks: [{ event: 'input', callback: this.validatePostalCode.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      placeholder: 'Postal code',
    });
    this.countryInputUS = new Input({
      inputType: InputType.radio,
      callbacks: [{ event: 'input', callback: this.clearPostalCode.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      inputName: 'country',
      value: 'US',
      checked: true,
    });
    this.countryInputDE = new Input({
      inputType: InputType.radio,
      callbacks: [{ event: 'input', callback: this.clearPostalCode.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      inputName: 'country',
      value: 'DE',
    });
    this.countryInputGB = new Input({
      inputType: InputType.radio,
      callbacks: [{ event: 'input', callback: this.clearPostalCode.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      inputName: 'country',
      value: 'GB',
    });
    this.signUp = new Input({
      inputType: InputType.submit,
      callbacks: [{ event: 'click', callback: this.register.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      inputName: 'sign-up',
      value: 'Sign-up',
      disabled: true,
    });
    this.setDefaultAddressInput = new Input({
      inputType: InputType.checkbox,
      callbacks: [],
      classNames: [inputStyles.input, inputStyles.emailInput],
      inputName: 'setDefaultAddress',
    });
    this.formattedEmailError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent: 'Email address must be properly formatted (e.g., user@example.com).',
    });
    this.passwordError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent: 'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number',
    });
    this.firstNameError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent: 'Must contain at least one character and no special characters or numbers',
    });
    this.lastNameError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent: 'Must contain at least one character and no special characters or numbers',
    });
    this.dateOfBirthError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent: 'You must be 13 years old or older',
    });
    this.streetError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent: 'Must contain at least one character',
    });
    this.cityError = new ElementCreator({
      tag: 'span',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent: 'Must contain at least one character and no special characters or numbers',
    });
    this.postalCodeError = new ElementCreator({
      tag: 'div',
      classNames: [inputStyles.wrongEmailText, inputStyles.hidden],
      textContent:
        'Must follow the format for the country: (e.g., 12345 or 12345-6789 for the U.S., 12345 for the Germany, SW1W 0NY for the Great Britain)',
    });
    this.usa = this.countryInputUS.getElement() as HTMLInputElement;
    this.germany = this.countryInputDE.getElement() as HTMLInputElement;
    this.britain = this.countryInputGB.getElement() as HTMLInputElement;
    this.setDefaultShippingAddress = this.setDefaultAddressInput.getElement() as HTMLInputElement;
    this.configureView();
  }

  configureView() {
    const usaLabel = new ElementCreator({
      tag: 'label',
      classNames: [inputStyles.label],
      textContent: 'USA',
      children: [this.countryInputUS.getElement()],
    });
    const germanyLabel = new ElementCreator({
      tag: 'label',
      classNames: [inputStyles.label],
      textContent: 'Germany',
      children: [this.countryInputDE.getElement()],
    });
    const britainLabel = new ElementCreator({
      tag: 'label',
      classNames: [inputStyles.label],
      textContent: 'Great Britain',
      children: [this.countryInputGB.getElement()],
    });
    const setDefaultAddressLabel = new ElementCreator({
      tag: 'label',
      classNames: [inputStyles.label],
      textContent: 'Set as default shipping address?',
      children: [this.setDefaultAddressInput.getElement()],
    });
    const setDefaultAddressBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.div],
      children: [setDefaultAddressLabel.getElement()],
    });
    const section = this.getElement();
    const form = new Form().getElement();
    form.append(
      this.emailInput.getElement(),
      this.formattedEmailError.getElement(),
      this.passwordInput.getElement(),
      this.passwordError.getElement(),
      this.firstNameInput.getElement(),
      this.firstNameError.getElement(),
      this.lastNameInput.getElement(),
      this.lastNameError.getElement(),
      this.dateOfBirthInput.getElement(),
      this.dateOfBirthError.getElement(),
      setDefaultAddressBlock.getElement(),
      this.streetNameInput.getElement(),
      this.streetError.getElement(),
      this.cityInput.getElement(),
      this.cityError.getElement(),
      usaLabel.getElement(),
      germanyLabel.getElement(),
      britainLabel.getElement(),
      this.postalCodeInput.getElement(),
      this.postalCodeError.getElement(),
      this.signUp.getElement()
    );
    section.append(form);
  }

  validateEmail(event: Event) {
    const emailInput = event.target as HTMLInputElement;
    const emailValue = emailInput.value;
    const emailRegex =
      /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const isValidEmailInput = emailRegex.test(emailValue);
    this.formattedEmailError.getElement().classList.toggle(inputStyles.hidden, isValidEmailInput);
    this.isValidEmail = isValidEmailInput;
    console.log('🚀 ~ SignUpPage ~ validateEmail ~ this.isValidEmail:', this.isValidEmail);
    this.isAllFieldsValid();
  }

  validatePassword(event: Event) {
    const passwordInput = event.target as HTMLInputElement;
    const passwordValue = passwordInput.value;
    const isLengthValid = passwordValue.length >= 8;
    const hasUppercaseLetter = /[A-Z]/.test(passwordValue);
    const hasLowercaseLetter = /[a-z]/.test(passwordValue);
    const hasDigit = /\d/.test(passwordValue);
    const hasNoWhitespace = passwordValue.trim() === passwordValue;
    const isValidPassword = isLengthValid && hasUppercaseLetter && hasLowercaseLetter && hasDigit && hasNoWhitespace;
    this.passwordError.getElement().classList.toggle(inputStyles.hidden, isValidPassword);
    this.isValidPassword = isValidPassword;
    this.isAllFieldsValid();
  }

  dateOnFocus() {
    const date = this.dateOfBirthInput.getElement() as HTMLInputElement;
    date.type = 'date';
  }

  validateName(event: Event) {
    const nameInput = event.target as HTMLInputElement;
    const nameValue = nameInput.value;
    const nameRegex = /^[a-zA-Z]+$/;
    const isValidName = nameRegex.test(nameValue);
    this.firstNameError.getElement().classList.toggle(inputStyles.hidden, isValidName);
    this.isValidName = isValidName;
    this.isAllFieldsValid();
  }

  validateLastName(event: Event) {
    const nameInput = event.target as HTMLInputElement;
    const nameValue = nameInput.value;
    const nameRegex = /^[a-zA-Z]+$/;
    const isValidName = nameRegex.test(nameValue);
    this.lastNameError.getElement().classList.toggle(inputStyles.hidden, isValidName);
    this.isValidLastName = isValidName;
    this.isAllFieldsValid();
  }

  validateDateOfBirth(event: Event) {
    const dateInput = event.target as HTMLInputElement;
    const dateValue = dateInput.value;
    const userDate = new Date(dateValue);
    const currentDate = new Date();
    const minAge = 13;
    const userAge = currentDate.getFullYear() - userDate.getFullYear();
    const isValidAge = userAge >= minAge;
    this.dateOfBirthError.getElement().classList.toggle(inputStyles.hidden, isValidAge);
    this.isValidDateOfBirth = isValidAge;
    this.isAllFieldsValid();
  }

  validateStreet(event: Event) {
    const streetInput = event.target as HTMLInputElement;
    const streetValue = streetInput.value;
    const isValidStreet = streetValue.trim().length > 0;
    this.streetError.getElement().classList.toggle(inputStyles.hidden, isValidStreet);
    this.isValidStreet = isValidStreet;
    this.isAllFieldsValid();
  }

  validateCity(event: Event) {
    const cityInput = event.target as HTMLInputElement;
    const cityValue = cityInput.value;
    const cityRegex = /^[a-zA-Z]+$/;
    const isValidCity = cityRegex.test(cityValue);
    this.cityError.getElement().classList.toggle(inputStyles.hidden, isValidCity);
    this.isValidCity = isValidCity;
    this.isAllFieldsValid();
  }

  validatePostalCode(event: Event) {
    const PostalCodeInput = event.target as HTMLInputElement;
    const PostalCodeValue = PostalCodeInput.value;
    const usaRegex = /^\d{5}(?:[-\s]\d{4})?$/;
    const germanyRegex = /^(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})$/;
    const britainRegex = /^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/i;
    let regex: RegExp = usaRegex;
    if (this.usa.checked) {
      regex = usaRegex;
    } else if (this.germany.checked) {
      regex = germanyRegex;
    } else if (this.britain.checked) {
      regex = britainRegex;
    }
    const isValidPostalCode = regex.test(PostalCodeValue);
    this.postalCodeError.getElement().classList.toggle(inputStyles.hidden, isValidPostalCode);
    this.isValidPostalCode = isValidPostalCode;
    this.isAllFieldsValid();
  }

  clearPostalCode() {
    const postalCodeInput = this.postalCodeInput.getElement() as HTMLInputElement;
    postalCodeInput.value = '';
    this.postalCodeError.getElement().classList.add(inputStyles.hidden);
  }

  isAllFieldsValid() {
    const signUp = this.signUp.getElement() as HTMLInputElement;
    if (
      this.isValidEmail &&
      this.isValidPassword &&
      this.isValidName &&
      this.isValidLastName &&
      this.isValidDateOfBirth &&
      this.isValidStreet &&
      this.isValidCity &&
      this.isValidPostalCode
    ) {
      signUp.disabled = false;
    } else {
      signUp.disabled = true;
    }
  }

  async register(event: Event) {
    event.preventDefault();
    const userEmail = (this.emailInput.getElement() as HTMLInputElement).value;
    const userPassword = (this.passwordInput.getElement() as HTMLInputElement).value;
    const userFirstName = (this.firstNameInput.getElement() as HTMLInputElement).value;
    const userLastName = (this.lastNameInput.getElement() as HTMLInputElement).value;
    const userDateOfBirth = (this.dateOfBirthInput.getElement() as HTMLInputElement).value;
    const userStreetName = (this.streetNameInput.getElement() as HTMLInputElement).value;
    const userCity = (this.cityInput.getElement() as HTMLInputElement).value;
    const userPostalCode = (this.postalCodeInput.getElement() as HTMLInputElement).value;
    let userCountryCode;
    if (this.usa.checked) {
      userCountryCode = 'US';
    } else if (this.germany.checked) {
      userCountryCode = 'DE';
    } else {
      userCountryCode = 'GB';
    }
    try {
      const request: CustomerDraft = {
        email: userEmail,
        password: userPassword,
        firstName: userFirstName,
        lastName: userLastName,
        dateOfBirth: userDateOfBirth,
        addresses: [
          {
            firstName: userFirstName,
            lastName: userLastName,
            email: userEmail,
            country: userCountryCode,
            streetName: userStreetName,
            city: userCity,
            postalCode: userPostalCode,
          },
        ],
      };
      if (this.setDefaultShippingAddress.checked) {
        request.defaultShippingAddress = 0;
      }
      const data = await auth.register(request);
      if (data.statusCode === 201) {
        console.log('User created');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
