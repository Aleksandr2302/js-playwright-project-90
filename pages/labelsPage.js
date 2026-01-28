import { expect } from '@playwright/test';

export default class LabelsPage {
  constructor(page) {
    this.page = page;
    this.taskStatusesWidget = page.getByRole('menuitem', { name: 'Labels' });

    this.labelInput = page.getByRole('textbox', { name: 'Name' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.createNewLabelButton = page.getByRole('link', { name: 'Create' });
    this.warningMessage = page.locator('.MuiSnackbarContent-message');
    this.cancelDeleteButton = page.getByRole('button', { name: 'Undo' });
    this.ItemSelectedMessage = page.getByRole('heading', {name: 'selected', level: '6'})
    this.noLabelsWarningMessage = page.getByText('Do You want to add one?')
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
  async gotoLabelsWidget() {
    await this.taskStatusesWidget.click();
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
  async openWholeLabelsList() {
    // открыть селект "Rows per page"
    await this.page.locator('.MuiTablePagination-select').click();

    // выбрать 50
    await this.page.getByRole('option', { name: '50' }).click();
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
  async newLabelFormVerification() {
    await this.createNewLabelButton.click();
    await expect(this.labelInput).toHaveText('');
    await expect(this.saveButton).toBeDisabled();
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
  async createNewLabel(name) {
    await this.createNewLabelButton.click();
    await this.labelInput.fill(name);
    await this.saveButton.click();
    await expect(this.warningMessage).toHaveText('Element created');
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
  async labelVerification(name, action = 'new') {
    this.gotoLabelsWidget();
  
    if (action === 'new'){
      await expect(this.warningMessage).toHaveText('Element created');
    } if(action === 'update') {
      await expect(this.warningMessage).toHaveText('Element updated');
    } 
    
    await this.openWholeLabelsList();
    const newLabel = this.page
      .locator('table tbody tr td:nth-child(3)')
      .filter({ hasText: name });
    await expect(newLabel).toHaveCount(1);

    // Get all index
    const indexCells = this.page.locator('table tbody tr td:nth-child(1)');
    // Convert from text to number
    const indexValues = await indexCells.allTextContents();
    const indexNumbers = indexValues.map((val) => parseInt(val, 10));

    // Find max index
    const maxIndex = Math.max(...indexNumbers);

    const newLabelRow = this.page
      .locator('table tbody tr')
      .filter({ hasText: name });
    const newLabelIndexText = await newLabelRow
      .locator('td:nth-child(1)')
      .textContent();
    const newLabelIndex = parseInt(newLabelIndexText, 10);

    // New label should have the max index
    expect(newLabelIndex).toBe(maxIndex);
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
  async updateLabel(oldName,newName) {
    const newLabelRow = this.page
      .locator('table tbody tr')
      .filter({ hasText: oldName });
    await newLabelRow.click();

    await this.labelInput.fill('');
    await this.labelInput.fill(newName);
    await this.saveButton.click();
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
  async labelNotExistVerification(name) {
    this.gotoLabelsWidget();
    await this.openWholeLabelsList();

    const newLabel = this.page
      .locator('table tbody tr td:nth-child(3)')
      .filter({ hasText: name });
      expect(newLabel).toHaveCount(0);
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
    async countOfAllLabels(){
    await this.gotoLabelsWidget();
    await this.openWholeLabelsList();
    const allRows = this.page.locator('table tbody tr');

    const rowCount = await allRows.count();
    return rowCount;
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
  async deleteLabelFromWidget(name) {
    const newLabelRow = this.page
      .locator('table tbody tr')
      .filter({ hasText: name });

    await newLabelRow.locator('td:nth-child(1)').click();
    await expect(this.page.getByRole('heading', {name: 'selected', level: '6'})).toBeVisible();
    await this.deleteButton.click();
    await expect(this.warningMessage).toHaveText('Element deleted')

    await this.labelNotExistVerification(name);

  };

/////////////////////////////////////////////////////////////////////////////////////////////////// 
   async deleteLabelFromTheForm(name) {
    const newLabelRow = this.page
      .locator('table tbody tr')
      .filter({ hasText: name });

    await newLabelRow.click();
    await this.deleteButton.click();
    
    await expect(this.warningMessage).toHaveText('Element deleted')

    await this.labelNotExistVerification(name);

  };

/////////////////////////////////////////////////////////////////////////////////////////////////// 
    async deleteBulkLabels() {
    await this.gotoLabelsWidget();
    await this.openWholeLabelsList();
    const allRowCount = await this.countOfAllLabels();

    await this.page.getByRole('checkbox', { name: 'Select all' }).click();
    await expect(this.ItemSelectedMessage).toBeVisible();
    await this.deleteButton.click();

    await expect(this.noLabelsWarningMessage).toBeVisible();
    await expect(this.warningMessage).toContainText(`${allRowCount} elements deleted`);
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
   async cancelDeletionLabelFromTheForm(name) {
    const newLabelRow = this.page
      .locator('table tbody tr')
      .filter({ hasText: name });

    await newLabelRow.click();
    await this.deleteButton.click();
    await this.cancelDeleteButton.click();
    const action = 'updated';
    await this.labelVerification(name, action);
  };

////////////////////////////////////////////////////////////////////////////////////////////////////
     async cancelBulkDeletionLabelFromWidget() {
      await this.openWholeLabelsList();

    const rowCountBeforeDeletion = await this.countOfAllLabels();

    await this.page.getByRole('checkbox', { name: 'Select all' }).click();
    await this.deleteButton.click();
    await this.cancelDeleteButton.click();

    const rowCountAfterDeletion = await this.countOfAllLabels();

    await expect(rowCountBeforeDeletion).toBe(rowCountAfterDeletion);
  };

}
