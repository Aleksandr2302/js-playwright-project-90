import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import LabelsPage from '../../pages/labelsPage';

const loginData = {
  username: 'username',
  password: 'password',
};

function generateRandomLabelName() {
  const random = Math.floor(Math.random() * 1000);
  return `RandomLabelName${random}`;
}

let labelsPage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(loginData.username, loginData.password);

  labelsPage = new LabelsPage(page);
  await labelsPage.gotoLabelsWidget();
})

test.describe('labels creating and validation', () => {

test('new label form creating verification', async ({ page }) => {
  await labelsPage.gotoLabelsWidget();
  await labelsPage.newLabelFormVerification();
});

test('1 new task statuses creating', async ({ page }) => {
  const labelName = generateRandomLabelName();

  await labelsPage.gotoLabelsWidget();
  await labelsPage.createNewLabel(labelName);
  await labelsPage.labelVerification(labelName);
  
  
});

test('2 new labels creating', async ({ page }) => {
  const labelName1 = generateRandomLabelName();

  await labelsPage.gotoLabelsWidget();
  await labelsPage.createNewLabel(labelName1);
  await labelsPage.labelVerification(labelName1);

  const labelName2 = generateRandomLabelName();

  await labelsPage.gotoLabelsWidget();
  await labelsPage.createNewLabel(labelName2);
  await labelsPage.labelVerification(labelName2);
  
});

});

test.describe('update labels and validation', () => {
  test('update 1 label and validation', async ({ page }) => {
  const labelName1 = generateRandomLabelName();
  const action = 'updated'

  await labelsPage.gotoLabelsWidget();
  await labelsPage.createNewLabel(labelName1);
  await labelsPage.labelVerification(labelName1);

  const labelName2 = generateRandomLabelName();

  await labelsPage.updateLabel(labelName1,labelName2);

  await labelsPage.labelVerification(labelName2, action);
  
});
});


test.describe('delete labels and validation', () => {
  test('delete 1 label and validation from widget', async ({ page }) => {
  const labelName1 = generateRandomLabelName();

  await labelsPage.gotoLabelsWidget();
  await labelsPage.createNewLabel(labelName1);
  await labelsPage.labelVerification(labelName1);

  await labelsPage.deleteLabelFromWidget(labelName1)
});

  test('delete 1 label and validation from the from', async ({ page }) => {
  const labelName1 = generateRandomLabelName();

  await labelsPage.gotoLabelsWidget();
  await labelsPage.createNewLabel(labelName1);
  await labelsPage.labelVerification(labelName1);

  await labelsPage.deleteLabelFromTheForm(labelName1)
});



test('delete bulk labels and validation', async ({ page }) => {
  const labelName1 = generateRandomLabelName();
  const labelName2 = generateRandomLabelName();

  await labelsPage.gotoLabelsWidget();

  await labelsPage.createNewLabel(labelName1);
  await labelsPage.labelVerification(labelName1);
  await labelsPage.gotoLabelsWidget();

  await labelsPage.createNewLabel(labelName2);
  await labelsPage.labelVerification(labelName2);
  await labelsPage.deleteBulkLabels(labelName1);
});

  test('cancel deletion of 1 label from the from', async ({ page }) => {
  const labelName1 = generateRandomLabelName();

  await labelsPage.gotoLabelsWidget();
  await labelsPage.createNewLabel(labelName1);
  await labelsPage.labelVerification(labelName1);

  await labelsPage.cancelDeletionLabelFromTheForm(labelName1);
});

  test('cancel bulk deletion of labels on the Widget', async ({ page }) => {
  const labelName1 = generateRandomLabelName();
  const labelName2 = generateRandomLabelName();

  await labelsPage.gotoLabelsWidget();
  
  await labelsPage.createNewLabel(labelName1);
  await labelsPage.labelVerification(labelName1);
  await labelsPage.gotoLabelsWidget();

  await labelsPage.createNewLabel(labelName2);
  await labelsPage.labelVerification(labelName2);
  await labelsPage.cancelBulkDeletionLabelFromWidget();
});

});