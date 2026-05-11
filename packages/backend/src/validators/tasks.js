const PRIORITIES = ['low', 'medium', 'high'];
const SORT_FIELDS = ['due', 'priority', 'created', 'title'];
const STATUS_VALUES = ['all', 'active', 'completed'];
const DUE_FILTERS = ['today', 'week', 'overdue'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isIsoDate(value) {
  if (typeof value !== 'string') return false;
  // Accept YYYY-MM-DD or full ISO 8601.
  return /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value) && !Number.isNaN(Date.parse(value));
}

function validateCreateTask(body) {
  const errors = [];
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body is required'] };
  }
  if (!isNonEmptyString(body.title)) {
    errors.push('title is required');
  }
  if (body.description != null && typeof body.description !== 'string') {
    errors.push('description must be a string');
  }
  if (body.due_date != null && !isIsoDate(body.due_date)) {
    errors.push('due_date must be an ISO date string');
  }
  if (body.priority != null && !PRIORITIES.includes(body.priority)) {
    errors.push(`priority must be one of: ${PRIORITIES.join(', ')}`);
  }
  if (body.tags != null && !(Array.isArray(body.tags) && body.tags.every(isNonEmptyString))) {
    errors.push('tags must be an array of non-empty strings');
  }
  return { valid: errors.length === 0, errors };
}

function validateUpdateTask(body) {
  const errors = [];
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body is required'] };
  }
  if (body.title != null && !isNonEmptyString(body.title)) {
    errors.push('title must be a non-empty string');
  }
  if (body.description != null && typeof body.description !== 'string') {
    errors.push('description must be a string');
  }
  if (body.due_date != null && body.due_date !== '' && !isIsoDate(body.due_date)) {
    errors.push('due_date must be an ISO date string or empty');
  }
  if (body.priority != null && !PRIORITIES.includes(body.priority)) {
    errors.push(`priority must be one of: ${PRIORITIES.join(', ')}`);
  }
  if (body.completed != null && typeof body.completed !== 'boolean') {
    errors.push('completed must be a boolean');
  }
  if (body.tags != null && !(Array.isArray(body.tags) && body.tags.every(isNonEmptyString))) {
    errors.push('tags must be an array of non-empty strings');
  }
  return { valid: errors.length === 0, errors };
}

function validateListQuery(query) {
  const errors = [];
  if (query.status && !STATUS_VALUES.includes(query.status)) {
    errors.push(`status must be one of: ${STATUS_VALUES.join(', ')}`);
  }
  if (query.priority && !PRIORITIES.includes(query.priority)) {
    errors.push(`priority must be one of: ${PRIORITIES.join(', ')}`);
  }
  if (query.due && !DUE_FILTERS.includes(query.due)) {
    errors.push(`due must be one of: ${DUE_FILTERS.join(', ')}`);
  }
  if (query.sort && !SORT_FIELDS.includes(query.sort)) {
    errors.push(`sort must be one of: ${SORT_FIELDS.join(', ')}`);
  }
  return { valid: errors.length === 0, errors };
}

function parseId(raw) {
  const id = Number.parseInt(raw, 10);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

module.exports = {
  PRIORITIES,
  SORT_FIELDS,
  STATUS_VALUES,
  DUE_FILTERS,
  validateCreateTask,
  validateUpdateTask,
  validateListQuery,
  parseId,
};
