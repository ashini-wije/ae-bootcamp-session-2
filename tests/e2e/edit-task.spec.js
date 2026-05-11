const { test, expect } = require('@playwright/test');

const { createTask, deleteAllTasks } = require('../helpers/api');
const { TaskFormDialog } = require('../pages/Dialogs');
const { TaskListPage } = require('../pages/TaskListPage');

test.describe('Edit a task', () => {
  test.beforeEach(async ({ request }) => {
    await deleteAllTasks(request);
    await createTask(request, { title: 'Old title', priority: 'low' });
  });

  test.afterEach(async ({ request }) => {
    await deleteAllTasks(request);
  });

  test('user can edit the title of a task', async ({ page }) => {
    const list = new TaskListPage(page);
    const form = new TaskFormDialog(page);

    await list.goto();
    await list.editTask('Old title');
    await form.fill({ title: 'New title' });
    await form.submit();

    await expect(page.getByText('New title', { exact: true })).toBeVisible();
    await expect(page.getByText('Old title', { exact: true })).toHaveCount(0);
  });
});
