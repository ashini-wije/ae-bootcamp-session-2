const { test, expect } = require('@playwright/test');

const { createTask, deleteAllTasks } = require('../helpers/api');
const { TaskListPage } = require('../pages/TaskListPage');

test.describe('Complete a task', () => {
  test.beforeEach(async ({ request }) => {
    await deleteAllTasks(request);
    await createTask(request, { title: 'Take out the trash', priority: 'medium' });
  });

  test.afterEach(async ({ request }) => {
    await deleteAllTasks(request);
  });

  test('user can mark a task complete', async ({ page }) => {
    const list = new TaskListPage(page);
    await list.goto();

    await list.toggleTask('Take out the trash');

    const card = list.taskCard('Take out the trash');
    await expect(card.getByRole('checkbox')).toBeChecked();
  });
});
