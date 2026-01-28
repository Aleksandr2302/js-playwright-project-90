import { test } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import UsersPage from '../../pages/usersPage';
import TaskPage from '../../pages/tasksPage';
import {loginData, statusesArr, labelsArr, taskIdStatus, generateRandomStatusOrLabelfromArr, generateRandomStatusId, generateRandomEmail, generateRandomName, generateRandomLastName, generateRandomTitle, generateRandomContent} from '../../fixtures/tasks';


let taskPage;
let usersPage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(loginData.username, loginData.password);

  taskPage = new TaskPage(page);
  usersPage = new UsersPage(page);
  await taskPage.gotoTaskWidget();
})

test.describe('tasks creating and validation', () => {

test('new task creating only with mandatory fields (Assignee,Title,Status)and verification', async () => {
  // Data for user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  const titleName1 = generateRandomTitle();
  //const contentName1 = generateRandomContent();
  const statusName1 = generateRandomStatusOrLabelfromArr(statusesArr);


  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);

  await taskPage.createNewTasks(userEmail1, titleName1,statusName1);
  await taskPage.newTasksVerification(userEmail1,titleName1 ,statusName1);
  
});

test('new task creating with mandatory and optional fields (Assignee,Title,Status,Content,Labels) and verification', async () => {
  // Data for user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  const titleName1 = generateRandomTitle();
  const contentName1 = generateRandomContent();

  const statusName1 = generateRandomStatusOrLabelfromArr(statusesArr);
  const labelName1 = generateRandomStatusOrLabelfromArr(labelsArr);

  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);

  await taskPage.createNewTasks(userEmail1, titleName1,statusName1,labelName1,contentName1);
  await taskPage.newTasksVerification(userEmail1,titleName1 ,statusName1,labelName1,contentName1);
  
});

test('Error validation while creating task without Assignee filed', async () => {
  // Data for user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  const titleName1 = generateRandomTitle();
  const contentName1 = generateRandomContent();

  const statusName1 = generateRandomStatusOrLabelfromArr(statusesArr);
  const labelName1 = generateRandomStatusOrLabelfromArr(labelsArr);

  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);

  await taskPage.createNewTasks(userEmail1, titleName1,statusName1,labelName1,contentName1);
  await taskPage.createNewTaskWithoutMandatoryField(userEmail1);
  
});
});

test.describe('default tasks widget validation', () => {

test('tasks widget validation', async () => {

  await taskPage.tasksWidgetVerification();
});

});

test.describe('task creating and parameter updating', () => {

test('task creating and moving to new status manually', async () => {

  // Data for user 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  const titleName1 = generateRandomTitle();
  const contentName1 = generateRandomContent();

  const statusName1 = generateRandomStatusOrLabelfromArr(statusesArr);
  const labelName1 = generateRandomStatusOrLabelfromArr(labelsArr);
  const newTaskId = generateRandomStatusId(taskIdStatus,statusName1 );
  const newStatusName = taskIdStatus[newTaskId];

  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);

  await taskPage.createNewTasks(userEmail1, titleName1,statusName1,labelName1,contentName1);
  await taskPage.moveTaskManually(userEmail1,titleName1 ,statusName1,labelName1,contentName1,newTaskId,newStatusName);


});

test('task creating and update "Assignee, Title, Content, Status and Label" ', async () => {

  // Data for user 1 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  const titleName1 = generateRandomTitle();
  const contentName1 = generateRandomContent();

  const statusName1 = generateRandomStatusOrLabelfromArr(statusesArr);
  const labelName1 = generateRandomStatusOrLabelfromArr(labelsArr);
  //const newTaskId = generateRandomStatusId(taskIdStatus,statusName1 );
  // const newStatusName = taskIdStatus[newTaskId];

  // Data for user 2
  const userEmail2 = generateRandomEmail();
  const userName2 = generateRandomName();
  const userLastName2 = generateRandomLastName();

  const titleName2 = generateRandomTitle();
  const contentName2 = generateRandomContent();

  const statusName2 = generateRandomStatusOrLabelfromArr(statusesArr);
  const labelName2 = generateRandomStatusOrLabelfromArr(labelsArr);

  // Create user#1 + task 
  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  // Create 
  await taskPage.createNewTasks(userEmail1, titleName1,statusName1,labelName1,contentName1);

  // Create user#2
  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail2, userName2, userLastName2);

  await taskPage.updateTaskInformation(userEmail1,titleName1, statusName1,labelName1, userEmail2,titleName2, statusName2, labelName2,contentName2);

  await taskPage.newTasksVerification(userEmail2, titleName2, statusName2, labelName2, contentName2);


});


test('Verification "show" task button ', async () => {

  // Data for user 1 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  const titleName1 = generateRandomTitle();
  const contentName1 = generateRandomContent();

  const statusName1 = generateRandomStatusOrLabelfromArr(statusesArr);
  const labelName1 = generateRandomStatusOrLabelfromArr(labelsArr);
  // const newTaskId = generateRandomStatusId(taskIdStatus,statusName1 );
  
  // Create user#1 + task 
  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  // Create 
  await taskPage.createNewTasks(userEmail1, titleName1,statusName1,labelName1,contentName1);

  
  await taskPage.verifyShowButtonAndWindow(userEmail1,titleName1, statusName1, labelName1, contentName1);


});

});

