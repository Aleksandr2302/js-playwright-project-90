import { test, expect } from "@playwright/test";
import LoginPage from "../../pages/loginPage";
import UsersPage from "../../pages/usersPage";
import { loginData } from "../../fixtures/tasks";
import { generateUser } from "../../fixtures/user";

let usersPage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(loginData.username, loginData.password);

  usersPage = new UsersPage(page);
  await usersPage.gotoUserWidget();
});

test.describe("user creating and validation", () => {
  test("new user form creating verification", async () => {
    await usersPage.createNewUserButton.click();

    await expect(usersPage.emailInput).toBeVisible();
    await expect(usersPage.firstNameInput).toBeVisible();
    await expect(usersPage.lastNameInput).toBeVisible();
    await expect(usersPage.saveButton).toBeVisible();
  });

  test("1 new user creating", async () => {
    const user = generateUser();
    await usersPage.createNewUser(user.email, user.firstName, user.lastName);

    await expect(usersPage.firstNameInput).toBeVisible();
    await expect(usersPage.lastNameInput).toBeVisible();
    await expect(usersPage.saveButton).toBeVisible();
  });

  test("2 new users creating", async () => {
    const user1 = generateUser();
    await usersPage.createNewUser(user1.email, user1.firstName, user1.lastName);

    await expect(usersPage.firstNameInput).toBeVisible();
    await expect(usersPage.lastNameInput).toBeVisible();
    await expect(usersPage.saveButton).toBeVisible();

    const user2 = generateUser();
    await usersPage.createNewUser(user2.email, user2.firstName, user2.lastName);

    await expect(usersPage.firstNameInput).toBeVisible();
    await expect(usersPage.lastNameInput).toBeVisible();
    await expect(usersPage.saveButton).toBeVisible();
  });

  test("user information validation on the user widget", async () => {
    const user = generateUser();
    await usersPage.createNewUser(user.email, user.firstName, user.lastName);

    await usersPage.gotoUserWidget();

    await usersPage.userFieldsVerification(
      user.email,
      user.firstName,
      user.lastName,
    );
  });
});

test.describe("user updating and validation", () => {
  test("user update form verification", async () => {
    const user = generateUser();
    await usersPage.createNewUser(user.email, user.firstName, user.lastName);

    await usersPage.gotoUserWidget();
    await usersPage.userUpdateFormVerification(
      user.email,
      user.firstName,
      user.lastName,
    );
  });

  test("changing user information and verifying", async () => {
    // Data for first user
    const user1 = generateUser();

    // Data for updating user
    const user2 = generateUser();

    await usersPage.createNewUser(user1.email, user1.firstName, user1.lastName);
    await usersPage.gotoUserWidget();

    // Change user information
    await usersPage.userUpdateInformation(
      user1.email,
      user2.email,
      user2.firstName,
      user2.lastName,
    );
  });
});

