const { test, expect } = require('@playwright/test');

const { createTask, deleteAllTasks } = require('../helpers/api');
const { TaskListPage } = require('../pages/TaskListPage');

test.describe('Filter, sort, and search', () => {
  test.beforeEach(async ({ request }) => {
    await deleteAllTasks(request);
    await createTask(request, { title: 'Apple pie', priority: 'low' });
    await createTask(request, { title: 'Banana bread', priority: 'high' });
    const completed = await createTask(request, { title: 'Cherry tart', priority: 'medium' });
    await request.patch(
      `http://localhost:${process.env.BACKEND_PORT || 3030}/api/tasks/${completed.id}`,
      {
        data: { completed: true },
      },
    );
  });

  test.afterEach(async ({ request }) => {
    await deleteAllTasks(request);
  });

  test('Active tab hides completed tasks', async ({ page }) => {
    const list = new TaskListPage(page);
    await list.goto();
    await list.setStatus('Active');

    await expect(page.getByText('Apple pie', { exact: true })).toBeVisible();
    await expect(page.getByText('Banana bread', { exact: true })).toBeVisible();
    await expect(page.getByText('Cherry tart', { exact: true })).toHaveCount(0);
  });

  test('Search narrows the visible tasks', async ({ page }) => {
    const list = new TaskListPage(page);
    await list.goto();
    await list.search('banana');

    await expect(page.getByText('Banana bread', { exact: true })).toBeVisible();
    await expect(page.getByText('Apple pie', { exact: true })).toHaveCount(0);
  });
});
