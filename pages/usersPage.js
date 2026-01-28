import { expect } from '@playwright/test';

export default class UsersPage{
  constructor(page){
    this.page = page;
    this.userWidget = page.getByRole('menuitem', { name: 'Users' });

    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' });
    this.saveButton = page.getByRole('button', {name:'Save'});
    this.deleteButton = page.getByRole('button', {name:'Delete'});
    this.createNewUserButton = page.getByRole('link', {name: 'Create'});

  };

////////////////////////////////////////////////////////////////////////////////////////////////////
  async gotoUserWidget(){
    await this.userWidget.click();
  };

/////////////////////////////////////////////////////////////////////////////////////////////////// 
  async crateNewUser(email,firstName,lastName){
    this.createNewUserButton.click();
    await this.emailInput.fill(email);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.saveButton.click();
  };

/////////////////////////////////////////////////////////////////////////////////////////////////// 
  async userEmailVerification(email){
    await this.gotoUserWidget();
    const emailValue = this.page.locator('table tbody tr td:nth-child(3)').filter({ hasText: email });
    await expect(emailValue).toHaveCount(1);
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
    async userFirstNameVerification(firstName){
    await this.gotoUserWidget();
    const firstNameValue = this.page.locator('table tbody tr td:nth-child(4)').filter({ hasText: firstName });
    await expect(firstNameValue).toHaveCount(1);
  };

/////////////////////////////////////////////////////////////////////////////////////////////////// 
      async userLastNameVerification(lastName){
    await this.gotoUserWidget();
    const lastNameValue = this.page.locator('table tbody tr td:nth-child(5)').filter({ hasText: lastName });
    await expect(lastNameValue).toHaveCount(1);
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
  async userIdVerification(firstName){
    await this.gotoUserWidget();

  const row = this.page.locator('table tbody tr', {
    has: this.page.locator('td:nth-child(4)', { hasText: firstName })
  });

  const idCell = row.locator('td:nth-child(2)');
  const idText = await idCell.textContent();

  expect(idText?.trim()).not.toBe('');
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
async userFieldsVerification(email,firstName,lastName){
  await this.userEmailVerification(email);
  await this.userFirstNameVerification(firstName);
  await this.userLastNameVerification(lastName);
  await this.userIdVerification(firstName);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
async userUpdateFormVerification(email,firstName,lastName){
  await this.page.getByRole('cell', { name: email }).click();
  await expect(this.firstNameInput).toHaveValue(firstName);
  await expect(this.lastNameInput).toHaveValue(lastName);
  await expect(this.emailInput).toHaveValue(email);
};  

////////////////////////////////////////////////////////////////////////////////////////////////////
async userUpdateInformation(emailOld,emailNew,firstNameNew,lastNameNew){
  await this.page.getByRole('cell', { name: emailOld }).click();
  await this.emailInput.fill('');
  await this.emailInput.fill(emailNew);

  await this.firstNameInput.fill('');
  await this.firstNameInput.fill(firstNameNew);

  await this.lastNameInput.fill('');
  await this.lastNameInput.fill(lastNameNew);

  await this.saveButton.click();

  await this.gotoUserWidget();

  await this.userEmailVerification(emailNew);
  await this.userFirstNameVerification(firstNameNew);
  await this.userLastNameVerification(lastNameNew);
};

////////////////////////////////////////////////////////////////////////////////////////////////////
async expectRequiredErrorForEmptyFiled(field) {
  const fieldContainer = this.page.locator(`.ra-input-${field}`);
  const error = fieldContainer.locator('.MuiFormHelperText-root');

  const formError = this.page.locator('.MuiSnackbarContent-message');

  await expect(formError).toHaveText('The form is not valid. Please check for errors');
  await expect(error).toHaveText('Required');
};

////////////////////////////////////////////////////////////////////////////////////////////////////
async openWholeUserList(){
  // open select "Rows per page"
await this.page.locator('.MuiTablePagination-select').click();

// select 50
await this.page.getByRole('option', { name: '50' }).click();
};

////////////////////////////////////////////////////////////////////////////////////////////////////
async userUpdateUnsuccessInformation(emailOld,emailNew,firstNameNew,lastNameNew){
  await this.page.getByRole('cell', { name: emailOld }).click();
  await this.emailInput.fill('');
  await this.emailInput.fill(emailNew);

  await this.firstNameInput.fill('');
  await this.firstNameInput.fill(firstNameNew);

  await this.lastNameInput.fill('');
  await this.lastNameInput.fill(lastNameNew);

  await this.saveButton.click();
};

////////////////////////////////////////////////////////////////////////////////////////////////////
async expectEmailFormatErrorFor() {
  const fieldContainer = this.page.locator(`.ra-input-email`);
  const error = fieldContainer.locator('.MuiFormHelperText-root');

  const formError = this.page.locator('.MuiSnackbarContent-message');

  await expect(formError).toHaveText('The form is not valid. Please check for errors');
  await expect(error).toHaveText('Incorrect email format');
};

////////////////////////////////////////////////////////////////////////////////////////////////////
async userNotExistVerification({ email, firstName, lastName }) {
  await this.gotoUserWidget();

  const rows = this.page.locator('table tbody tr');
  const rowCount = await rows.count();

  let userExists = false;

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);
    const cells = row.locator('td');

    const emailText = (await cells.nth(2).textContent());
    const firstNameText = (await cells.nth(3).textContent());
    const lastNameText = (await cells.nth(4).textContent());

    if (emailText === email && firstNameText === firstName && lastNameText === lastName) {
      userExists = true;
      break;
    }
  }

  await expect(userExists).toBeFalsy();
};

////////////////////////////////////////////////////////////////////////////////////////////////////
async deleteUserFromUserForm(email, firstName,lastName) {
  await this.page.getByRole('cell', { name: email }).click();
  await this.deleteButton.click();

const snackbar = this.page.locator('.MuiSnackbarContent-message');

await expect(snackbar).toHaveText('Element deleted');

// verify user doesn't exist on the user widget
await this.userNotExistVerification(email, firstName, lastName );
};

////////////////////////////////////////////////////////////////////////////////////////////////////
async deleteUserFromUserWidget(email, firstName,lastName) {
  await this.openWholeUserList();
  const row = this.page.locator('tr', {
  has: this.page.locator('td.column-email', { hasText: email }),
});
await row.getByRole('checkbox').check();
await this.deleteButton.click();

const snackbar = this.page.locator('.MuiSnackbarContent-message');
await expect(snackbar).toHaveText('Element deleted');
await this.userNotExistVerification(email, firstName, lastName );  
};

////////////////////////////////////////////////////////////////////////////////////////////////////
async deleteTwoUsersFromUserWidget(email1, firstName1,lastName1,email2, firstName2,lastName2, ) {
  await this.openWholeUserList();
  const row1 = this.page.locator('tr', {
  has: this.page.locator('td.column-email', { hasText: email1 }),
});
await row1.getByRole('checkbox').check();

  const row2 = this.page.locator('tr', {
  has: this.page.locator('td.column-email', { hasText: email2 }),
});
await row2.getByRole('checkbox').check();

await this.deleteButton.click();

const snackbar = this.page.locator('.MuiSnackbarContent-message');
await expect(snackbar).toHaveText('2 elements deleted');

await this.userNotExistVerification(email1, firstName1, lastName1 ); 
await this.userNotExistVerification(email2, firstName2, lastName2 ); 
};

////////////////////////////////////////////////////////////////////////////////////////////////////
async deleteBulkUsersFromUserWidget( ) {
  await this.openWholeUserList();
  const rows = this.page.locator('table.MuiTable-root tbody tr');
  const rowCount = await rows.count();

  const selectAllCheckBox = await this.page.getByRole('checkbox', { name: 'Select all' });
  await selectAllCheckBox.check();
  await expect(selectAllCheckBox).toBeChecked();

  const itemSelectedMsg = await this.page.getByRole('heading', { name: `${rowCount} items selected`, level: 6})
  await expect(itemSelectedMsg).toBeVisible();

  this.deleteButton.click();

  const snackbar = this.page.locator('.MuiSnackbarContent-message');
  await expect(snackbar).toHaveText(`${rowCount} elements deleted`);

  const warningText = this.page.locator('.MuiTypography-root', { hasText: 'Do you want to add one'})
  await expect(warningText).toBeVisible();
  await expect(this.createNewUserButton).toBeVisible();

};

////////////////////////////////////////////////////////////////////////////////////////////////////
async cancelDeleteOneUserFromUserWidget(email,firstName, lastName ) {
  await this.openWholeUserList();
  const row = this.page.locator('tr', {
  has: this.page.locator('td.column-email', { hasText: email }),
});
await row.getByRole('checkbox').check();
await this.deleteButton.click();

await this.page.getByRole('button', {name:'Undo'}).click();
await this.userFieldsVerification(email,firstName,lastName); 

};

////////////////////////////////////////////////////////////////////////////////////////////////////
async cancelDeleteTwoUserFromUserWidget(email1,firstName1, lastName1, email2,firstName2, lastName2 ) {
  await this.openWholeUserList();
  const row1 = this.page.locator('tr', {
  has: this.page.locator('td.column-email', { hasText: email1 }),
});
await row1.getByRole('checkbox').check();

const row2 = this.page.locator('tr', {
has: this.page.locator('td.column-email', { hasText: email2 }),
});
await row2.getByRole('checkbox').check();

await this.deleteButton.click();

await this.page.getByRole('button', {name:'Undo'}).click();
await this.userFieldsVerification(email1,firstName1,lastName1); 

await this.userFieldsVerification(email2,firstName2,lastName2); 

};

};