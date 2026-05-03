import { getApiUrl, parseJson, setStatus } from './shared.js';

const form = document.querySelector('#login-form');
const status = document.querySelector('#login-status');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!(form instanceof HTMLFormElement) || !(status instanceof HTMLElement)) {
    return;
  }

  setStatus(status, 'Checking credentials...');
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(getApiUrl('/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const body = await parseJson(response);

    if (!response.ok) {
      setStatus(status, body.error || 'Could not log you in.', 'error');
      return;
    }

    window.location.href = '/pages/app.html';
  } catch {
    setStatus(status, 'Network error while logging in.', 'error');
  }
});
