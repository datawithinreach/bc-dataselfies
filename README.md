# BC Data Selfies

A live "data selfie" wall for the BC CS Dept. table at the 245 Beacon St. Open
House (Thu Sept 10, 1–4pm). Visitors answer a short questionnaire on a laptop;
their answers turn into a small hand-drawn constructivist mark (shape, color,
lines, dots) that joins a force-directed wall of everyone's portraits on the
big monitor, clustered by school/department.

Inspired by Giorgia Lupi's [Data Selfies at TED
2017](https://giorgialupi.com/data-portraits-at-ted2017).

## How it's built

- One app, two routes, no internet required at the venue:
  - `/submit` — the questionnaire (laptop)
  - `/display` — the live wall + legend (monitor)
- Express + WebSocket backend broadcasts every new submission instantly to
  the display.
- Responses persist to `data/responses.json` on disk (no database to install,
  no cloud dependency, survives a server restart).
- Visual vocabulary, color palette, and question copy all live in
  [`shared/questions.ts`](shared/questions.ts) and
  [`shared/palette.ts`](shared/palette.ts) — edit those to change the
  questions or BC brand colors without touching any component code.

## Running it

```bash
npm install
npm run dev
```

This starts the Vite dev server (`:5173`) and the API/WebSocket server
(`:8787`) together, with `/api` and `/ws` proxied through Vite. Open:

- `http://localhost:5173/submit` on the laptop
- `http://localhost:5173/display` on the monitor (full-screen the browser
  window, e.g. `F11`)

Both pages work in separate windows/tabs on the **same machine** — nothing
needs network access beyond localhost, so it'll work even if the building
WiFi is flaky.

### Production build (recommended for the actual event)

The dev server is fine, but for the event itself run the built, production
version — it's faster and doesn't need two terminals:

```bash
npm run build
npm start
```

This serves everything from a single process on `http://localhost:8787`
(`/submit` and `/display`).

## Day-of checklist

- [ ] `npm start` on the laptop that will drive both screens.
- [ ] Open `http://localhost:8787/submit` in one window (or on the laptop's
      own screen).
- [ ] Open `http://localhost:8787/display` in a second window, drag it to the
      external monitor, and full-screen it.
- [ ] Submit a couple of test entries to confirm the wall updates live, then
      **reset** so the display starts empty for real visitors:

  ```bash
  curl -X POST http://localhost:8787/api/reset \
    -H 'Content-Type: application/json' \
    -d '{"token":"bc-open-house"}'
  ```

  (Change the token via the `RESET_TOKEN` env var if you want something less
  guessable — it only guards against an accidental wipe mid-event, not a
  determined attacker.)

## Customizing

- **Questions / options / colors** — all in `shared/questions.ts` and
  `shared/palette.ts`. Every question maps to exactly one visual channel
  (shape, background wash, line color, dot, arc, tick, dot-count) — see the
  comment at the top of `shared/questions.ts` for the full mapping.
- **Cluster grouping on the display** — currently clusters by school/dept
  (`src/lib/useForceLayout.ts`); change `clusterCenters()` to cluster by a
  different field if you'd rather group by affiliation type, for example.
- **Names are collected but never rendered** on `/display` — only used
  server-side/in the stored data, per BC CS's request.
