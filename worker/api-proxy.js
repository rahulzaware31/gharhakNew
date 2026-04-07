/**
 * GharHak — Cloudflare Worker API Proxy
 *
 * Deploy this as a Cloudflare Worker to securely proxy Groq API calls.
 * Set GROQ_API_KEY in your Worker environment variables.
 *
 * Optionally set ALLOWED_ORIGIN in your Worker environment variables.
 */

const baseCorsHeaders = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || 'https://gharhak.pages.dev';
    const corsHeaders = {
      ...baseCorsHeaders,
      'Access-Control-Allow-Origin': allowedOrigin,
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      if (!env.GROQ_API_KEY) {
        return new Response(JSON.stringify({ error: 'AI service is not configured.' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const body = await request.json();

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const data = await groqResponse.text();

      return new Response(data, {
        status: groqResponse.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
