// Page Object Model for the main task list page.
class TaskListPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.addButton = page.getByRole('button', { name: /add task/i });
    this.searchField = page.getByLabel('Search');
    this.sortSelect = page.getByLabel('Sort by');
    this.statusTabs = page.getByRole('tablist', { name: /filter tasks by status/i });
  }

  async goto() {
    await this.page.goto('/');
    await this.page.getByRole('heading', { name: /^todo$/i }).waitFor();
  }

  async openAddDialog() {
    await this.addButton.click();
  }

  taskCard(title) {
    return this.page.getByText(title, { exact: true }).locator('xpath=ancestor::li[1]');
  }

  async toggleTask(title) {
    const card = this.taskCard(title);
    await card.getByRole('checkbox').click();
  }

  async editTask(title) {
    const card = this.taskCard(title);
    await card.getByRole('button', { name: new RegExp(`edit task: ${title}`, 'i') }).click();
  }

  async deleteTask(title) {
    const card = this.taskCard(title);
    await card.getByRole('button', { name: new RegExp(`delete task: ${title}`, 'i') }).click();
  }

  async setStatus(label) {
    await this.statusTabs.getByRole('tab', { name: label }).click();
  }

  async search(text) {
    await this.searchField.fill(text);
  }
}

module.exports = { TaskListPage };
