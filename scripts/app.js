import { getApiUrl, parseJson, setStatus, escapeHtml } from './shared.js';

const form = document.querySelector('#task-form');
const status = document.querySelector('#task-status');
const list = document.querySelector('#task-list');
const meta = document.querySelector('#task-meta');
const editorTitle = document.querySelector('#editor-title');
const editorCopy = document.querySelector('#editor-copy');
const submitButton = document.querySelector('#task-submit');
const cancelButton = document.querySelector('#task-cancel');

if (
  !(form instanceof HTMLFormElement) ||
  !(status instanceof HTMLElement) ||
  !(list instanceof HTMLElement) ||
  !(meta instanceof HTMLElement) ||
  !(editorTitle instanceof HTMLElement) ||
  !(editorCopy instanceof HTMLElement) ||
  !(submitButton instanceof HTMLButtonElement) ||
  !(cancelButton instanceof HTMLButtonElement)
) {
  throw new Error('Task app UI could not initialize.');
}

const titleInput = form.elements.namedItem('title');
const descriptionInput = form.elements.namedItem('description');
const taskIdInput = form.elements.namedItem('taskId');

if (
  !(titleInput instanceof HTMLInputElement) ||
  !(descriptionInput instanceof HTMLTextAreaElement) ||
  !(taskIdInput instanceof HTMLInputElement)
) {
  throw new Error('Task editor fields could not initialize.');
}

const resetEditor = () => {
  form.reset();
  taskIdInput.value = '';
  editorTitle.textContent = 'Create a task';
  editorCopy.textContent = 'Use this form to add a task or switch into edit mode from the list on the right.';
  submitButton.textContent = 'Save task';
  cancelButton.hidden = true;
};

const requireAuth = async (response) => {
  if (response.status !== 401) {
    return response;
  }

  window.location.href = '/pages/login.html';
  throw new Error('Unauthenticated');
};

const renderTasks = (tasks) => {
  if (!tasks.length) {
    list.innerHTML = '<div class="empty-state">No tasks yet. Create the first one from the editor.</div>';
    return;
  }

  list.innerHTML = tasks.map((task) => `
    <article class="task-card" data-task-id="${task.id}">
      <h3>${escapeHtml(task.title)}</h3>
      <p>${escapeHtml(task.description)}</p>
      <div class="task-actions">
        <button class="button button-ghost" type="button" data-action="edit">Edit</button>
        <button class="button button-ghost" type="button" data-action="delete">Delete</button>
      </div>
    </article>
  `).join('');
};

const loadTasks = async () => {
  meta.textContent = 'Loading tasks...';

  const response = await requireAuth(await fetch(getApiUrl('/todos'), {
    method: 'GET',
    credentials: 'include'
  }));

  const body = await parseJson(response);
  const tasks = Array.isArray(body.data) ? body.data : body;

  renderTasks(tasks);
  meta.textContent = `${tasks.length} task${tasks.length === 1 ? '' : 's'} loaded`;
  return tasks;
};

const saveTask = async (payload) => {
  const taskId = taskIdInput.value;
  const isEditing = Boolean(taskId);
  const response = await requireAuth(await fetch(getApiUrl(isEditing ? `/todos/${taskId}` : '/todos'), {
    method: isEditing ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  }));

  const body = await parseJson(response);

  if (!response.ok) {
    const details = body.details ? Object.values(body.details).flat().join(' ') : '';
    throw new Error(details || body.error || 'Could not save task.');
  }

  return body;
};

const deleteTask = async (taskId) => {
  const response = await requireAuth(await fetch(getApiUrl(`/todos/${taskId}`), {
    method: 'DELETE',
    credentials: 'include'
  }));

  if (!response.ok && response.status !== 204) {
    const body = await parseJson(response);
    throw new Error(body.error || 'Could not delete task.');
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus(status, 'Saving task...');

  const payload = {
    title: titleInput.value,
    description: descriptionInput.value
  };

  try {
    await saveTask(payload);
    resetEditor();
    setStatus(status, 'Task saved.', 'success');
    await loadTasks();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not save task.';
    setStatus(status, message, 'error');
  }
});

cancelButton.addEventListener('click', () => {
  resetEditor();
  setStatus(status, '');
});

list.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const card = target.closest('[data-task-id]');
  if (!(card instanceof HTMLElement)) {
    return;
  }

  const taskId = card.dataset.taskId;
  const heading = card.querySelector('h3')?.textContent ?? '';
  const description = card.querySelector('p')?.textContent ?? '';
  const action = target.dataset.action;

  if (!taskId) {
    return;
  }

  if (action === 'edit') {
    taskIdInput.value = taskId;
    titleInput.value = heading;
    descriptionInput.value = description;
    editorTitle.textContent = 'Edit task';
    editorCopy.textContent = 'Update the selected task, then save the changes back through the same JSON endpoint.';
    submitButton.textContent = 'Update task';
    cancelButton.hidden = false;
    titleInput.focus();
    setStatus(status, '');
    return;
  }

  if (action === 'delete') {
    if (!window.confirm('Delete this task?')) {
      return;
    }

    try {
      await deleteTask(taskId);
      setStatus(status, 'Task deleted.', 'success');
      if (taskIdInput.value === taskId) {
        resetEditor();
      }
      await loadTasks();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not delete task.';
      setStatus(status, message, 'error');
    }
  }
});

loadTasks().catch((error) => {
  const message = error instanceof Error ? error.message : 'Could not load tasks.';
  setStatus(status, message, 'error');
  meta.textContent = 'Task load failed';
});
