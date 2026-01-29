import { test, expect } from "@playwright/test";
import LoginPage from "../../pages/loginPage";
import TaskStatusesPage from "../../pages/taskStatusesPage";
import { loginData } from "../../fixtures/tasks";
import { generateRandomTaskAndSlugName } from "../../fixtures/taskStatuses";

let taskStatusesPage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(loginData.username, loginData.password);

  taskStatusesPage = new TaskStatusesPage(page);
  await taskStatusesPage.gotoTaskStatusesWidget();
});

test.describe("task statuses creating and validation", () => {
  test("new task statuses form creating verification", async () => {
    await taskStatusesPage.gotoTaskStatusesWidget();
    await taskStatusesPage.createNewTaskStatusesButton.click();
    await expect(taskStatusesPage.taskStatusesNameInput).toBeVisible();
    await expect(taskStatusesPage.taskSlugNameInput).toBeVisible();
    await expect(taskStatusesPage.saveButton).toBeDisabled();
  });

  test("1 new task statuses creating", async () => {
    const taskStatuses1 = generateRandomTaskAndSlugName();

    await taskStatusesPage.createNewTasksStatuses(
      taskStatuses1.taskName,
      taskStatuses1.slugName,
    );

    await taskStatusesPage.taskStatusesVerification(
      taskStatuses1.taskName,
      taskStatuses1.slugName,
    );
  });

  test("2 new task statuses creating", async () => {
    const taskStatuses1 = generateRandomTaskAndSlugName();

    const taskStatuses2 = generateRandomTaskAndSlugName();

    await taskStatusesPage.createNewTasksStatuses(
      taskStatuses1.taskName,
      taskStatuses1.slugName,
    );
    await taskStatusesPage.gotoTaskStatusesWidget();

    await taskStatusesPage.createNewTasksStatuses(
      taskStatuses2.taskName,
      taskStatuses2.slugName,
    );

    await taskStatusesPage.taskStatusesVerification(
      taskStatuses1.taskName,
      taskStatuses1.slugName,
    );
    await taskStatusesPage.taskStatusesVerification(
      taskStatuses2.taskName,
      taskStatuses2.slugName,
    );
  });

  test("task statuses information validation on the user widget", async () => {
    await taskStatusesPage.allTaskStatusesVerificationOnTheWidget();
  });
});

test.describe("update task statuses", () => {
  test("update task statuses", async () => {
    const taskStatuses1 = generateRandomTaskAndSlugName();

    const taskStatuses2 = generateRandomTaskAndSlugName();

    await taskStatusesPage.createNewTasksStatuses(
      taskStatuses1.taskName,
      taskStatuses1.slugName,
    );

    await taskStatusesPage.updateTaskStatusesOnTheWidget(
      taskStatuses1.taskName,
      taskStatuses2.taskName,
      taskStatuses2.slugName,
    );
  });
});

test.describe("delete task statuses", () => {
  test("delete 1 task statuses from the Task Statuses Widget", async () => {
    const taskStatuses1 = generateRandomTaskAndSlugName();

    await taskStatusesPage.createNewTasksStatuses(
      taskStatuses1.taskName,
      taskStatuses1.slugName,
    );

    await taskStatusesPage.deleteOneTaskStatusesOnTheWidget(
      taskStatuses1.taskName,
      taskStatuses1.slugName,
    );
  });

  test("delete 1 task statuses from the Task Statuses Form", async () => {
    const taskStatuses1 = generateRandomTaskAndSlugName();

    await taskStatusesPage.createNewTasksStatuses(
      taskStatuses1.taskName,
      taskStatuses1.slugName,
    );

    await taskStatusesPage.deleteOneTaskStatusesOnTheWidget(
      taskStatuses1.taskName,
      taskStatuses1.slugName,
    );
  });

  test("delete bulk task statuses from the Task Statuses Widget", async () => {
    const taskStatuses1 = generateRandomTaskAndSlugName();

    const taskStatuses2 = generateRandomTaskAndSlugName();

    await taskStatusesPage.createNewTasksStatuses(
      taskStatuses1.taskName,
      taskStatuses1.slugName,
    );
    await taskStatusesPage.gotoTaskStatusesWidget();

    await taskStatusesPage.createNewTasksStatuses(
      taskStatuses2.taskName,
      taskStatuses2.slugName,
    );

    await taskStatusesPage.deleteBulkTaskStatusesOnWidget();
  });

  test("cancel deletion task statuses from the Task Statuses Widget", async () => {
    const taskStatuses1 = generateRandomTaskAndSlugName();

    await taskStatusesPage.createNewTasksStatuses(
      taskStatuses1.taskName,
      taskStatuses1.slugName,
    );
    await taskStatusesPage.gotoTaskStatusesWidget();

    await taskStatusesPage.cancelDeleteTaskStatusesOnWidget(
      taskStatuses1.taskName,
      taskStatuses1.slugName,
    );
  });
});
