import Dropdown, { ItemDropdownTitle } from '@components/dropdown/dropdown';
import InputTextField from '@components/input/input-field/input-password-field/input-text-field';
import { validationCity } from '@utils/validation/city';
import { validationPostalCode } from '@utils/validation/postalCode';
import { validationBase } from '@utils/validation/street';
import inputStyles from '@components/input/input-field/input-field.module.scss';
import View from '@utils/view';
import styles from './address-block.module.scss';
import dropdownStyles from '@components/dropdown/dropdown.module.scss';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator';
import Input, { InputType } from '@components/input/input';
import { apiInstance } from '@api/api';
import CustomerApi from '@api/customerApi';

export type AddressBlockParams = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefaultBilling?: string;
  isDefaultShipping?: string;
  addressId: string;
};

export default class AddressBlock extends View {
  customerId: string | null = localStorage.getItem('customerID');

  customerApi: CustomerApi = new CustomerApi(apiInstance);

  streetNameInput: InputTextField;

  cityInput: InputTextField;

  postalCodeInput: InputTextField;

  countryInput: Dropdown;

  isValidStreet: boolean;

  isValidCity: boolean;

  isValidPostalCode: boolean;

  postalAndCountryBlock: ElementCreator;

  defaultLabel: ElementCreator;

  saveButton: Input;

  editButton: ElementCreator;

  cancelButton: ElementCreator;

  addressId: string;

