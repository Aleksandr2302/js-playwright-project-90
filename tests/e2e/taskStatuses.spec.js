import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import TaskStatusesPage from '../../pages/taskStatusesPage';

const loginData = {
  username: 'username',
  password: 'password',
};

function generateRandomTaskStatusesName() {
  const random = Math.floor(Math.random() * 1000);
  return `RandomTaskStatusesName${random}`;
}

function generateRandomSlug(base = 'SlugName') {
  const random = Math.floor(Math.random() * 1000);
  return `${base}${random}`;
}

let taskStatusesPage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(loginData.username, loginData.password);

  taskStatusesPage = new TaskStatusesPage(page);
  await taskStatusesPage.gotoTaskStatusesWidget();
})

test.describe('task statuses creating and validation', () => {

test('new task statuses form creating verification', async ({ page }) => {
  
  await taskStatusesPage.gotoTaskStatusesWidget();
  await taskStatusesPage.createNewTaskStatusesButton.click();
  await expect(taskStatusesPage.taskStatusesNameInput).toBeVisible();
  await expect(taskStatusesPage.taskSlugNameInput).toBeVisible();
  await expect(taskStatusesPage.saveButton).toBeDisabled();
  
});

test('1 new task statuses creating', async ({ page }) => {

  const taskStatusesName = generateRandomTaskStatusesName();
  const taskStatusesSlug = generateRandomSlug();

  await taskStatusesPage.createNewTasksStatuses(taskStatusesName, taskStatusesSlug );

  await taskStatusesPage.taskStatusesVerification(taskStatusesName, taskStatusesSlug);
  
});

test('2 new task statuses creating', async ({ page }) => {
  const taskStatusesName1 = generateRandomTaskStatusesName();
  const taskStatusesSlug1 = generateRandomSlug();

  const taskStatusesName2 = generateRandomTaskStatusesName();
  const taskStatusesSlug2 = generateRandomSlug();

  await taskStatusesPage.createNewTasksStatuses(taskStatusesName1, taskStatusesSlug1 );
  await taskStatusesPage.gotoTaskStatusesWidget();

  await taskStatusesPage.createNewTasksStatuses(taskStatusesName2, taskStatusesSlug2 );

  await taskStatusesPage.taskStatusesVerification(taskStatusesName1, taskStatusesSlug1);
  await taskStatusesPage.taskStatusesVerification(taskStatusesName2, taskStatusesSlug2);
  
});

test('task statuses information validation on the user widget', async ({ page }) => {
  await   taskStatusesPage.allTaskStatusesVerificationOnTheWidget();
});

});

test.describe('update task statuses', () => {
  test('update task statuses', async ({ page }) => {

  const taskStatusesName1 = generateRandomTaskStatusesName();
  const taskStatusesSlug1 = generateRandomSlug();

  const taskStatusesName2 = generateRandomTaskStatusesName();
  const taskStatusesSlug2 = generateRandomSlug();

  await taskStatusesPage.createNewTasksStatuses(taskStatusesName1, taskStatusesSlug1 );

  await taskStatusesPage.updateTaskStatusesOnTheWidget(taskStatusesName1, taskStatusesName2, taskStatusesSlug2)
  
});

});

test.describe('delete task statuses', () => {
  test('delete 1 task statuses from the Task Statuses Widget', async ({ page }) => {

  const taskStatusesName1 = generateRandomTaskStatusesName();
  const taskStatusesSlug1 = generateRandomSlug();


  await taskStatusesPage.createNewTasksStatuses(taskStatusesName1, taskStatusesSlug1 );

  await taskStatusesPage.deleteOneTaskStatusesOnTheWidget(taskStatusesName1, taskStatusesSlug1)
  
});

  test('delete 1 task statuses from the Task Statuses Form', async ({ page }) => {

  const taskStatusesName1 = generateRandomTaskStatusesName();
  const taskStatusesSlug1 = generateRandomSlug();


  await taskStatusesPage.createNewTasksStatuses(taskStatusesName1, taskStatusesSlug1 );

  await taskStatusesPage.deleteOneTaskStatusesOnTheWidget(taskStatusesName1, taskStatusesSlug1)
  
});

  test('delete bulk task statuses from the Task Statuses Widget', async ({ page }) => {

  const taskStatusesName1 = generateRandomTaskStatusesName();
  const taskStatusesSlug1 = generateRandomSlug();

  const taskStatusesName2 = generateRandomTaskStatusesName();
  const taskStatusesSlug2 = generateRandomSlug();

  await taskStatusesPage.createNewTasksStatuses(taskStatusesName1, taskStatusesSlug1 );
  await taskStatusesPage.gotoTaskStatusesWidget();

  await taskStatusesPage.createNewTasksStatuses(taskStatusesName2, taskStatusesSlug2 );

  await taskStatusesPage.deleteBulkTaskStatusesOnWidget();
  
});


test('cancel deletion task statuses from the Task Statuses Widget', async ({ page }) => {

  const taskStatusesName1 = generateRandomTaskStatusesName();
  const taskStatusesSlug1 = generateRandomSlug();

  await taskStatusesPage.createNewTasksStatuses(taskStatusesName1, taskStatusesSlug1 );
  await taskStatusesPage.gotoTaskStatusesWidget();

  await taskStatusesPage.cancelDeleteTaskStatusesOnWidget(taskStatusesName1,taskStatusesSlug1 );
  
});


});
