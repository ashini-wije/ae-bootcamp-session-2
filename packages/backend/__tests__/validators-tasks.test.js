const {
  parseId,
  validateCreateTask,
  validateListQuery,
  validateUpdateTask,
} = require('../src/validators/tasks');

describe('validators/tasks', () => {
  describe('validateCreateTask', () => {
    it('accepts a minimal valid task', () => {
      expect(validateCreateTask({ title: 'Buy milk' })).toEqual({ valid: true, errors: [] });
    });

    it('requires a non-empty title', () => {
      const result = validateCreateTask({ title: '   ' });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('title is required');
    });

    it('rejects bad priority', () => {
      const result = validateCreateTask({ title: 'x', priority: 'urgent' });
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/priority/);
    });

    it('rejects non-iso due_date', () => {
      const result = validateCreateTask({ title: 'x', due_date: 'tomorrow' });
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/due_date/);
    });

    it('rejects non-array tags', () => {
      const result = validateCreateTask({ title: 'x', tags: 'home' });
      expect(result.valid).toBe(false);
    });

    it('rejects missing body', () => {
      expect(validateCreateTask(null).valid).toBe(false);
    });
  });

  describe('validateUpdateTask', () => {
    it('accepts an empty patch', () => {
      expect(validateUpdateTask({})).toEqual({ valid: true, errors: [] });
    });

    it('accepts completed boolean', () => {
      expect(validateUpdateTask({ completed: true }).valid).toBe(true);
    });

    it('rejects non-boolean completed', () => {
      const result = validateUpdateTask({ completed: 'yes' });
      expect(result.valid).toBe(false);
    });

    it('allows clearing due_date with empty string', () => {
      expect(validateUpdateTask({ due_date: '' }).valid).toBe(true);
    });
  });

  describe('validateListQuery', () => {
    it('accepts known filters', () => {
      expect(
        validateListQuery({ status: 'active', sort: 'priority', priority: 'high', due: 'today' })
          .valid,
      ).toBe(true);
    });

    it('rejects unknown sort', () => {
      expect(validateListQuery({ sort: 'rainbow' }).valid).toBe(false);
    });
  });

  describe('parseId', () => {
    it('parses positive integers', () => {
      expect(parseId('42')).toBe(42);
    });

    it('rejects negative, zero, and non-numeric', () => {
      expect(parseId('-1')).toBeNull();
      expect(parseId('0')).toBeNull();
      expect(parseId('abc')).toBeNull();
    });
  });
});
