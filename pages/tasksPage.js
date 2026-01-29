import { expect } from "@playwright/test";

export default class TaskPage {
  constructor(page) {
    this.page = page;
    this.taskStatusesWidget = page.getByRole("menuitem", { name: "Tasks" });

    this.taskAssigneeSelect = page.getByRole("combobox", { name: "Assignee" });
    this.taskTitleInput = page.getByRole("textbox", { name: "Title" });
    this.taskContentInput = this.page.locator('[name="content"]');
    this.taskStatusSelect = page.getByRole("combobox", { name: "Status" });
    this.taskLabelSelect = page.getByRole("combobox", { name: "Label" });
    this.queryNameInput = page.getByRole("textbox", { name: "Query name" });

    this.saveButton = page.getByRole("button", { name: "Save" });
    this.editButton = page.getByRole("link", { name: "Edit" });
    this.showButton = page.getByRole("link", { name: "Show" });
    this.deleteButton = page.getByRole("button", { name: "Delete" });
    this.createNewTaskButton = page.getByRole("link", { name: "Create" });
    this.warningMessage = page.locator(".MuiSnackbarContent-message");
    this.errorElement = this.page.locator(
      ".Mui-error.MuiFormHelperText-contained",
    );
    this.cancelDeleteButton = page.getByRole("button", { name: "Undo" });
    this.removeAllFilter = page.getByText("Remove all filters");
    this.saveQueryButton = page.getByRole("button", { name: "Save" });

    this.addFilterButton = page.getByRole("button", { name: "Add filter" });
    this.saveCurrentQueryButton = page.getByText("Save current query");
    this.exportButton = page.getByRole("button", { name: "Export" });

    this.draftHeader = page.getByRole("heading", { name: "Draft", level: "6" });
    this.toReviewHeader = page.getByRole("heading", {
      name: "To Review",
      level: "6",
    });
    this.toBeFixedHeader = page.getByRole("heading", {
      name: "To Be Fixed",
      level: "6",
    });
    this.toPublishHeader = page.getByRole("heading", {
      name: "To Publish",
      level: "6",
    });
    this.publishedHeader = page.getByRole("heading", {
      name: "Published",
      level: "6",
    });
  }

