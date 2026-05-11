const { test, expect } = require('@playwright/test');

const { deleteAllTasks } = require('../helpers/api');
const { TaskFormDialog } = require('../pages/Dialogs');
const { TaskListPage } = require('../pages/TaskListPage');

test.describe('Add a task', () => {
  test.beforeEach(async ({ request }) => {
    await deleteAllTasks(request);
  });

  test.afterEach(async ({ request }) => {
    await deleteAllTasks(request);
  });

  test('user can add a task with a title and tag', async ({ page }) => {
    const list = new TaskListPage(page);
    const form = new TaskFormDialog(page);

    await list.goto();
    await list.openAddDialog();
    await form.fill({ title: 'Buy mochi', tags: 'errands' });
    await form.submit();

    await expect(page.getByText('Buy mochi', { exact: true })).toBeVisible();
    await expect(page.getByText('#errands')).toBeVisible();
  });

  test('add dialog shows validation when title is empty', async ({ page }) => {
    const list = new TaskListPage(page);
    const form = new TaskFormDialog(page);

    await list.goto();
    await list.openAddDialog();
    await form.submitButton.click();
    await expect(form.dialog).toBeVisible();
    await expect(page.getByText(/title is required/i)).toBeVisible();
  });
});
