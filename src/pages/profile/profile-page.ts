import View from '@utils/view.ts';
import { ElementCreator, ParamsElementCreator } from '@utils/element-creator.ts';
import styles from './profile-page.module.scss';
import Container from '@components/container/container';
import CustomerApi from '@api/customerApi';
import { apiInstance } from '@api/api';
import { Address, ClientResponse, Customer } from '@commercetools/platform-sdk';
import AddressBlock from '@components/addressBlock/addressBlock';
import UserInfoBlock from '@components/userInfoBlock/userInfoBlock';
import ChangePasswordBlock from '@components/changePasswordBlock/changePasswordBlock';

export default class ProfilePage extends View {
  container: HTMLElement;

  customerId: string = localStorage.getItem('customerID') || '';

  customerApi: CustomerApi = new CustomerApi(apiInstance);

  shippingAddresses: ElementCreator;

  billingAddresses: ElementCreator;

  userAddresses: ElementCreator;

  shippingTitle: ElementCreator;

  billingTitle: ElementCreator;

  userInfo: ElementCreator;

  constructor() {
    const params: ParamsElementCreator = {
      tag: 'section',
      classNames: [styles.profile],
    };
    super(params);
    this.container = Container.get();
    this.userInfo = new ElementCreator({
      tag: 'div',
      classNames: [styles.userInfo],
    });
    this.shippingAddresses = new ElementCreator({
      tag: 'div',
      classNames: [`${styles.addressBlock}`],
    });
    this.billingAddresses = new ElementCreator({
      tag: 'div',
      classNames: [`${styles.addressBlock}`],
    });
    this.shippingTitle = new ElementCreator({
      tag: 'div',
      textContent: 'Shipping addresses 🚚',
      classNames: [`${styles.header}`],
    });
    this.billingTitle = new ElementCreator({
      tag: 'div',
      textContent: 'Billing addresses 💶',
      classNames: [`${styles.header}`],
    });
    this.userAddresses = new ElementCreator({
      tag: 'div',
      classNames: [styles.userAddresses],
      children: [
        this.shippingTitle.getElement(),
        this.shippingAddresses.getElement(),
        this.billingTitle.getElement(),
        this.billingAddresses.getElement(),
      ],
    });
    this.getElement().append(this.container);
    this.configureView();
    this.setСustomerInfo();
  }

  private configureView(): void {
    const title = new ElementCreator({ tag: 'div', textContent: 'Your info ⭐', classNames: [`${styles.header}`] });

    const userInfoBlock = new ElementCreator({
      tag: 'div',
      classNames: [styles.userInfoBlock],
      children: [this.userInfo.getElement(), this.userAddresses.getElement()],
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

  private async setСustomerInfo(): Promise<void> {
    const customerInfo = await this.getcustomerInfo();
    if (customerInfo) {
      if (
        customerInfo.firstName &&
        customerInfo.lastName &&
        customerInfo.dateOfBirth &&
        customerInfo.version &&
        customerInfo.email
      ) {
        const userInfoBlock = new UserInfoBlock({
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          dateOfBirth: customerInfo.dateOfBirth,
          email: customerInfo.email,
        });
        const changePasswordBlock = new ChangePasswordBlock();
        this.userInfo.getElement().appendChild(userInfoBlock.getElement());
        this.userInfo.getElement().appendChild(changePasswordBlock.getElement());
        localStorage.setItem('customerVersion', `${customerInfo.version}`);
      }
      this.setCustomerAddresses({
        addresses: customerInfo.addresses,
        shippingAddressIds: customerInfo.shippingAddressIds,
        defaultShippingAddressId: customerInfo.defaultShippingAddressId,
        billingAddressIds: customerInfo.billingAddressIds,
        defaultBillingAddressId: customerInfo.defaultBillingAddressId,
      });
    } else {
      console.error('Wrong customer data!');
    }
  }

  private async setCustomerAddresses(
    addressesInfo: Pick<
      Customer,
      'addresses' | 'shippingAddressIds' | 'defaultShippingAddressId' | 'billingAddressIds' | 'defaultBillingAddressId'
    >
  ): Promise<void> {
    const shippingIds = addressesInfo.shippingAddressIds;
    const billingIds = addressesInfo.billingAddressIds;
    const defaultShippingAddressId = addressesInfo.defaultShippingAddressId;
    const defaultBillingAddressId = addressesInfo.defaultBillingAddressId;
    const shippingAddressesBlock = this.shippingAddresses.getElement();
    const billingAddressesBlock = this.billingAddresses.getElement();
    if (addressesInfo.addresses) {
      addressesInfo.addresses.forEach((address) => {
        const currentAddress: Address = address;
        if (
          currentAddress &&
          currentAddress.streetName &&
          currentAddress.city &&
          currentAddress.postalCode &&
          currentAddress.country &&
          currentAddress.id
        ) {
          const addressParams = {
            street: currentAddress.streetName,
            city: currentAddress.city,
            postalCode: currentAddress.postalCode,
            country: currentAddress.country,
            isDefaultShipping: 'no',
            isDefaultBilling: 'no',
            addressId: currentAddress.id,
          };
          if (defaultShippingAddressId && currentAddress.id && defaultShippingAddressId.includes(currentAddress.id)) {
            addressParams.isDefaultShipping = 'yes';
          }
          if (defaultBillingAddressId && currentAddress.id && defaultBillingAddressId.includes(currentAddress.id)) {
            addressParams.isDefaultBilling = 'yes';
          }
          const address = new AddressBlock(addressParams).getElement();
          if (shippingIds && currentAddress.id && shippingIds.includes(currentAddress.id)) {
            shippingAddressesBlock.append(address);
          } else if (billingIds && currentAddress.id && billingIds.includes(currentAddress.id)) {
            billingAddressesBlock.append(address);
          }
        }
      });
    }
  }
}
