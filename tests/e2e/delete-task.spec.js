const { test, expect } = require('@playwright/test');

const { createTask, deleteAllTasks } = require('../helpers/api');
const { ConfirmDialog } = require('../pages/Dialogs');
const { TaskListPage } = require('../pages/TaskListPage');

test.describe('Delete a task', () => {
  test.beforeEach(async ({ request }) => {
    await deleteAllTasks(request);
    await createTask(request, { title: 'Throwaway task' });
  });

  test.afterEach(async ({ request }) => {
    await deleteAllTasks(request);
  });

  test('user must confirm before a task is deleted', async ({ page }) => {
    const list = new TaskListPage(page);
    const confirm = new ConfirmDialog(page);

    await list.goto();
    await list.deleteTask('Throwaway task');

    await expect(confirm.dialog).toBeVisible();
    await confirm.confirm();

    await expect(page.getByText('Throwaway task', { exact: true })).toHaveCount(0);
    await expect(page.getByText(/Deleted "Throwaway task"/)).toBeVisible();
  });
});
