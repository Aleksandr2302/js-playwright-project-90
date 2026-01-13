// @ts-check
import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import UsersPage from '../../pages/usersPage';

const loginData = {
  username: 'username',
  password: 'password',
};

function generateRandomEmail() {
  const random = Math.floor(Math.random() * 1000);
  return `example${random}@gmail.com`;
}

function generateRandomName(base = 'UserName') {
  const random = Math.floor(Math.random() * 1000);
  return `${base}${random}`;
}

function generateRandomLastName(base = 'UserLastName') {
  const random = Math.floor(Math.random() * 1000);
  return `${base}${random}`;
}



let usersPage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(loginData.username, loginData.password);

  usersPage = new UsersPage(page);
  await usersPage.gotoUserWidget();
})

test.describe('user creating and validation', () => {

test('new user form creating verification', async ({ page }) => {
  await usersPage.createNewUserButton.click();

  await expect(usersPage.emailInput).toBeVisible();
  await expect(usersPage.firstNameInput).toBeVisible();
  await expect(usersPage.lastNameInput).toBeVisible();
  await expect(usersPage.saveButton).toBeVisible();
  
});

test('1 new user creating', async ({ page }) => {
  const userEmail = generateRandomEmail();
  const userName = generateRandomName();
  const userLastName = generateRandomLastName();
  
  await usersPage.crateNewUser(userEmail, userName, userLastName);

  await expect(usersPage.firstNameInput).toBeVisible();
  await expect(usersPage.lastNameInput).toBeVisible();
  await expect(usersPage.saveButton).toBeVisible();
  
});

test('2 new users creating', async ({ page }) => {
  
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();
  
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);

  await expect(usersPage.firstNameInput).toBeVisible();
  await expect(usersPage.lastNameInput).toBeVisible();
  await expect(usersPage.saveButton).toBeVisible();


  const userEmail2 = generateRandomEmail();
  const userName2 = generateRandomName();
  const userLastName2 = generateRandomLastName();
  
  await usersPage.crateNewUser(userEmail2, userName2, userLastName2);

  await expect(usersPage.firstNameInput).toBeVisible();
  await expect(usersPage.lastNameInput).toBeVisible();
  await expect(usersPage.saveButton).toBeVisible();
  
});

test('user information validation on the user widget', async ({ page }) => {
  
  const userEmail = generateRandomEmail();
  const userName = generateRandomName();
  const userLastName = generateRandomLastName();
  
  await usersPage.crateNewUser(userEmail, userName, userLastName);
  await usersPage.gotoUserWidget();

  await usersPage.userFieldsVerification(userEmail,userName,userLastName);

});

});

test.describe('user updating and validation', () => {

test('user update form verification', async ({ page }) => {
  const userEmail = generateRandomEmail();
  const userName = generateRandomName();
  const userLastName = generateRandomLastName();
  
  await usersPage.crateNewUser(userEmail, userName, userLastName);
  await usersPage.gotoUserWidget();
  await usersPage.userUpdateFormVerification(userEmail,userName,userLastName);
});

test('changing user information and verifying', async ({ page }) => {
// Data for first user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

// Data for updating user
  const userEmailNew = generateRandomEmail();
  const userNameNew = generateRandomName();
  const userLastNameNew = generateRandomLastName();
  
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  await usersPage.gotoUserWidget();

// Change user information
  await usersPage.userUpdateInformation(userEmail1,userEmailNew,userNameNew,userLastNameNew );
});
});


