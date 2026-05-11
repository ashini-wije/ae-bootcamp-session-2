// Helpers for resetting backend state between tests via the API.
const BACKEND_PORT = process.env.BACKEND_PORT || 3030;
const API_URL = `http://localhost:${BACKEND_PORT}/api`;

async function listTasks(request) {
  const response = await request.get(`${API_URL}/tasks`);
  if (!response.ok()) throw new Error(`Failed to list tasks: ${response.status()}`);
  return response.json();
}

async function deleteAllTasks(request) {
  const tasks = await listTasks(request);
  for (const task of tasks) {
    await request.delete(`${API_URL}/tasks/${task.id}`);
  }
}

async function createTask(request, data) {
  const response = await request.post(`${API_URL}/tasks`, { data });
  if (!response.ok()) throw new Error(`Failed to create task: ${response.status()}`);
  return response.json();
}

module.exports = { API_URL, listTasks, deleteAllTasks, createTask };
