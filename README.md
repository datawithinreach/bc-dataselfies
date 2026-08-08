# BC Data Selfies

A live "data selfie" wall for the BC CS Dept. table at the 245 Beacon St. Open
House (Thu Sept 10, 1–4pm). Visitors answer a short questionnaire on a laptop;
their answers turn into a small hand-drawn constructivist mark (shape, color,
lines, dots) that joins a force-directed wall of everyone's portraits on the
big monitor, clustered by school/department.

Inspired by Giorgia Lupi's [Data Selfies at TED
2017](https://giorgialupi.com/data-portraits-at-ted2017).

## How it's built

- One static app, two routes, **no server, no internet, no database**:
  - `/submit` — the questionnaire (laptop)
  - `/display` — the live wall + legend (monitor)
- Responses are stored in the browser's `localStorage`. `/submit` and
  `/display` are just two windows of the *same browser*, so they share that
  storage automatically, and a `BroadcastChannel` tells the other window the
  instant a new response is saved (see [`src/lib/storage.ts`](src/lib/storage.ts)).
- This intentionally only supports a **single-laptop kiosk**: both windows
  must be the same browser, same machine, not incognito/private mode. If you
  ever want visitors to submit from their own phones, this approach won't
  work as-is — that needs a real backend again.
- Visual vocabulary, color palette, and question copy all live in
  [`shared/questions.ts`](shared/questions.ts) and
  [`shared/palette.ts`](shared/palette.ts) — edit those to change the
  questions or BC brand colors without touching any component code.

## Running it

```bash
npm install
npm run dev
```

Open in your browser:

- `http://localhost:5173/submit` on the laptop
- `http://localhost:5173/display` in a second window/tab (full-screen it on
  the monitor, e.g. `F11`)

Because it's a static site, this works with zero network access beyond
localhost — it'll run fine even if the building WiFi is flaky or down.

### Production build (recommended for the actual event)

```bash
npm run build
npm run preview
```

`preview` serves the built app at `http://localhost:4173` — faster than the
dev server and closer to how it'll behave on the day. (Don't just double-click
`dist/index.html` to open it — opening a file directly gives each window its
own `file://` origin in some browsers, which breaks the localStorage/
BroadcastChannel sync between the two windows. Always serve it over
`http://localhost`.)

## Day-of checklist

- [ ] `npm run build && npm run preview` on the laptop that will drive both
      screens.
- [ ] Open `http://localhost:4173/submit` in one window.
- [ ] Open `http://localhost:4173/display` in a second window **of the same
      browser**, drag it to the external monitor, and full-screen it.
- [ ] Submit a couple of test entries to confirm the wall updates live, then
      click the small "Reset wall" link in the bottom-left corner of
      `/display` to clear it before real visitors start.

## Customizing

- **Questions / options / colors** — all in `shared/questions.ts` and
  `shared/palette.ts`. Every question maps to exactly one visual channel
  (shape, background wash, line color, dot, arc, tick, dot-count) — see the
  comment at the top of `shared/questions.ts` for the full mapping.
- **Cluster grouping on the display** — currently clusters by school/dept
  (`src/lib/useForceLayout.ts`); change `clusterCenters()` to cluster by a
  different field if you'd rather group by affiliation type, for example.
- **Names are collected but never rendered** on `/display` — they're only
  stored alongside the other answers in `localStorage`, per BC CS's request.