test.describe("Validation errors while updating Email, firstName, lastName", () => {
  test('check email "required" error while updating user information - negative case', async () => {
    // Data for first user
    const user1 = generateUser();

    // Data for updating user
    const user2 = generateUser({ email: "" });

    await usersPage.createNewUser(user1.email, user1.firstName, user1.lastName);
    await usersPage.gotoUserWidget();

    // Change user information
    await usersPage.userUpdateUnsuccessInformation(
      user1.email,
      user2.email,
      user2.firstName,
      user2.lastName,
    );
    await usersPage.expectRequiredErrorForEmptyFiled("email");
  });

  test('check firstName "required" error while updating user information - negative case', async () => {
    // Data for first user
    const user1 = generateUser();

    // Data for updating user
    const user2 = generateUser({ firstName: "" });

    await usersPage.createNewUser(user1.email, user1.firstName, user1.lastName);
    await usersPage.gotoUserWidget();

    // Change user information
    await usersPage.userUpdateUnsuccessInformation(
      user1.email,
      user2.email,
      user2.firstName,
      user2.lastName,
    );
    await usersPage.expectRequiredErrorForEmptyFiled("firstName");
  });

  test('check lastName "required" error while updating user information - negative case', async () => {
    // Data for first user
    const user1 = generateUser();

    // Data for updating user
    const user2 = generateUser({ lastName: "" });

    await usersPage.createNewUser(user1.email, user1.firstName, user1.lastName);
    await usersPage.gotoUserWidget();

    // Change user information
    await usersPage.userUpdateUnsuccessInformation(
      user1.email,
      user2.email,
      user2.firstName,
      user2.lastName,
    );
    await usersPage.expectRequiredErrorForEmptyFiled("lastName");
  });

  test("check email format error validation while updating user information - negative case", async () => {
    // Data for first user
    const user1 = generateUser();

    // Data for updating user
    const user2 = generateUser({ email: "email" });

    await usersPage.createNewUser(user1.email, user1.firstName, user1.lastName);
    await usersPage.gotoUserWidget();

    // Change user information
    await usersPage.userUpdateUnsuccessInformation(
      user1.email,
      user2.email,
      user2.firstName,
      user2.lastName,
    );
    await usersPage.expectEmailFormatErrorFor("email");
  });
});

test.describe("removal user", () => {
  test("delete user from the user form", async () => {
    // Data for first user
    const user1 = generateUser();

    await usersPage.createNewUser(user1.email, user1.firstName, user1.lastName);
    await usersPage.gotoUserWidget();

    await usersPage.deleteUserFromUserForm(
      user1.email,
      user1.firstName,
      user1.lastName,
    );
  });

  test("delete user from the user widget", async () => {
    // Data for first user
    const user1 = generateUser();

    await usersPage.createNewUser(user1.email, user1.firstName, user1.lastName);
    await usersPage.gotoUserWidget();

    await usersPage.deleteUserFromUserWidget(
      user1.email,
      user1.firstName,
      user1.lastName,
    );
  });

  test("delete 2 users from the user widget", async () => {
    // Data for first user
    const user1 = generateUser();

    // Data for second user
    const user2 = generateUser();

    await usersPage.createNewUser(user1.email, user1.firstName, user1.lastName);
    await usersPage.gotoUserWidget();

    await usersPage.createNewUser(user2.email, user2.firstName, user2.lastName);
    await usersPage.gotoUserWidget();

    await usersPage.deleteTwoUsersFromUserWidget(
      user1.email,
      user1.firstName,
      user1.lastName,
      user2.email,
      user2.firstName,
      user2.lastName,
    );
  });

  test("delete bulk all users from the user widget", async () => {
    // Data for first user
    const user1 = generateUser();

    // Data for second user
    const user2 = generateUser();

    await usersPage.createNewUser(user1.email, user1.firstName, user1.lastName);
    await usersPage.gotoUserWidget();

    await usersPage.createNewUser(user2.email, user2.firstName, user2.lastName);
    await usersPage.gotoUserWidget();

    await usersPage.deleteBulkUsersFromUserWidget();
  });

  test("cancel deletion one user from the user widget", async () => {
    // Data for user
    const user1 = generateUser();

    await usersPage.createNewUser(user1.email, user1.firstName, user1.lastName);
    await usersPage.gotoUserWidget();

    await usersPage.cancelDeleteOneUserFromUserWidget(
      user1.email,
      user1.firstName,
      user1.lastName,
    );
  });

  test("cancel deletion two users from the user widget", async () => {
    // Data for first user
    const user1 = generateUser();

    // Data for second user
    const user2 = generateUser();

    await usersPage.createNewUser(user1.email, user1.firstName, user1.lastName);
    await usersPage.gotoUserWidget();

    await usersPage.createNewUser(user2.email, user2.firstName, user2.lastName);
    await usersPage.gotoUserWidget();

    await usersPage.cancelDeleteTwoUserFromUserWidget(
      user1.email,
      user1.firstName,
      user1.lastName,
      user2.email,
      user2.firstName,
      user2.lastName,
    );
  });
});
