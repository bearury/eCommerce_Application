import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './sign-up-page.module.scss';
import inputStyles from '@components/input/input.module.scss';
import Input, { InputType } from '@components/input/input';
import Form from '@components/form/form';
import Auth from '@api/auth';
import InputTextField from '@components/input/input-field/input-password-field/input-text-field';
import { validationEmail } from '@utils/validation/email';
import InputPasswordField from '@components/input/input-field/input-text-field/input-password-field';
import { validationPassword } from '@utils/validation/password';
import { validationName } from '@utils/validation/name';
import InputDateField from '@components/input/input-field/input-date-field/input-date-field';
import { validationDate } from '@utils/validation/date';
import { validationBase } from '@utils/validation/street';
import { validationCity } from '@utils/validation/city';
import Checkbox from '@components/checkbox/checkbox';
import Dropdown, { ItemDropdownTitle } from '@components/dropdown/dropdown';
import { validationPostalCode } from '../../utils/validation/postalCode';
import { auth } from '@api/api';
import { loaderState, toastState } from '@state/state';
import Router from '@router/router';
import { RouterPages } from '@app/app';

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
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
};

export default class SignUpPage extends View {
  auth: Auth;

  labelForm: ElementCreator;

  passwordInput: InputPasswordField;

  emailInput: InputTextField;

  postalCodeInput: InputTextField;

  cityInput: InputTextField;

  streetNameInput: InputTextField;

  dateOfBirthInput: InputDateField;

  lastNameInput: InputTextField;

  firstNameInput: InputTextField;

  signUp: Input;

  isValidEmail: boolean;

  isValidPassword: boolean;

  isValidName: boolean;

  isValidLastName: boolean;

  isValidDateOfBirth: boolean;

  isValidStreet: boolean;

  isValidCity: boolean;

  isValidPostalCode: boolean;

  billingStreetNameInput: InputTextField;

  billingCityInput: InputTextField;

  billingPostalCodeInput: InputTextField;

  setDefaultAddress: Checkbox;

  setDefaultBillingAddress: Checkbox;

  anotherBillingAddress: Checkbox;

  anotherBillingAddressBlock: ElementCreator;

  shippingAddressBlock: ElementCreator;

  billingAddressBlock: ElementCreator;

  isValidBillingStreet: boolean;

  isValidBillingCity: boolean;

  isValidBillingPostalCode: boolean;

  countryInput: Dropdown;

  billingCountryInput: Dropdown;

  router: Router;