test.describe('delete tasks ', () => {

test('delete 1 task from show task window', async () => {

  // Data for user 1 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  const titleName1 = generateRandomTitle();
  const contentName1 = generateRandomContent();

  const statusName1 = generateRandomStatusOrLabelfromArr(statusesArr);
  const labelName1 = generateRandomStatusOrLabelfromArr(labelsArr);
  // const newTaskId = generateRandomStatusId(taskIdStatus,statusName1 );
  
  // Create user#1 + task 
  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  // Create 
  await taskPage.createNewTasks(userEmail1, titleName1,statusName1,labelName1,contentName1);

  
  await taskPage.deleteTaskFromShowWindow(userEmail1,titleName1, statusName1, labelName1, contentName1);

  await taskPage.tasksDeletedVerification(userEmail1,titleName1, statusName1, labelName1, contentName1);

});

test('cancel deletion while task delete show task window', async () => {

  // Data for user 1 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  const titleName1 = generateRandomTitle();
  const contentName1 = generateRandomContent();

  const statusName1 = generateRandomStatusOrLabelfromArr(statusesArr);
  const labelName1 = generateRandomStatusOrLabelfromArr(labelsArr);
  // const newTaskId = generateRandomStatusId(taskIdStatus,statusName1 );
  
  // Create user#1 + task 
  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  // Create 
  await taskPage.createNewTasks(userEmail1, titleName1,statusName1,labelName1,contentName1);

  
  await taskPage.cancelDeletionTaskFromShowWindow(userEmail1,titleName1, statusName1, labelName1, contentName1);

  await taskPage.newTasksVerification(userEmail1,titleName1, statusName1, labelName1, contentName1);

});
});

test.describe('filter tasks ', () => {

test('remove all filters verification', async () => {

 // Data for user 1 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  const titleName1 = generateRandomTitle();
  const contentName1 = generateRandomContent();

  const statusName1 = generateRandomStatusOrLabelfromArr(statusesArr);
  const labelName1 = generateRandomStatusOrLabelfromArr(labelsArr);
  // const newTaskId = generateRandomStatusId(taskIdStatus,statusName1 );
  // const newStatusName = taskIdStatus[newTaskId];

  // Data for user 2
  const userEmail2 = generateRandomEmail();
  const userName2 = generateRandomName();
  const userLastName2 = generateRandomLastName();

  const titleName2 = generateRandomTitle();
  const contentName2 = generateRandomContent();

  const statusName2 = generateRandomStatusOrLabelfromArr(statusesArr);
  const labelName2 = generateRandomStatusOrLabelfromArr(labelsArr);

  // Create user#1
  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  // Create task #1 for user #1 
  await taskPage.createNewTasks(userEmail1, titleName1,statusName1,labelName1,contentName1);

  // Create user#2
  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail2, userName2, userLastName2);

  // Create task #1 for user #2 
  await taskPage.createNewTasks(userEmail2, titleName2,statusName2,labelName2,contentName2);

  // Remove all filters

  await taskPage.removeAllFilterTasks(userEmail1, titleName1, titleName2);


});


test('create custom filter', async () => {

 // Data for user 1 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  const titleName1 = generateRandomTitle();
  const contentName1 = generateRandomContent();

  const statusName1 = generateRandomStatusOrLabelfromArr(statusesArr);
  const labelName1 = generateRandomStatusOrLabelfromArr(labelsArr);
  // const newTaskId = generateRandomStatusId(taskIdStatus,statusName1 );
  // const newStatusName = taskIdStatus[newTaskId];


  // Create user#1
  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  // Create task #1 for user #1 
  await taskPage.createNewTasks(userEmail1, titleName1,statusName1,labelName1,contentName1);


  // Create custom filter

  await taskPage.createCustomFilterTasks(userEmail1, statusName1, labelName1);

});


});


test.describe('verification of export file', () => {

test('export tasks file', async () => {

  // Data for user 1 
  const userEmail1 = generateRandomEmail();
  const userName1 = generateRandomName();
  const userLastName1 = generateRandomLastName();

  const titleName1 = generateRandomTitle();
  const contentName1 = generateRandomContent();

  const statusName1 = generateRandomStatusOrLabelfromArr(statusesArr);
  const labelName1 = generateRandomStatusOrLabelfromArr(labelsArr);
  // const newTaskId = generateRandomStatusId(taskIdStatus,statusName1 );
  // const newStatusName = taskIdStatus[newTaskId];


  // Create user#1
  await usersPage.gotoUserWidget();
  await usersPage.crateNewUser(userEmail1, userName1, userLastName1);
  // Create task #1 for user #1 
  await taskPage.createNewTasks(userEmail1, titleName1,statusName1,labelName1,contentName1);

  await taskPage.downloadCvsTasksFile();
});

});
