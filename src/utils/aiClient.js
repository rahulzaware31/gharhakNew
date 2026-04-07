export async function postAI(payload) {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const raw = await response.text();
  let data = {};

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error('AI service returned an invalid response. Please try again.');
    }
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.error || `AI service error (${response.status})`;
    throw new Error(message);
  }

  return data;
}
