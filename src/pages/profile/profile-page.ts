import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import inputStyles from '@components/input/input-field/input-field.module.scss';
import styles from './profile-page.module.scss';
import Container from '@components/container/container';
import CustomerApi from '@api/customerApi';
import { apiInstance } from '@api/api';
import { Address, ClientResponse, Customer } from '@commercetools/platform-sdk';
import InputDateField from '@components/input/input-field/input-date-field/input-date-field';
import InputTextField from '@components/input/input-field/input-password-field/input-text-field';
import { validationDate } from '@utils/validation/date';
import { validationName } from '@utils/validation/name';
import { validationBase } from '@utils/validation/street';
import { validationCity } from '@utils/validation/city';
import Dropdown from '@components/dropdown/dropdown';

export default class ProfilePage extends View {
  container: HTMLElement;

  customerId: string = localStorage.getItem('customerID') || '';

  customerApi: CustomerApi = new CustomerApi(apiInstance);

  dateOfBirthInput: InputDateField;

  lastNameInput: InputTextField;

  firstNameInput: InputTextField;

  isValidName: boolean;

  isValidLastName: boolean;

  isValidDateOfBirth: boolean;

  isValidStreet: boolean;

  isValidCity: boolean;

  shippingAddresses: ElementCreator;

  billingAddresses: ElementCreator;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.profile],
    };
    super(params);
    this.container = Container.get();
    this.firstNameInput = new InputTextField({
      name: 'first name',
      callback: this.validateName.bind(this),
      disabled: true,
      additionalClasses: [`${inputStyles.userInputItem}`],
    });
    this.lastNameInput = new InputTextField({
      name: 'last name',
      callback: this.validateLastName.bind(this),
      disabled: true,
      additionalClasses: [`${inputStyles.userInputItem}`],
    });

    this.dateOfBirthInput = new InputTextField({
      name: 'Date of birth',
      callback: this.validateDateOfBirth.bind(this),
      disabled: true,
      additionalClasses: [`${inputStyles.userInputItem}`],
    });
    this.shippingAddresses = new ElementCreator({
      tag: 'div',
      classNames: [styles.userAddresses],
      textContent: 'Shipping addresses',
    });
    this.billingAddresses = new ElementCreator({
      tag: 'div',
      classNames: [styles.userAddresses],
      textContent: 'Billing addresses',
    });
    this.isValidName = false;
    this.isValidLastName = false;
    this.isValidDateOfBirth = false;
    this.isValidStreet = false;
    this.isValidCity = false;
    this.getElement().append(this.container);
    this.configureView();
    this.setcustomerInfo();
  }

  private configureView(): void {
    const title = new ElementCreator({ tag: 'span', textContent: 'Your info ⭐' });

    const userInfo = new ElementCreator({
      tag: 'div',
      classNames: [styles.userInfo],
      children: [this.firstNameInput.getElement(), this.lastNameInput.getElement(), this.dateOfBirthInput.getElement()],
    });

    const userAddresses = new ElementCreator({
      tag: 'div',
      classNames: [styles.userAddresses],
      textContent: 'Your addresses',
      children: [this.shippingAddresses.getElement(), this.billingAddresses.getElement()],
    });
    const userInfoBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.userInfoBlock],
      children: [userInfo.getElement(), userAddresses.getElement()],
    });
    this.container.append(title.getElement(), userInfoBlock.getElement());
  }

  private async getcustomerInfo(): Promise<Customer | undefined> {
    try {
      const customer: ClientResponse<Customer> = await this.customerApi.getCustomer(this.customerId);
      return customer.body;
    } catch (error) {
      console.error(error);
    }
  }

  private async setcustomerInfo(): Promise<void> {
    const customerInfo = await this.getcustomerInfo();
    if (customerInfo) {
      if (customerInfo.firstName && customerInfo.lastName && customerInfo.dateOfBirth) {
        this.firstNameInput.setValue(customerInfo.firstName);
        this.lastNameInput.setValue(customerInfo.lastName);
        this.dateOfBirthInput.setValue(customerInfo.dateOfBirth);
      }
      this.setCustomerAddresses({
        addresses: customerInfo.addresses,
        shippingAddressIds: customerInfo.shippingAddressIds,
        defaultShippingAddressId: customerInfo.defaultShippingAddressId,
        billingAddressIds: customerInfo.billingAddressIds,
        defaultBillingAddressId: customerInfo.defaultBillingAddressId,
      });
    }
  }

  private async setCustomerAddresses(
    addressesInfo: Pick<
      Customer,
      'addresses' | 'shippingAddressIds' | 'defaultShippingAddressId' | 'billingAddressIds' | 'defaultBillingAddressId'
    >
  ): Promise<void> {
    console.log('🚀 ~ ProfilePage ~ addressesInfo:', addressesInfo);
    const shippingIds = addressesInfo.shippingAddressIds;
    if (shippingIds) {
      shippingIds.forEach((id) => {
        const currentAddress: Address | undefined = addressesInfo.addresses.find((address) => address.id === id);
        if (currentAddress && currentAddress.streetName && currentAddress.city) {
          const streetNameInput = new InputTextField({
            name: currentAddress.streetName,
            callback: () => this.validateStreet(streetNameInput),
          });
          streetNameInput.setValue(currentAddress.streetName);
          this.shippingAddresses.getElement().append(streetNameInput.getElement());
          const cityInput = new InputTextField({
            name: currentAddress.city,
            callback: () => this.validateCity(cityInput),
            disabled: true,
          });
          // this.billingCountryInput = new Dropdown(this.clearBillingPostalCode.bind(this));
          /*
          const countryInput = new InputTextField({
            name: 'Postal code',
            callback: () => this.validatePostalCode.call(this, 'shipping'),
            disabled: true,
          }); 
          const postalCodeInput = new InputTextField({
            name: 'Postal code',
            callback: () => this.validatePostalCode.call(this, 'shipping'),
            disabled: true,
          });
          const shippingAddress = new ElementCreator({
            tag: 'div',
            classNames: [styles.shippingAddress],
            attribute: [{ type: 'data-id', value: id }],
          });*/
        }
      });
    }
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

  private validateStreet(streetInput: InputTextField): void {
    const validationMessages: string[] = validationBase(streetInput.getValue());
    streetInput.setErrors(validationMessages);
    this.isValidStreet = !validationMessages.length;
    this.isAllFieldsValid();
  }

  private validateCity(cityInput: InputTextField): void {
    const validationMessages: string[] = validationCity(cityInput.getValue());
    cityInput.setErrors(validationMessages);
    this.isValidCity = !validationMessages.length;
    this.isAllFieldsValid();
  }

  isAllFieldsValid() {
    if (this.isValidName && this.isValidLastName && this.isValidDateOfBirth) {
      return true;
    } else {
      return false;
    }
  }
}
