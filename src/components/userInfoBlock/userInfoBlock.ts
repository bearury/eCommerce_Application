import InputTextField from '@components/input/input-field/input-password-field/input-text-field';
import inputStyles from '@components/input/input-field/input-field.module.scss';
import View from '@utils/view';
import styles from './userInfoBlock.module.scss';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator';
import Input, { InputType } from '@components/input/input';
import { apiInstance } from '@api/api';
import CustomerApi from '@api/customerApi';
import InputDateField from '@components/input/input-field/input-date-field/input-date-field';
import { validationDate } from '@utils/validation/date';
import { validationName } from '@utils/validation/name';
import { validationEmail } from '@utils/validation/email';

export type UserInfoBlockParams = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
};

export default class UserInfoBlock extends View {
  customerId: string | null = localStorage.getItem('customerID');

  customerApi: CustomerApi = new CustomerApi(apiInstance);

  dateOfBirthInput: InputDateField;

  lastNameInput: InputTextField;

  firstNameInput: InputTextField;

  emailInput: InputTextField;

  isValidName: boolean;

  isValidLastName: boolean;

  isValidDateOfBirth: boolean;

  isValidEmail: boolean;

  saveButton: Input;

  editButton: ElementCreator;

  cancelButton: ElementCreator;

  constructor({ firstName, lastName, dateOfBirth, email }: UserInfoBlockParams) {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [`${styles.userInfoBlock}`],
    };
    super(params);
    this.editButton = new ElementCreator({
      tag: 'span',
      textContent: 'edit ✏️',
      callback: [{ event: 'click', callback: this.editUserInfo.bind(this) }],
      classNames: [`${styles.Button}`, `${styles.editButton}`],
    });
    this.cancelButton = new ElementCreator({
      tag: 'span',
      textContent: 'Cancel ❌',
      callback: [{ event: 'click', callback: this.cancelEditUserInfo.bind(this) }],
      classNames: [`${styles.Button}`, `${styles.cancelButton}`],
    });
    this.firstNameInput = new InputTextField({
      name: 'first name',
      callback: this.validateName.bind(this),
      attributes: [
        { type: 'type', value: 'text' },
        { type: 'name', value: 'first name' },
      ],
      additionalClassNames: [`${inputStyles.userInputItem}`],
    });
    this.firstNameInput.setValue(firstName);
    this.lastNameInput = new InputTextField({
      name: 'last name',
      callback: this.validateLastName.bind(this),
      attributes: [
        { type: 'type', value: 'text' },
        { type: 'name', value: 'last name' },
      ],
      additionalClassNames: [`${inputStyles.userInputItem}`],
    });
    this.lastNameInput.setValue(lastName);
    this.dateOfBirthInput = new InputDateField({
      name: 'Date of birth',
      callback: this.validateDateOfBirth.bind(this),
      attributes: [
        { type: 'name', value: 'Date of birth' },
        { type: 'type', value: 'date' },
      ],
      additionalClassNames: [`${inputStyles.userInputItem}`],
    });
    this.dateOfBirthInput.setValue(dateOfBirth);
    this.emailInput = new InputTextField({
      name: 'email',
      callback: this.validateEmail.bind(this),
      attributes: [
        { type: 'name', value: 'email' },
        { type: 'type', value: 'email' },
      ],
      additionalClassNames: [`${inputStyles.userInputItem}`],
    });
    this.emailInput.setValue(email);
    this.setDisabledAll(true);
    this.getElement().appendChild(this.editButton.getElement());
    this.saveButton = new Input({
      inputType: InputType.submit,
      callbacks: [{ event: 'click', callback: this.saveChanges.bind(this) }],
      classNames: [inputStyles.input, inputStyles.emailInput],
      inputName: 'save',
      value: 'Save',
    });
    this.getElement().appendChild(this.editButton.getElement());
    this.getElement().appendChild(this.firstNameInput.getElement());
    this.getElement().appendChild(this.lastNameInput.getElement());
    this.getElement().appendChild(this.dateOfBirthInput.getElement());
    this.getElement().appendChild(this.emailInput.getElement());
    this.isValidName = true;
    this.isValidLastName = true;
    this.isValidDateOfBirth = true;
    this.isValidEmail = true;
  }

  private setDisabledAll(isDisabled: boolean): void {
    this.firstNameInput.toggleDisabled(isDisabled);
    this.lastNameInput.toggleDisabled(isDisabled);
    this.dateOfBirthInput.toggleDisabled(isDisabled);
    this.emailInput.toggleDisabled(isDisabled);
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

  private validateEmail(): void {
    const validationMessages: string[] = validationEmail(this.emailInput.getValue());
    this.emailInput.setErrors(validationMessages);
    this.isValidEmail = !validationMessages.length;
    this.isAllFieldsValid();
  }

  private isAllFieldsValid(): void {
    const saveButton = this.saveButton.getElement() as HTMLButtonElement;
    if (this.isValidName && this.isValidLastName && this.isValidDateOfBirth && this.isValidEmail) {
      saveButton.disabled = false;
    } else {
      saveButton.disabled = true;
    }
  }

  private editUserInfo() {
    this.setDisabledAll(false);
    const saveButton = this.saveButton.getElement() as HTMLButtonElement;
    this.getElement().appendChild(saveButton);
    saveButton.disabled = false;
    this.getElement().replaceChild(this.cancelButton.getElement(), this.editButton.getElement());
    const currentUserData = JSON.stringify({
      firstName: this.firstNameInput.getValue(),
      lastName: this.lastNameInput.getValue(),
      dateOfBirth: this.dateOfBirthInput.getValue(),
      email: this.emailInput.getValue(),
    });
    localStorage.setItem('currentUserData', currentUserData);
  }

  private cancelEditUserInfo(): void {
    this.setDisabledAll(true);
    this.getElement().removeChild(this.saveButton.getElement());
    this.getElement().replaceChild(this.editButton.getElement(), this.cancelButton.getElement());
    const currentUserData = localStorage.getItem('currentUserData');
    if (currentUserData) {
      const parsedUserData = JSON.parse(currentUserData);
      this.firstNameInput.setValue(parsedUserData.firstName);
      this.firstNameInput.clearErrors();
      this.lastNameInput.setValue(parsedUserData.lastName);
      this.lastNameInput.clearErrors();
      this.dateOfBirthInput.setValue(parsedUserData.dateOfBirth);
      this.dateOfBirthInput.clearErrors();
      this.emailInput.setValue(parsedUserData.email);
      this.emailInput.clearErrors();
    }
  }

  private async saveChanges(): Promise<void> {
    if (this.customerId) {
      const response = await this.customerApi.changeUserInfo(
        this.customerId,
        this.firstNameInput.getValue(),
        this.lastNameInput.getValue(),
        this.dateOfBirthInput.getValue(),
        this.emailInput.getValue()
      );
      if (response.statusCode === 200) {
        this.setDisabledAll(true);
        this.getElement().replaceChild(this.editButton.getElement(), this.cancelButton.getElement());
        this.getElement().removeChild(this.saveButton.getElement());
      }
    }
  }
}