  async gotoTaskWidget() {
    await this.taskStatusesWidget.click();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Create new task
  async createNewTasks(
    assigneeName,
    title,
    statusName,
    labelName = null,
    content = null,
  ) {
    await this.gotoTaskWidget();
    await this.createNewTaskButton.click();

    await expect(this.taskAssigneeSelect).toBeVisible();

    await this.taskAssigneeSelect.click();
    await this.page.getByRole("option", { name: assigneeName }).click();

    await expect(this.taskTitleInput).toBeVisible();
    await this.taskTitleInput.click();
    await this.taskTitleInput.fill(title);

    await this.taskStatusSelect.click();
    await this.page.getByRole("option", { name: statusName }).click();

    if (labelName !== null) {
      await this.taskLabelSelect.click();
      await this.page.getByRole("option", { name: labelName }).click();
      await this.page.keyboard.press("Escape");
    }

    if (content !== null) {
      await this.taskContentInput.fill(content);
    }

    await this.saveButton.click();
    await expect(this.warningMessage).toHaveText("Element created");
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Create new task without mandatory field
  async createNewTaskWithoutMandatoryField(assigneeName) {
    await this.gotoTaskWidget();
    await this.createNewTaskButton.click();

    await expect(this.taskAssigneeSelect).toBeVisible();

    await this.taskAssigneeSelect.click();

    await this.page.getByRole("option", { name: assigneeName }).click();

    await expect(this.taskTitleInput).toBeVisible();
    await this.saveButton.click();
    await expect(this.warningMessage).toHaveText(
      "The form is not valid. Please check for errors",
    );
    //const count = await this.errorElement.count();
    await expect(this.errorElement).toHaveText(["Required", "Required"]);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Verify new task
  async newTasksVerification(
    assigneeName,
    title,
    statusName,
    labelName = null,
    content = null,
  ) {
    await this.gotoTaskWidget();

    // Filter on Assignee
    await this.taskAssigneeSelect.click();
    await this.page.getByRole("option", { name: assigneeName }).click();

    // Filter on status
    await this.taskStatusSelect.click();
    await this.page.getByRole("option", { name: statusName }).click();

    // Filter on label, if it's possible
    if (labelName !== null) {
      await this.taskLabelSelect.click();
      await this.page.getByRole("option", { name: labelName }).click();
    }

    // Create array for finding
    const textsToMatch = [title];
    if (content) textsToMatch.push(content);

    // Find task
    let taskLocator = this.page.locator("[data-rfd-draggable-id]");
    for (const text of textsToMatch) {
      taskLocator = taskLocator.filter({ hasText: text });
    }

    // Verify that the task is available
    await expect(taskLocator).toBeVisible();

    await expect(this.editButton).toBeVisible();
    await expect(this.showButton).toBeVisible();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Verify task was deleted
  async tasksDeletedVerification(
    assigneeName,
    title,
    statusName,
    labelName = null,
    content = null,
  ) {
    await this.gotoTaskWidget();

    // Filter on Assignee
    await this.taskAssigneeSelect.click();
    await this.page.getByRole("option", { name: assigneeName }).click();

    // Filter on status
    await this.taskStatusSelect.click();
    await this.page.getByRole("option", { name: statusName }).click();

    // Filter on label, if it's possible
    if (labelName !== null) {
      await this.taskLabelSelect.click();
      await this.page.getByRole("option", { name: labelName }).click();
    }

    // Create array for finding
    const textsToMatch = [title];
    if (content) textsToMatch.push(content);

    // Find task
    let taskLocator = this.page.locator("[data-rfd-draggable-id]");
    for (const text of textsToMatch) {
      taskLocator = taskLocator.filter({ hasText: text });
    }

    // Verify that the task is available
    await expect(taskLocator).not.toBeVisible();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  async tasksWidgetVerification() {
    await this.gotoTaskWidget();

    // Verify task select buttons
    await expect(this.taskAssigneeSelect).toBeVisible();
    await expect(this.taskStatusSelect).toBeVisible();
    await expect(this.taskLabelSelect).toBeVisible();

    // Verify task buttons
    await expect(this.createNewTaskButton).toBeVisible();
    await expect(this.exportButton).toBeVisible();

    // Verify headers
    await expect(this.draftHeader).toBeVisible();
    await expect(this.toReviewHeader).toBeVisible();
    await expect(this.toBeFixedHeader).toBeVisible();
    await expect(this.toPublishHeader).toBeVisible();
    await expect(this.publishedHeader).toBeVisible();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  async moveTaskManually(
    assigneeName,
    titleName,
    statusName,
    labelName = null,
    content = null,
    newTaskId,
    newStatusName,
  ) {
    await this.gotoTaskWidget();

    // Filter on Assignee
    await this.taskAssigneeSelect.click();
    await this.page.getByRole("option", { name: assigneeName }).click();

    // Filter on status
    await this.taskStatusSelect.click();
    await this.page.getByRole("option", { name: statusName }).click();

    // Filter on label(if it's presented)
    if (labelName !== null) {
      await this.taskLabelSelect.click();
      await this.page.getByRole("option", { name: labelName }).click();
    }

    // Create text array for finding
    const textsToMatch = [titleName];
    if (content) textsToMatch.push(content);

    // Container
    const taskCard = this.page.locator(".MuiCard-root", {
      hasText: titleName,
    });

    await expect(taskCard).toBeVisible();

    // draggable / drag handle (parent)
    const dragHandle = taskCard.locator(
      "xpath=ancestor::*[@data-rfd-drag-handle-draggable-id]",
    );

    await expect(dragHandle).toBeVisible();

    // target column
    const targetColumn = this.page.locator(
      `[data-rfd-droppable-id="${newTaskId}"]`,
    );

    await expect(targetColumn).toBeVisible();

    // scroll drag handle in viewport and focus
    await dragHandle.scrollIntoViewIfNeeded();
    await dragHandle.focus();

    // drag handle и target
    const sourceBox = await dragHandle.boundingBox();
    const targetBox = await targetColumn.boundingBox();

    if (!sourceBox || !targetBox) {
      throw new Error("BoundingBox not found");
    }

    // 1. focus mouse на drag handle
    await this.page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2,
    );

    // 2. Take task
    await this.page.mouse.down();

    // 3. Wait
    await this.page.waitForTimeout(300);

    // 4. Move courser to target column
    await this.page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + 30, // move up
      { steps: 40 },
    );

    // 5. Drop
    await this.page.mouse.up();

    // Update the status in filter
    await this.taskStatusSelect.click();
    await this.page.getByRole("option", { name: newStatusName }).click();

    // 6. Verify that task is presented
    await expect(
      targetColumn.locator(".MuiCard-root", { hasText: titleName }),
    ).toBeVisible();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  async updateTaskInformation(
    assigneeNameOld,
    titleNameOld,
    statusNameOld,
    labelNameOld = null,
    assigneeNameNew,
    titleNameNew,
    statusNameNew,
    labelNameNew = null,
    contentNew,
  ) {
    await this.gotoTaskWidget();

    // Filter on Assignee
    await this.taskAssigneeSelect.click();
    await this.page.getByRole("option", { name: assigneeNameOld }).click();

    // Filter on status
    await this.taskStatusSelect.click();
    await this.page.getByRole("option", { name: statusNameOld }).click();

    // Filter on label(if it's presented)
    if (labelNameOld !== null) {
      await this.taskLabelSelect.click();
      await this.page.getByRole("option", { name: labelNameOld }).click();
    }

    // Container
    const taskCard = this.page.locator(".MuiCard-root", {
      hasText: titleNameOld,
    });

    await expect(taskCard).toBeVisible();

    // Edit task
    await this.editButton.click();
    await expect(this.taskAssigneeSelect).toBeVisible();

    // Change Assignee
    await this.taskAssigneeSelect.click();
    await this.page.getByRole("option", { name: assigneeNameNew }).click();

    await expect(this.taskTitleInput).toBeVisible();
    await this.taskTitleInput.click();
    await this.taskTitleInput.fill(titleNameNew);

    // Change Task status
    await this.taskStatusSelect.click();
    await this.page.getByRole("option", { name: statusNameNew }).click();

    // Change Label

    if (labelNameNew !== null) {
      await this.taskLabelSelect.click();
      await this.page.getByRole("option", { name: labelNameNew }).click();
      await this.page.keyboard.press("Escape");
    }

    // Change Content
    if (contentNew !== null) {
      await this.taskContentInput.fill(contentNew);
    }
    await this.saveButton.click();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  async verifyShowButtonAndWindow(
    assigneeName,
    titleName,
    statusName,
    labelName = null,
    content = null,
  ) {
    await this.gotoTaskWidget();

    // Filter on Assignee
    await this.taskAssigneeSelect.click();
    await this.page.getByRole("option", { name: assigneeName }).click();

    // Filter on status
    await this.taskStatusSelect.click();
    await this.page.getByRole("option", { name: statusName }).click();

    // Filter on label(if it's presented)
    if (labelName !== null) {
      await this.taskLabelSelect.click();
      await this.page.getByRole("option", { name: labelName }).click();
    }

    // Container
    const taskCard = this.page.locator(".MuiCard-root", {
      hasText: titleName,
    });

    await expect(taskCard).toBeVisible();

    await this.showButton.click();

    // Verify show window
    await expect(
      this.page.getByRole("link", { name: `${assigneeName}` }),
    ).toBeVisible();
    await expect(
      this.page.getByText(`${titleName}`, { exact: true }),
    ).toBeVisible();
    if (content != null) {
      await expect(this.page.getByText(`${content}`)).toBeVisible();
    }

    if (labelName != null) {
      await expect(
        this.page.getByText(`${labelName}`, { exact: true }),
      ).toBeVisible();
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  async deleteTaskFromShowWindow(
    assigneeName,
    titleName,
    statusName,
    labelName = null,
  ) {
    await this.gotoTaskWidget();

    // Filter on Assignee
    await this.taskAssigneeSelect.click();
    await this.page.getByRole("option", { name: assigneeName }).click();

    // Filter on status
    await this.taskStatusSelect.click();
    await this.page.getByRole("option", { name: statusName }).click();

    // Filter on label(if it's presented)
    if (labelName !== null) {
      await this.taskLabelSelect.click();
      await this.page.getByRole("option", { name: labelName }).click();
    }

    // Container
    const taskCard = this.page.locator(".MuiCard-root", {
      hasText: titleName,
    });

    await expect(taskCard).toBeVisible();

    await this.showButton.click();

    // Delete task from show window
    await expect(
      this.page.getByRole("link", { name: `${assigneeName}` }),
    ).toBeVisible();
    await this.deleteButton.click();

    await expect(this.warningMessage).toHaveText("Element deleted");
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  async cancelDeletionTaskFromShowWindow(
    assigneeName,
    titleName,
    statusName,
    labelName = null,
  ) {
    await this.gotoTaskWidget();

    // Filter on Assignee
    await this.taskAssigneeSelect.click();
    await this.page.getByRole("option", { name: assigneeName }).click();

    // Filter on status
    await this.taskStatusSelect.click();
    await this.page.getByRole("option", { name: statusName }).click();

    // Filter on label(if it's presented)
    if (labelName !== null) {
      await this.taskLabelSelect.click();
      await this.page.getByRole("option", { name: labelName }).click();
    }

    // Container
    const taskCard = this.page.locator(".MuiCard-root", {
      hasText: titleName,
    });

    await expect(taskCard).toBeVisible();

    await this.showButton.click();

    // Delete task from show window
    await expect(
      this.page.getByRole("link", { name: `${assigneeName}` }),
    ).toBeVisible();
    await this.deleteButton.click();
    await this.cancelDeleteButton.click();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  async removeAllFilterTasks(assigneeName, titleName1, titleName2) {
    await this.gotoTaskWidget();

    // Filter on Assignee
    await this.taskAssigneeSelect.click();
    await this.page.getByRole("option", { name: assigneeName }).click();

    await this.addFilterButton.click();
    await this.removeAllFilter.click();

    await expect(
      this.page.getByText(titleName1, { exact: true }),
    ).toBeVisible();

    await expect(
      this.page.getByText(titleName2, { exact: true }),
    ).toBeVisible();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  async createCustomFilterTasks(assigneeName, statusName, labelName) {
    await this.gotoTaskWidget();

    // Filter on Assignee
    await this.taskAssigneeSelect.click();
    await this.page.getByRole("option", { name: assigneeName }).click();

    // Filter on status
    await this.taskStatusSelect.click();
    await this.page.getByRole("option", { name: statusName }).click();

    // Filter on label
    if (labelName !== null) {
      await this.taskLabelSelect.click();
      await this.page.getByRole("option", { name: labelName }).click();
    }

    await this.addFilterButton.click();
    await this.saveCurrentQueryButton.click();
    await this.queryNameInput.fill(assigneeName);
    await this.saveQueryButton.click();
    await this.addFilterButton.click();

    await expect(
      this.page.getByText(`Remove query "${assigneeName}"`, { exact: true }),
    ).toBeVisible();
  }

  async downloadCvsTasksFile() {
    await this.gotoTaskWidget();

    const downloadPromise = this.page.waitForEvent("download");

    await this.exportButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain("tasks");

    const savePath = "fixtures/csvFiles/" + download.suggestedFilename();
    await download.saveAs(savePath);
  }
}
