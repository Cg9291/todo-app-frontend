import { API_BASE_URL } from './config.js';

export function getApiUrl(pathname) {
  return `${API_BASE_URL}${pathname}`;
}

export async function parseJson(response) {
  return response.json().catch(() => ({}));
}

export function setStatus(element, message = '', tone = '') {
  element.textContent = message;
  if (tone) {
    element.dataset.tone = tone;
  } else {
    delete element.dataset.tone;
  }
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