  constructor(router: Router) {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.page],
      textContent: '',
    };
    super(params);
    this.auth = auth;
    this.router = router;
    this.labelForm = new ElementCreator({
      tag: 'span',
      classNames: [styles.label],
      textContent: 'Registration',
    });
    this.isValidEmail = false;
    this.isValidPassword = false;
    this.isValidName = false;
    this.isValidLastName = false;
    this.isValidDateOfBirth = false;
    this.isValidStreet = false;
    this.isValidCity = false;
    this.isValidPostalCode = false;
    this.isValidBillingStreet = false;
    this.isValidBillingCity = false;
    this.isValidBillingPostalCode = false;

    this.emailInput = new InputTextField({ name: 'email', callback: this.validateEmail.bind(this) });
    this.passwordInput = new InputPasswordField({ name: 'password', callback: this.validatePassword.bind(this) });

    this.firstNameInput = new InputTextField({ name: 'first name', callback: this.validateName.bind(this) });
    this.lastNameInput = new InputTextField({ name: 'last name', callback: this.validateLastName.bind(this) });

    this.dateOfBirthInput = new InputDateField({
      name: 'Date of birth',
      callback: this.validateDateOfBirth.bind(this),
    });

    this.streetNameInput = new InputTextField({
      name: 'street name',
      callback: () => this.validateStreet.call(this, 'shipping'),
    });
    this.cityInput = new InputTextField({ name: 'city', callback: () => this.validateCity.call(this, 'shipping') });

    this.postalCodeInput = new InputTextField({
      name: 'Postal code',
      callback: () => this.validatePostalCode.call(this, 'shipping'),
    });

    this.countryInput = new Dropdown(this.clearPostalCode.bind(this));

    this.billingPostalCodeInput = new InputTextField({
      name: 'Billing postal code',
      callback: () => this.validatePostalCode.call(this, 'billing'),
    });

    this.billingCountryInput = new Dropdown(this.clearBillingPostalCode.bind(this));

    this.billingStreetNameInput = new InputTextField({
      name: 'Street name',
      callback: () => this.validateStreet.call(this, 'billing'),
    });

    this.billingCityInput = new InputTextField({
      name: 'City',
      callback: () => this.validateCity.call(this, 'billing'),
    });

    this.signUp = new Input({
      inputType: InputType.submit,
      callbacks: [{ event: 'click', callback: this.register.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      inputName: 'sign-up',
      value: 'Sign-up',
      disabled: true,
    });

    this.setDefaultAddress = new Checkbox({ label: 'Set as default shipping address?' });

    this.setDefaultBillingAddress = new Checkbox({ label: 'Set as default billing address?' });

    this.anotherBillingAddress = new Checkbox({
      label: 'Set another billing address?',
      callback: this.toggleBillingBlock.bind(this),
    });

    this.anotherBillingAddressBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.div],
      children: [this.anotherBillingAddress.getElement()],
    });

    const postalCodeBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.postalCodeBlock],
      children: [this.postalCodeInput.getElement(), this.countryInput.getElement()],
    }).getElement();

    const postalCodeBlockBilling = new ElementCreator({
      tag: 'div',
      classNames: [styles.postalCodeBlock],
      children: [this.billingPostalCodeInput.getElement(), this.billingCountryInput.getElement()],
    }).getElement();

    this.shippingAddressBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.shipping],
      children: [
        this.setDefaultAddress.getElement(),
        this.streetNameInput.getElement(),
        this.cityInput.getElement(),
        postalCodeBlock,
      ],
    });
    this.billingAddressBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.billing, styles.hidden],
      children: [
        this.setDefaultBillingAddress.getElement(),
        this.billingStreetNameInput.getElement(),
        this.billingCityInput.getElement(),
        postalCodeBlockBilling,
      ],
    });

    this.configureView();
  }

  private configureView(): void {
    const section = this.getElement();
    const form = new Form().getElement();
    form.append(
      this.labelForm.getElement(),
      this.emailInput.getElement(),
      this.passwordInput.getElement(),
      this.firstNameInput.getElement(),
      this.lastNameInput.getElement(),
      this.dateOfBirthInput.getElement(),
      this.shippingAddressBlock.getElement(),
      this.anotherBillingAddressBlock.getElement(),
      this.billingAddressBlock.getElement(),
      this.signUp.getElement()
    );
    section.append(form);
  }

  private validatePostalCode(type: 'shipping' | 'billing'): void {
    if (type === 'shipping') {
      if (!this.countryInput.getValue()) {
        this.countryInput.setError();
        return;
      }
      if (!this.postalCodeInput.getValue()) {
        this.postalCodeInput.clearErrors();
        return;
      }
      const validationMessages: string[] = validationPostalCode({
        value: this.postalCodeInput.getValue(),
        country: this.countryInput.getValue() as ItemDropdownTitle,
      });
      this.postalCodeInput.setErrors(validationMessages);
      this.isValidPostalCode = !validationMessages.length;
    } else if (type === 'billing') {
      if (!this.billingCountryInput.getValue()) {
        this.billingCountryInput.setError();
        return;
      }
      if (!this.billingPostalCodeInput.getValue()) {
        this.billingPostalCodeInput.clearErrors();
        return;
      }
      const validationMessages: string[] = validationPostalCode({
        value: this.billingPostalCodeInput.getValue(),
        country: this.billingCountryInput.getValue() as ItemDropdownTitle,
      });
      this.billingPostalCodeInput.setErrors(validationMessages);
      this.isValidBillingPostalCode = !validationMessages.length;
    }
    this.isAllFieldsValid();
  }

  private clearPostalCode(): void {
    this.postalCodeInput.clearValue();
  }

  private clearBillingPostalCode(): void {
    this.billingPostalCodeInput.clearValue();
  }

  private toggleBillingBlock(): void {
    const billingBlock = this.billingAddressBlock.getElement() as HTMLDivElement;
    billingBlock.classList.toggle(styles.hidden);
    this.isAllFieldsValid();
  }

  isAllFieldsValid() {
    const signUp = this.signUp.getElement() as HTMLInputElement;

    if (this.anotherBillingAddress.getStatus()) {
      if (
        this.isValidEmail &&
        this.isValidPassword &&
        this.isValidName &&
        this.isValidLastName &&
        this.isValidDateOfBirth &&
        this.isValidStreet &&
        this.isValidCity &&
        this.isValidPostalCode &&
        this.isValidBillingStreet &&
        this.isValidBillingCity &&
        this.isValidBillingPostalCode
      ) {
        signUp.disabled = false;
      } else {
        signUp.disabled = true;
      }
    } else {
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
  }

  async register(event: Event) {
    event.preventDefault();
    try {
      const request: CustomerDraft = {
        email: this.emailInput.getValue(),
        password: this.passwordInput.getValue(),
        firstName: this.firstNameInput.getValue(),
        lastName: this.lastNameInput.getValue(),
        dateOfBirth: this.dateOfBirthInput.getValue(),
        addresses: [
          {
            firstName: this.firstNameInput.getValue(),
            lastName: this.lastNameInput.getValue(),
            email: this.emailInput.getValue(),
            country: this.countryInput.getValue(),
            streetName: this.streetNameInput.getValue(),
            city: this.cityInput.getValue(),
            postalCode: this.postalCodeInput.getValue(),
          },
        ],
      };
      if (this.setDefaultAddress.getStatus()) {
        request.defaultShippingAddress = 0;
      }
      if (this.anotherBillingAddress.getStatus()) {
        const userStreetName = this.billingStreetNameInput.getValue();
        const userCity = this.billingCityInput.getValue();
        const userPostalCode = this.billingPostalCodeInput.getValue();
        request.addresses.push({
          firstName: this.firstNameInput.getValue(),
          lastName: this.lastNameInput.getValue(),
          email: this.emailInput.getValue(),
          country: this.countryInput.getValue(),
          streetName: userStreetName,
          city: userCity,
          postalCode: userPostalCode,
        });
        if (this.setDefaultBillingAddress.getStatus()) {
          request.defaultBillingAddress = 1;
        }
      }
      auth
        .register(request)
        .then(() => {
          toastState
            .getState()
            .toast.showSuccess(`Welcome ${this.firstNameInput.getValue()} ${this.lastNameInput.getValue()}`);
          this.router.navigate(RouterPages.main);
        })
        .catch((e) => {
          const message = e.body ? e.body.message : 'Unforeseen error';
          toastState.getState().toast.showError(message);
        })
        .finally(() => loaderState.getState().loader.close());
    } catch (error) {
      console.error(error);
    }
  }

  private validateCity(type: 'shipping' | 'billing'): void {
    if (type === 'shipping') {
      const validationMessages: string[] = validationCity(this.cityInput.getValue());
      this.cityInput.setErrors(validationMessages);
      this.isValidCity = !validationMessages.length;
    } else if (type === 'billing') {
      const validationMessages: string[] = validationCity(this.billingCityInput.getValue());
      this.billingCityInput.setErrors(validationMessages);
      this.isValidBillingCity = !validationMessages.length;
    }
    this.isAllFieldsValid();
  }

  private validateStreet(type: 'shipping' | 'billing'): void {
    if (type === 'shipping') {
      const validationMessages: string[] = validationBase(this.streetNameInput.getValue());
      this.streetNameInput.setErrors(validationMessages);
      this.isValidStreet = !validationMessages.length;
    } else if (type === 'billing') {
      const validationMessages: string[] = validationBase(this.billingStreetNameInput.getValue());
      this.billingStreetNameInput.setErrors(validationMessages);
      this.isValidBillingStreet = !validationMessages.length;
    }
    this.isAllFieldsValid();
  }

  private validateDateOfBirth(): void {
    const validationMessages: string[] = validationDate(this.dateOfBirthInput.getValue());
    this.dateOfBirthInput.setErrors(validationMessages);
    this.isValidDateOfBirth = !validationMessages.length;
    this.isAllFieldsValid();
  }

  private validateName(): void {
    const validationMessages: string[] = validationName(this.firstNameInput.getValue());
    this.firstNameInput.setErrors(validationMessages);
    this.isValidName = !validationMessages.length;
    this.isAllFieldsValid();
  }

  private validateLastName(): void {
    const validationMessages: string[] = validationName(this.lastNameInput.getValue());
    this.lastNameInput.setErrors(validationMessages);
    this.isValidLastName = !validationMessages.length;
    this.isAllFieldsValid();
  }

  private validatePassword(): void {
    const validationMessages: string[] = validationPassword(this.passwordInput.getValue());
    this.passwordInput.setErrors(validationMessages);
    this.isValidPassword = !validationMessages.length;
    this.isAllFieldsValid();
  }

  private validateEmail(): void {
    const validationMessages: string[] = validationEmail(this.emailInput.getValue());
    this.emailInput.setErrors(validationMessages);
    this.isValidEmail = !validationMessages.length;
    this.isAllFieldsValid();
  }
}
