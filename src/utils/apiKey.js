const STORAGE_KEY = 'gharHakGroqApiKey';

export function getApiKey() {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export function saveApiKey(key) {
  localStorage.setItem(STORAGE_KEY, key.trim());
}

export function clearApiKey() {
  localStorage.removeItem(STORAGE_KEY);
}