test.describe('Validation errors while updating Email, firstName, lastName', () => {

test('check email "required" error while updating user information - negative case', async ({ page }) => {
// Data for first user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  // Data for updating user
  const userEmailNew = '';
  const userNameNew = generateRandomName();
  const userLastNameNew = generateRandomLastName();

  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  await usersPage.gotoUserWidget();


// Change user information
  await usersPage.userUpdateUnsuccessInformation(userEmail1,userEmailNew,userNameNew,userLastNameNew );
  await usersPage.expectRequiredErrorForEmptyFiled('email')
});

test('check firstName "required" error while updating user information - negative case', async ({ page }) => {
// Data for first user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  // Data for updating user
  const userEmailNew = generateRandomEmail();
  const userNameNew = '';
  const userLastNameNew = generateRandomLastName();

  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  await usersPage.gotoUserWidget();


// Change user information
  await usersPage.userUpdateUnsuccessInformation(userEmail1,userEmailNew,userNameNew,userLastNameNew );
  await usersPage.expectRequiredErrorForEmptyFiled('firstName');
});


test('check lastName "required" error while updating user information - negative case', async ({ page }) => {
// Data for first user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  // Data for updating user
  const userEmailNew = generateRandomEmail();
  const userNameNew = generateRandomName();
  const userLastNameNew = '';

  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  await usersPage.gotoUserWidget();


// Change user information
  await usersPage.userUpdateUnsuccessInformation(userEmail1,userEmailNew,userNameNew,userLastNameNew );
  await usersPage.expectRequiredErrorForEmptyFiled('lastName');
});


test('check email format error validation while updating user information - negative case', async ({ page }) => {
// Data for first user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  // Data for updating user
  const userEmailNew = 'email';
  const userNameNew = generateRandomName();
  const userLastNameNew = generateRandomLastName();

  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  await usersPage.gotoUserWidget();


// Change user information
  await usersPage.userUpdateUnsuccessInformation(userEmail1,userEmailNew,userNameNew,userLastNameNew );
  await usersPage.expectEmailFormatErrorFor('email');
});
});

test.describe('removal user', () => {

  test('delete user from the user form', async ({ page }) => {
// Data for first user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  await usersPage.gotoUserWidget();

  await usersPage.deleteUserFromUserForm(userEmail1,userName1, userLastName1);


});

test('delete user from the user widget', async ({ page }) => {
// Data for first user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  await usersPage.gotoUserWidget();

  await usersPage.deleteUserFromUserWidget(userEmail1,userName1, userLastName1);
});


test('delete 2 users from the user widget', async ({ page }) => {
// Data for first user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

// Data for second user 
  const userEmail2 = generateRandomEmail();
  const userName2 = generateRandomName();
  const userLastName2 = generateRandomLastName();  

  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  await usersPage.gotoUserWidget();

  await usersPage.crateNewUser(userEmail2, userName2, userLastName2);
  await usersPage.gotoUserWidget();

  await usersPage.deleteTwoUsersFromUserWidget(userEmail1,userName1, userLastName1,userEmail2,userName2, userLastName2);
});


test('delete bulk all users from the user widget', async ({ page }) => {
// Data for first user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

// Data for second user 
  const userEmail2 = generateRandomEmail();
  const userName2 = generateRandomName();
  const userLastName2 = generateRandomLastName();  

  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  await usersPage.gotoUserWidget();
  
  await usersPage.crateNewUser(userEmail2, userName2, userLastName2);
  await usersPage.gotoUserWidget();

  await usersPage.deleteBulkUsersFromUserWidget();
});


test('cancel deletion one user from the user widget', async ({ page }) => {
// Data for user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();


  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  await usersPage.gotoUserWidget();

  await usersPage.cancelDeleteOneUserFromUserWidget(userEmail1,userName1,userLastName1); ;
});

test('cancel deletion two users from the user widget', async ({ page }) => {
// Data for first user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  // Data for second user 
  const userEmail2 = generateRandomEmail();
  const userName2 = generateRandomName();
  const userLastName2 = generateRandomLastName();


  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  await usersPage.gotoUserWidget();
  
  await usersPage.crateNewUser(userEmail2, userName2, userLastName2);
  await usersPage.gotoUserWidget();

  await usersPage.cancelDeleteTwoUserFromUserWidget(userEmail1,userName1,userLastName1,userEmail2, userName2, userLastName2);
});

});


