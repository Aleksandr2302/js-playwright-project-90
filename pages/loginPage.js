export default class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByRole("textbox", { name: "username" });
    this.passwordInput = page.getByRole("textbox", { name: "password" });
    this.signButton = page.getByRole("button", { name: "Sign in" });
    this.welcomeGreeting = page.getByRole("heading", {
      name: "Welcome to the administration",
      level: 6,
    });
  }
  async goto() {
    await this.page.goto("/");
  }
  async login(usernameText, passwordText) {
    await this.usernameInput.fill(usernameText);
    await this.passwordInput.fill(passwordText);
    await this.signButton.click();
  }
}
