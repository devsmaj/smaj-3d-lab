# SMAJ 3D Lab

**Interactive 3D Science Learning Platform**

_Learn. Explore. Interact._

SMAJ 3D Lab is a browser-based learning environment where students inspect real-time 3D educational models with mouse, touch, webcam hand gestures, and the NOVA voice tutor.

## Run locally

Run `npm install`, then `npm run dev`. Use `npm run build` for a production build. Progress is tracked in [TODO.md](./TODO.md).

Only public Supabase values belong in the Vite environment:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Never put `OPENAI_API_KEY` in `.env`, a `VITE_` variable, React code, GitHub Pages, or a browser bundle.

## Secure NOVA backend

NOVA calls `supabase/functions/tutor`, and only that server-side Edge Function calls OpenAI. Configure and deploy it from an authenticated machine:

```sh
supabase secrets set OPENAI_API_KEY=YOUR_KEY
supabase secrets set ALLOWED_ORIGINS=https://devsmaj.github.io
supabase functions deploy tutor
```

`OPENAI_MODEL` is an optional server secret; it defaults to `gpt-5-mini`. The endpoint validates lab context, limits history and input length, streams text events, and returns real configuration, authentication, rate-limit, connection, and upstream API failures to the UI. Conversation history stays in the current browser session and is sent to the backend for contextual follow-up turns.

## Voice architecture

The browser microphone and its speech activity recognition produce a transcript. NOVA sends that transcript, recent conversation turns, selected component, lesson, assembled/exploded state, tracking state, gesture, progress, and allowed lab actions to the backend. OpenAI output streams back to the UI, then browser voice output drives the avatar speaking state and animated mouth. Tapping the microphone while NOVA is speaking cancels voice output and any active response request so the learner can interrupt.

## GitHub Pages

The `Deploy SMAJ 3D Lab to GitHub Pages` workflow builds and publishes every push to `main`. The static site contains no OpenAI credential. The live site is available at https://devsmaj.github.io/smaj-3d-lab/ after the workflow completes.
