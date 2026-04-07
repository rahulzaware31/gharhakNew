const AI_API_URL = process.env.REACT_APP_AI_API_URL || '/api/ai';

export async function postAI(payload) {
  let response;
  try {
    response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    throw new Error('Could not reach the AI service. Please check your internet connection.');
  }

  const raw = await response.text();
  let data = {};

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      // Upstream returned non-JSON (e.g. HTML 404 page — worker not deployed)
      if (response.status === 404) {
        throw new Error('AI endpoint not found. The API proxy may not be deployed yet.');
      }
      throw new Error('AI service returned an unexpected response. Please try again.');
    }
  }

  if (!response.ok) {
    const message =
      data?.error?.message ||
      (typeof data?.error === 'string' ? data.error : null) ||
      `AI service error (${response.status})`;
    throw new Error(message);
  }

  return data;
}
