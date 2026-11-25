import { BasePage } from './BasePage';
import { Customer } from '../data/checkout';

export class CheckoutInfoPage extends BasePage {
  readonly firstName = this.byTest('firstName');
  readonly lastName = this.byTest('lastName');
  readonly postalCode = this.byTest('postalCode');
  readonly continueButton = this.byTest('continue');
  readonly error = this.byTest('error');

  async fill(customer: Customer) {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
  }

  async continue() {
    await this.continueButton.click();
  }
}
