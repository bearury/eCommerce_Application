import InputTextField from '@components/input/input-field/input-password-field/input-text-field';
import inputStyles from '@components/input/input-field/input-field.module.scss';
import View from '@utils/view';
import styles from './changePasswordBlock.module.scss';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator';
import Input, { InputType } from '@components/input/input';
import { apiInstance, projectKey } from '@api/api';
import CustomerApi from '@api/customerApi';
import { validationPassword } from '@utils/validation/password';
import InputPasswordField from '@components/input/input-field/input-text-field/input-password-field';
import Auth from '@api/auth';
import { authState, loaderState, toastState } from '@state/state';
import { LocalStorageTokenCache } from '@api/tokenCache';

export type ChangePasswordBlockParams = {
  oldPassword: string;
  newPassword: string;
};

export default class ChangePasswordBlock extends View {
  customerId: string | null = localStorage.getItem('customerID');

  customerApi: CustomerApi = new CustomerApi(apiInstance);

  newPasswordInput: InputTextField;

  oldPasswordInput: InputTextField;

  isValidOldPassword: boolean;

  isValidNewPassword: boolean;

  saveButton: Input;

  editButton: ElementCreator;

  cancelButton: ElementCreator;

  auth: Auth;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'div',
      classNames: [`${styles.changePasswordBlock}`],
    };
    super(params);
    this.editButton = new ElementCreator({
      tag: 'span',
      textContent: 'Change password 🔑',
      callback: [{ event: 'click', callback: this.changePassword.bind(this) }],
      classNames: [`${styles.editButton}`],
    });
    this.cancelButton = new ElementCreator({
      tag: 'span',
      textContent: 'Cancel ❌',
      callback: [{ event: 'click', callback: this.cancelEditPassword.bind(this) }],
      classNames: [`${styles.editButton}`],
    });
    this.oldPasswordInput = new InputPasswordField({
      name: 'oldPassword',
      callback: () => this.validatePassword.call(this, 'oldPassword'),
      attributes: [
        { type: 'name', value: 'oldPassword' },
        { type: 'type', value: 'password' },
      ],
      additionalClassNames: [`${inputStyles.userInputItem}`],
    });
    this.newPasswordInput = new InputPasswordField({
      name: 'newPassword',
      callback: () => this.validatePassword.call(this, 'newPassword'),
      attributes: [
        { type: 'name', value: 'newPassword' },
        { type: 'type', value: 'password' },
      ],
      additionalClassNames: [`${inputStyles.userInputItem}`],
    });
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
    this.getElement().appendChild(this.oldPasswordInput.getElement());
    this.getElement().appendChild(this.newPasswordInput.getElement());
    this.isValidOldPassword = false;
    this.isValidNewPassword = false;
    this.auth = new Auth(apiInstance);
  }

  private setDisabledAll(isDisabled: boolean): void {
    this.oldPasswordInput.toggleDisabled(isDisabled);
    this.newPasswordInput.toggleDisabled(isDisabled);
  }

  private validatePassword(type: string): void {
    if (type === 'oldPassword') {
      const validationMessages: string[] = validationPassword(this.oldPasswordInput.getValue());
      this.oldPasswordInput.setErrors(validationMessages);
      this.isValidOldPassword = !validationMessages.length;
    }
    if (type === 'newPassword') {
      const validationMessages: string[] = validationPassword(this.newPasswordInput.getValue());
      this.newPasswordInput.setErrors(validationMessages);
      this.isValidNewPassword = !validationMessages.length;
    }
    this.isAllFieldsValid();
  }

  private isAllFieldsValid(): void {
    const saveButton = this.saveButton.getElement() as HTMLButtonElement;
    if (this.isValidOldPassword && this.isValidNewPassword) {
      saveButton.disabled = false;
    } else {
      saveButton.disabled = true;
    }
  }

  private changePassword() {
    this.setDisabledAll(false);
    const saveButton = this.saveButton.getElement() as HTMLButtonElement;
    this.getElement().appendChild(saveButton);
    saveButton.disabled = true;
    this.getElement().replaceChild(this.cancelButton.getElement(), this.editButton.getElement());
  }

  private cancelEditPassword(): void {
    this.setDisabledAll(true);
    this.oldPasswordInput.setValue('');
    this.newPasswordInput.setValue('');
    this.oldPasswordInput.clearErrors();
    this.newPasswordInput.clearErrors();
    this.getElement().removeChild(this.saveButton.getElement());
    this.getElement().replaceChild(this.editButton.getElement(), this.cancelButton.getElement());
  }

  private async saveChanges(): Promise<void> {
    if (this.customerId) {
      const response = await this.customerApi.changePassword(
        this.customerId,
        this.oldPasswordInput.getValue(),
        this.newPasswordInput.getValue()
      );
      if (response.statusCode === 200) {
        localStorage.setItem('password', this.newPasswordInput.getValue());
        try {
          const email = localStorage.getItem('email');
          if (!email) {
            throw new Error('Invalid email!');
          }
          new LocalStorageTokenCache().delete();
          authState.getState().setIsAuthorized(false);
          const newSession = apiInstance.createAnonymousSession();
          apiInstance.setClient(newSession);
          await apiInstance.getClient().withProjectKey({ projectKey }).get().execute();
          const response = await this.auth.login({
            email: email,
            password: this.newPasswordInput.getValue(),
          });

          if (response && response.statusCode === 200) {
            this.oldPasswordInput.setValue('');
            this.newPasswordInput.setValue('');
            this.setDisabledAll(true);
            this.getElement().replaceChild(this.editButton.getElement(), this.cancelButton.getElement());
            this.getElement().removeChild(this.saveButton.getElement());
            toastState.getState().toast.showSuccess('Password changed!');
          } else {
            console.error(response?.body);
          }
        } catch (error) {
          console.error(error);
        } finally {
          loaderState.getState().loader.close();
        }
      } else {
        console.error(response?.body);
      }
    }
  }
}
