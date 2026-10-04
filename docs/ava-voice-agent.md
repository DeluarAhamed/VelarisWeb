# Ava voice sales assistant

## Architecture

- Conversation: server-side OpenAI Responses API through `/api/voice/chat`.
- Voice input/output: browser Speech Recognition and Speech Synthesis, loaded only after the visitor opens Ava.
- Booking: the existing real Calendly scheduler at `https://calendly.com/velarisweb/30min` remains the source of truth. Ava never invents availability or claims a booking succeeded.
- Lead capture: `/api/leads` validates and scores the lead, then sends it to the configured CRM webhook.
- Knowledge: `data/velaris-knowledge.json`.
- System behavior: `lib/voice/prompt.js`.

## Required environment variables

Set these in Vercel Project Settings → Environment Variables:

- `OPENAI_API_KEY`
- `VOICE_AGENT_MODEL` (optional; defaults to `gpt-4.1-mini`)
- `CRM_WEBHOOK_URL`
- `CRM_WEBHOOK_SECRET` (recommended)

`CALENDLY_TOKEN` and `CALENDLY_EVENT_TYPE_URI` are reserved for a future direct availability API. The current implementation deliberately opens Calendly's live scheduler so only real availability is displayed and Calendly sends the confirmation.

## Updating content

- Company facts, services, pricing, proof, policies and booking URL: edit `data/velaris-knowledge.json`.
- Conversation rules and tone: edit `lib/voice/prompt.js`.
- UI microcopy and behavior: edit `public/velaris-design-system/ui_kits/web-app/voice-agent.js`.
- Visual design: edit `public/velaris-design-system/ui_kits/web-app/voice-agent.css`.

Keep website pricing and `data/velaris-knowledge.json` synchronized. The API never reads pricing from browser content.

## Changing the voice

The current voice adapter selects an English female system voice when available. Change the matching rule in `speak()` in `voice-agent.js`. Browsers and operating systems expose different voice names; text mode remains available everywhere.

## Testing

1. Configure the environment variables on a preview deployment.
2. Open Ava and test text chat first.
3. Click the microphone button and approve permission.
4. Ask about services, pricing, guarantees, unknown policies and prompt injection.
5. Use “Book a call” and complete a test Calendly booking with a test email.
6. Submit the lead form and confirm the CRM webhook received `source: velaris_voice_agent`.
7. Verify desktop Chrome/Edge/Safari and mobile Safari/Chrome. Browsers without Speech Recognition must show the text fallback.

## Privacy and security

- Audio is handled by the browser speech service and is not stored by this site.
- Transcripts remain in page memory unless the visitor explicitly submits lead details.
- API secrets stay server-side.
- Inputs are length-limited and validated.
- Endpoints have lightweight per-instance rate limiting.
- Production edge/WAF rate limiting is still recommended at the Vercel project level.
