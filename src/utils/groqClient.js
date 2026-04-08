/**
 * Calls the Groq API via the Cloudflare Worker proxy.
 * REACT_APP_AI_PROXY_URL must be set at build time to the deployed Worker URL.
 * The API key lives only in the Worker environment — never in this bundle.
 */

const PROXY_URL = process.env.REACT_APP_AI_PROXY_URL;

/**
 * @param {{ messages: Array, model?: string, maxTokens?: number, temperature?: number }} opts
 * @returns {Promise<object>} OpenAI-compatible response JSON
 */
export async function chatCompletion({ messages, model = 'llama-3.3-70b-versatile', maxTokens = 1000, temperature }) {
  if (!PROXY_URL) {
    throw new Error('AI proxy is not configured. Set REACT_APP_AI_PROXY_URL in your deployment environment.');
  }

  const body = { model, max_tokens: maxTokens, messages };
  if (temperature !== undefined) body.temperature = temperature;

  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Request failed (${response.status})`);
  }

  return response.json();
}
