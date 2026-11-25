import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly username = this.byTest('username');
  readonly password = this.byTest('password');
  readonly loginButton = this.byTest('login-button');
  readonly error = this.byTest('error');

  async open() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
    await expect(this.page).toHaveURL(/inventory\.html/);
  }
}