  constructor({
    street,
    city,
    postalCode,
    country,
    isDefaultShipping,
    isDefaultBilling,
    addressId,
  }: AddressBlockParams) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [`${styles.addressBlock}`],
    };
    super(params);
    this.defaultLabel = new ElementCreator({
      tag: 'div',
      textContent: 'Default',
      classNames: [`${styles.defaultLabel}`],
    });
    this.editButton = new ElementCreator({
      tag: 'span',
      textContent: 'edit ✏️',
      callback: [{ event: 'click', callback: this.editAddress.bind(this) }],
      classNames: [`${styles.editButton}`],
    });
    this.cancelButton = new ElementCreator({
      tag: 'span',
      textContent: 'Cancel ❌',
      callback: [{ event: 'click', callback: this.cancelEditAddress.bind(this) }],
      classNames: [`${styles.editButton}`],
    });
    this.postalAndCountryBlock = new ElementCreator({
      tag: 'div',
      classNames: [`${styles.postalCodeBlock}`],
    });
    this.streetNameInput = new InputTextField({
      name: 'street name',
      callback: () => this.validateStreet(),
      attributes: [
        { type: 'type', value: 'text' },
        { type: 'name', value: 'street name' },
      ],
      additionalClassNames: [`${inputStyles.userInputItem}`],
    });
    this.streetNameInput.setValue(street);
    this.cityInput = new InputTextField({
      name: 'city',
      callback: () => this.validateCity(),
      attributes: [
        { type: 'type', value: 'text' },
        { type: 'name', value: 'city' },
      ],
      additionalClassNames: [`${inputStyles.userInputItem}`],
    });
    this.cityInput.setValue(city);
    this.postalCodeInput = new InputTextField({
      name: 'Postal code',
      callback: () => this.validatePostalCode(),
      attributes: [
        { type: 'type', value: 'text' },
        { type: 'name', value: 'Postal code' },
      ],
      additionalClassNames: [`${inputStyles.userInputItem}`],
    });
    this.postalCodeInput.setValue(postalCode);
    this.countryInput = new Dropdown(this.clearPostalCode.bind(this), [`${dropdownStyles.dropdown}`]);
    this.countryInput.setValue(country);
    this.setDisabledAll(true);
    if (isDefaultBilling === 'yes' || isDefaultShipping === 'yes') {
      this.getElement().appendChild(this.defaultLabel.getElement());
    }
    this.getElement().appendChild(this.editButton.getElement());
    this.getElement().appendChild(this.streetNameInput.getElement());
    this.getElement().appendChild(this.cityInput.getElement());
    this.postalAndCountryBlock.getElement().appendChild(this.postalCodeInput.getElement());
    this.postalAndCountryBlock.getElement().appendChild(this.countryInput.getElement());
    this.getElement().appendChild(this.postalAndCountryBlock.getElement());
    this.isValidStreet = true;
    this.isValidCity = true;
    this.isValidPostalCode = true;
    this.saveButton = new Input({
      inputType: InputType.submit,
      callbacks: [{ event: 'click', callback: this.saveChanges.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      inputName: 'save',
      value: 'Save',
    });
    this.addressId = addressId;
    this.setAddressId(this.addressId);
  }

  private setDisabledAll(isDisabled: boolean): void {
    this.streetNameInput.toggleDisabled(isDisabled);
    this.cityInput.toggleDisabled(isDisabled);
    this.postalCodeInput.toggleDisabled(isDisabled);
    this.countryInput.toggleDisabled(isDisabled);
  }

  private validateStreet(): void {
    console.log(this.streetNameInput.getValue());
    const validationMessages: string[] = validationBase(this.streetNameInput.getValue());
    this.streetNameInput.setErrors(validationMessages);
    this.isValidStreet = !validationMessages.length;
    this.isAllFieldsValid();
  }

  private validateCity(): void {
    const validationMessages: string[] = validationCity(this.cityInput.getValue());
    this.cityInput.setErrors(validationMessages);
    this.isValidCity = !validationMessages.length;
    this.isAllFieldsValid();
  }

  private validatePostalCode(): void {
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
    this.isAllFieldsValid();
  }

  private clearPostalCode(): void {
    this.postalCodeInput.clearValue();
    this.isValidPostalCode = false;
    this.isAllFieldsValid();
  }

  private setAddressId(id: string): void {
    const addressBlock = this.getElement() as HTMLDivElement;
    addressBlock.setAttribute('data-id', id);
  }

  private isAllFieldsValid(): void {
    const saveButton = this.saveButton.getElement() as HTMLButtonElement;
    if (this.isValidStreet && this.isValidCity && this.isValidPostalCode) {
      saveButton.disabled = false;
    } else {
      saveButton.disabled = true;
    }
  }

  private editAddress(): void {
    this.setDisabledAll(false);
    const saveButton = this.saveButton.getElement() as HTMLButtonElement;
    this.getElement().appendChild(saveButton);
    saveButton.disabled = false;
    this.getElement().replaceChild(this.cancelButton.getElement(), this.editButton.getElement());
    const currentAddress = JSON.stringify({
      streetName: this.streetNameInput.getValue(),
      postalCode: this.postalCodeInput.getValue(),
      city: this.cityInput.getValue(),
      country: this.countryInput.getValue(),
    });
    localStorage.setItem('currentAddress', currentAddress);
  }

  private cancelEditAddress(): void {
    this.setDisabledAll(true);
    this.getElement().removeChild(this.saveButton.getElement());
    this.getElement().replaceChild(this.editButton.getElement(), this.cancelButton.getElement());
    const currentAddress = localStorage.getItem('currentAddress');
    if (currentAddress) {
      const parsedAddress = JSON.parse(currentAddress);
      this.streetNameInput.setValue(parsedAddress.streetName);
      this.streetNameInput.clearErrors();
      this.postalCodeInput.setValue(parsedAddress.postalCode);
      this.postalCodeInput.clearErrors();
      this.cityInput.setValue(parsedAddress.city);
      this.cityInput.clearErrors();
      this.countryInput.setValue(parsedAddress.country);
    }
  }

  private async saveChanges(): Promise<void> {
    if (this.customerId) {
      const response = await this.customerApi.changeAddress(this.customerId, this.addressId, {
        streetName: this.streetNameInput.getValue(),
        postalCode: this.postalCodeInput.getValue(),
        city: this.cityInput.getValue(),
        country: this.countryInput.getValue(),
      });
      if (response.statusCode === 200) {
        this.setDisabledAll(true);
        this.getElement().replaceChild(this.editButton.getElement(), this.cancelButton.getElement());
        this.getElement().removeChild(this.saveButton.getElement());
      }
    }
  }
}
