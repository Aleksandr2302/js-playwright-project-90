import { expect } from '@playwright/test';

export default class TaskStatusesPage{
  constructor(page){
    this.page = page;
    this.taskStatusesWidget = page.getByRole('menuitem', { name: 'Task statuses' });

    this.taskStatusesNameInput = page.getByRole('textbox', { name: 'Name' });
    this.taskSlugNameInput = page.getByRole('textbox', { name: 'Slug' });
    this.saveButton = page.getByRole('button', {name:'Save'});
    this.deleteButton = page.getByRole('button', {name:'Delete'});
    this.createNewTaskStatusesButton = page.getByRole('link', {name: 'Create'});
    this.warningMessage = page.locator('.MuiSnackbarContent-message');

  }

  async gotoTaskStatusesWidget(){
    await this.taskStatusesWidget.click();
  };

  async openWholeTaskStatusesList(){
  // открыть селект "Rows per page"
await this.page.locator('.MuiTablePagination-select').click();

// выбрать 50
await this.page.getByRole('option', { name: '50' }).click();
};


  async createNewTasksStatuses(name, slug){
    await this.createNewTaskStatusesButton.click();
    await this.taskStatusesNameInput.fill(name);
    await this.taskSlugNameInput.fill(slug);
    await this.saveButton.click();

    const snackbar = this.page.locator('.MuiSnackbarContent-message');
    await expect(snackbar).toHaveText('Element created');
  };

  async taskStatusesVerification(taskStatusesName, taskSlugName){
    await this.gotoTaskStatusesWidget();
    await this.openWholeTaskStatusesList();
    const taskStatusesNameValue = this.page.locator('table tbody tr td:nth-child(3)').filter({ hasText: taskStatusesName });
    const taskStatusesSlugValue = this.page.locator('table tbody tr td:nth-child(4)').filter({ hasText: taskSlugName });
    await expect(taskStatusesNameValue).toHaveCount(1);
    await expect(taskStatusesSlugValue).toHaveCount(1);
  };

    async taskStatusesVerificationAfterDeletion(taskStatusesName, taskSlugName){
    await this.gotoTaskStatusesWidget();
    await this.openWholeTaskStatusesList();
    
    await expect(this.page.locator('table tbody tr td:nth-child(3)').filter({ hasText: taskStatusesName })).toHaveCount(0);
    await expect(this.page.locator('table tbody tr td:nth-child(4)').filter({ hasText: taskSlugName })).toHaveCount(0);
  };


async allTaskStatusesVerificationOnTheWidget(){
  await this.gotoTaskStatusesWidget();
  await this.openWholeTaskStatusesList();

const rows = await this.page.locator('table tbody tr');
const rowCount = await rows.count();

for (let i = 0; i < rowCount; i++) {
  const row = rows.nth(i);

  const id = await row.locator('.column-id').textContent();
  const name = await row.locator('.column-name').textContent();
  const slug = await row.locator('.column-slug').textContent();
  const createdAt = await row.locator('.column-createdAt').textContent();

  // Проверка, что все поля заполнены
  expect(id).toBeTruthy();
  expect(name).toBeTruthy();
  expect(slug).toBeTruthy();
  expect(createdAt).toBeTruthy();
}
    
  };

  async updateTaskStatusesOnTheWidget(taskStatusesOldName,taskStatusesNewName, taskStatusesSlug ){
    await this.gotoTaskStatusesWidget();
    await this.openWholeTaskStatusesList();
    await this.page.getByRole('cell', { name: taskStatusesOldName }).click();

    await this.taskStatusesNameInput.fill('');
    await this.taskSlugNameInput.fill('');

    await this.taskStatusesNameInput.fill(taskStatusesNewName);
    await this.taskSlugNameInput.fill(taskStatusesSlug);

    await this.saveButton.click();

    await this.taskStatusesVerification(taskStatusesNewName,taskStatusesSlug )

  };


  async deleteOneTaskStatusesOnTheWidget(taskStatusesName,taskStatusesSlug){
    await this.gotoTaskStatusesWidget();
    await this.openWholeTaskStatusesList();

    const row = this.page.locator('tr', {
  has: this.page.locator('td.column-name', { hasText: taskStatusesName }),
});
  await row.getByRole('checkbox').check();
  await this.deleteButton.click();

  await expect(this.warningMessage).toHaveText('Element deleted');
  await this.taskStatusesVerificationAfterDeletion(taskStatusesName,taskStatusesSlug );

  };


    async deleteOneTaskStatusesOnForm(taskStatusesName,taskStatusesSlug){
    await this.gotoTaskStatusesWidget();
    await this.page.getByRole('cell', { name: taskStatusesName }).click();

  await this.deleteButton.click();
  await expect(this.warningMessage).toHaveText('Element deleted');
  await this.taskStatusesVerificationAfterDeletion(taskStatusesName,taskStatusesSlug );
  };


 async deleteBulkTaskStatusesOnWidget(){
 await this.gotoTaskStatusesWidget();
 
 const rows = this.page.locator('table.MuiTable-root tbody tr');
  const rowCount = await rows.count();

  const selectAllCheckBox = await this.page.getByRole('checkbox', { name: 'Select all' });
  await selectAllCheckBox.check();
  await expect(selectAllCheckBox).toBeChecked();

  const itemSelectedMsg = await this.page.getByRole('heading', { name: `${rowCount} items selected`, level: 6})
  await expect(itemSelectedMsg).toBeVisible();

  await this.deleteButton.click();

  await expect(this.warningMessage).toHaveText(`${rowCount} elements deleted`);

  const warningText = this.page.locator('.MuiTypography-root', { hasText: 'Do you want to add one'})
  await expect(warningText).toBeVisible();
  await expect(this.createNewTaskStatusesButton).toBeVisible();


};





}
