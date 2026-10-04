const { buildSystemPrompt } = require('../../lib/voice/prompt');
const { rateLimit, clean, json } = require('../../lib/voice/security');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  if (rateLimit(req, 36)) return json(res, 429, { error: 'Please wait a moment before trying again.' });
  if (!process.env.OPENAI_API_KEY) return json(res, 503, { error: 'Ava is temporarily unavailable. You can still book a call or email hello@velarisweb.com.' });

  const body = req.body || {};
  const message = clean(body.message, 1200);
  const history = Array.isArray(body.history) ? body.history.slice(-10).map((item) => ({
    role: item && item.role === 'assistant' ? 'assistant' : 'user',
    content: clean(item && item.content, 1200)
  })).filter((item) => item.content) : [];
  if (!message) return json(res, 400, { error: 'Please enter a message.' });

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.VOICE_AGENT_MODEL || 'gpt-4.1-mini',
        instructions: buildSystemPrompt(),
        input: history.concat([{ role: 'user', content: message }]),
        max_output_tokens: 350,
        text: { format: { type: 'json_object' } }
      })
    });
    if (!response.ok) {
      const providerError = await response.text();
      console.error('voice_provider_rejected', response.status, providerError.slice(0, 600));
      throw new Error(`Provider returned ${response.status}`);
    }
    const payload = await response.json();
    const output = payload.output_text || payload.output?.flatMap((item) => item.content || []).find((item) => item.type === 'output_text')?.text;
    const parsed = JSON.parse(output || '{}');
    return json(res, 200, {
      reply: clean(parsed.reply, 900) || "I'm sorry, I couldn't form a useful answer. You can ask another question or speak with Deluar.",
      intent: clean(parsed.intent, 30) || 'general',
      serviceInterest: clean(parsed.serviceInterest, 120),
      shouldOfferBooking: Boolean(parsed.shouldOfferBooking),
      leadUpdates: parsed.leadUpdates && typeof parsed.leadUpdates === 'object' ? parsed.leadUpdates : {}
    });
  } catch (error) {
    console.error('voice_chat_failed', error.message);
    return json(res, 502, { error: "I couldn't complete that response. You can try again or continue with the booking page." });
  }
};
