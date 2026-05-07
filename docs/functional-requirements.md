# Functional Requirements

This document lists the core functional requirements for the TODO app.

## Tasks

### Creating tasks
- The user can add a new task by entering a title.
- The user can add an optional description to a task.
- The user can add an optional due date to a task.
- The user can assign a priority to a task (e.g., Low, Medium, High).
- The user can add one or more tags/labels to a task for categorization.

### Editing tasks
- The user can edit the title of an existing task.
- The user can edit the description of an existing task.
- The user can change or remove the due date of a task.
- The user can change the priority of a task.
- The user can add or remove tags on an existing task.

### Completing and deleting tasks
- The user can mark a task as complete.
- The user can mark a completed task as incomplete (undo completion).
- The user can delete a task.
- The user is asked to confirm before a task is permanently deleted.

## Viewing and organizing tasks

### Sorting
- Tasks are sorted by due date by default (earliest due date first).
- Tasks without a due date appear after tasks with a due date.
- The user can change the sort order to: due date, priority, creation date, or alphabetical by title.
- Completed tasks are displayed below incomplete tasks regardless of sort order.

### Filtering
- The user can filter tasks by completion status (all, active, completed).
- The user can filter tasks by tag/label.
- The user can filter tasks by priority.
- The user can filter tasks by due date range (e.g., today, this week, overdue).

### Searching
- The user can search tasks by keywords matching the title or description.

## Notifications and reminders
- Overdue tasks are visually highlighted in the task list.
- Tasks due today are visually distinguished from other tasks.

## Persistence
- Tasks persist between sessions (data is saved and restored on reload).
- Changes to tasks (create, edit, complete, delete) are saved automatically.

## User experience
- The task list updates immediately after any change without requiring a manual refresh.
- The user receives a brief confirmation message after creating, updating, or deleting a task.
- The user can undo a recent destructive action (e.g., delete) for a short time after performing it.
