class TaskFormDialog {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.dialog = page.getByRole('dialog');
    this.titleField = this.dialog.getByLabel('Title', { exact: false });
    this.descriptionField = this.dialog.getByLabel('Description');
    this.tagsField = this.dialog.getByLabel(/tags/i);
    this.priorityField = this.dialog.getByLabel('Priority');
    this.submitButton = this.dialog.getByRole('button', { name: /add task|save changes/i });
    this.cancelButton = this.dialog.getByRole('button', { name: /cancel/i });
  }

  async fill({ title, description, tags } = {}) {
    if (title !== undefined) await this.titleField.fill(title);
    if (description !== undefined) await this.descriptionField.fill(description);
    if (tags !== undefined) await this.tagsField.fill(tags);
  }

  async submit() {
    await this.submitButton.click();
    await this.dialog.waitFor({ state: 'hidden' });
  }

  async cancel() {
    await this.cancelButton.click();
    await this.dialog.waitFor({ state: 'hidden' });
  }
}

class ConfirmDialog {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.dialog = page.getByRole('dialog');
    this.confirmButton = this.dialog.getByRole('button', { name: /delete|confirm/i });
    this.cancelButton = this.dialog.getByRole('button', { name: /cancel/i });
  }

  async confirm() {
    await this.confirmButton.click();
    await this.dialog.waitFor({ state: 'hidden' });
  }
}

module.exports = { TaskFormDialog, ConfirmDialog };
