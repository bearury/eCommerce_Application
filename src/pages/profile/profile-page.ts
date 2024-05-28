import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import inputStyles from '@components/input/input-field/input-field.module.scss';
import styles from './profile-page.module.scss';
import Container from '@components/container/container';
import CustomerApi from '@api/customerApi';
import { apiInstance } from '@api/api';
import { ClientResponse, Customer, CustomerDraft } from '@commercetools/platform-sdk';
import InputDateField from '@components/input/input-field/input-date-field/input-date-field';
import InputTextField from '@components/input/input-field/input-password-field/input-text-field';
import { validationDate } from '@utils/validation/date';
import { validationName } from '@utils/validation/name';

export default class ProfilePage extends View {
  container: HTMLElement;

  costumerId: string = localStorage.getItem('customerID') || '';

  costumerApi: CustomerApi = new CustomerApi(apiInstance);

  dateOfBirthInput: InputDateField;

  lastNameInput: InputTextField;

  firstNameInput: InputTextField;

  isValidName: boolean;

  isValidLastName: boolean;

  isValidDateOfBirth: boolean;

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
    this.isValidName = false;
    this.isValidLastName = false;
    this.isValidDateOfBirth = false;
    this.getElement().append(this.container);
    this.configureView();
    this.setCostumerInfo();
  }

  private configureView(): void {
    const title = new ElementCreator({ tag: 'span', textContent: 'Your info ⭐' });
    const userInfoBlock = new ElementCreator({ tag: 'div', classNames: [styles.userInfoBlock] });
    const userInfo = new ElementCreator({ tag: 'div', classNames: [styles.userInfo] });
    userInfo
      .getElement()
      .append(this.firstNameInput.getElement(), this.lastNameInput.getElement(), this.dateOfBirthInput.getElement());
    const userAddresses = new ElementCreator({ tag: 'div', classNames: [styles.userAddresses] });
    userInfoBlock.getElement().append(userInfo.getElement(), userAddresses.getElement());
    this.container.append(title.getElement(), userInfoBlock.getElement());
  }

  private async getCostumerInfo(): Promise<CustomerDraft | undefined> {
    try {
      const customer: ClientResponse<Customer> = await this.costumerApi.getCustomer(this.costumerId);
      return customer.body;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private async setCostumerInfo(): Promise<void> {
    const costumerInfo = await this.getCostumerInfo();
    if (costumerInfo && costumerInfo.firstName && costumerInfo.lastName && costumerInfo.dateOfBirth) {
      this.firstNameInput.setValue(costumerInfo.firstName);
      this.lastNameInput.setValue(costumerInfo.lastName);
      this.dateOfBirthInput.setValue(costumerInfo.dateOfBirth);
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

  isAllFieldsValid() {
    if (this.isValidName && this.isValidLastName && this.isValidDateOfBirth) {
      return true;
    } else {
      return false;
    }
  }
}
