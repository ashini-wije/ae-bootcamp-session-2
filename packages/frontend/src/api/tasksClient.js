const BASE_URL = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body.error) message = body.error;
      if (body.errors) message = body.errors.join(', ');
    } catch (_err) {
      // ignore body parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value);
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const tasksClient = {
  list: (filters = {}) => request(`/tasks${buildQuery(filters)}`),
  get: (id) => request(`/tasks/${id}`),
  create: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};

export const tagsClient = {
  list: () => request('/tags'),
  create: (name) => request('/tags', { method: 'POST', body: JSON.stringify({ name }) }),
};
