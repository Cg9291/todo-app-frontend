import { getApiUrl, parseJson, setStatus } from './shared.js';

const form = document.querySelector('#register-form');
const status = document.querySelector('#register-status');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!(form instanceof HTMLFormElement) || !(status instanceof HTMLElement)) {
    return;
  }

  setStatus(status, 'Creating your account...');
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(getApiUrl('/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const body = await parseJson(response);

    if (!response.ok) {
      if (body.details) {
        const details = Object.values(body.details).flat().join(' ');
        setStatus(status, details || body.error || 'Could not create your account.', 'error');
      } else {
        setStatus(status, body.error || 'Could not create your account.', 'error');
      }
      return;
    }

    window.location.href = '/pages/app.html';
  } catch {
    setStatus(status, 'Network error while creating your account.', 'error');
  }
});
