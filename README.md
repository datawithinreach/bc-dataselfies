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
  - `#/submit` — the questionnaire (laptop)
  - `#/display` — the live wall + legend (monitor)
  - It uses hash-based routing (`HashRouter`) specifically so the app can be
    served as plain static files — including from GitHub Pages, which has no
    server-side rewrite for client-side routes.
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

## Running it locally

```bash
npm install
npm run dev
```

Open in your browser:

- `http://localhost:5173/#/submit` on the laptop
- `http://localhost:5173/#/display` in a second window/tab (full-screen it on
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
- [ ] Open `http://localhost:4173/#/submit` in one window.
- [ ] Open `http://localhost:4173/#/display` in a second window **of the same
      browser**, drag it to the external monitor, and full-screen it.
- [ ] Submit a couple of test entries to confirm the wall updates live, then
      click the small "Reset wall" link in the bottom-left corner of
      `/display` to clear it before real visitors start.

## Deploying to GitHub Pages

The repo builds and deploys automatically via
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) on
every push to `main` or `claude/open-house-data-viz-5yyskl`. Two **one-time**
manual steps are required first (GitHub doesn't expose these over the API,
so they have to be done in the web UI by someone with admin access):

1. **Make the repo public.** GitHub Pages isn't available for private repos
   on the free plan. Settings → General → Danger Zone → "Change repository
   visibility" → Public. (Nothing sensitive lives in the repo — visitor
   responses stay in each browser's `localStorage` and are never committed —
   so this just makes the source code and question copy publicly readable.)
2. **Turn on Pages.** Settings → Pages → Build and deployment → Source:
   "GitHub Actions". Save.

After that, any push to a tracked branch redeploys automatically (check
progress under the repo's Actions tab). The live site will be at:

```
https://datawithinreach.github.io/bc-dataselfies/
```

which redirects to `#/submit`; the display wall is at
`https://datawithinreach.github.io/bc-dataselfies/#/display`.

Note that a deployment there is only really useful for **testing/demoing
remotely** — for the actual open house, running it locally (above) is more
reliable: no dependency on venue WiFi reaching GitHub, no cold start, and no
risk of two different visitors on two different devices accidentally hitting
the *same* public URL and writing to two different `localStorage`s that never
sync with each other or with your kiosk laptop.

## Printing for button pins

The thank-you screen has a "Print for a button pin" button that opens the
browser's print dialog against a dedicated print layout — just the portrait,
sized in real physical inches (`src/components/PrintButton.tsx`), centered
on whatever paper size the print dialog actually uses (Letter, A4, whatever
the printer has loaded — it deliberately doesn't try to force a custom small
page size, since browsers don't honor that reliably). Defaults to a 3"
bleed circle with a faint dashed cut-line guide at 2.25", the standard
convention for a 2.25" pin-back button. If you're using a different button
size, change `BLEED_IN`/`BUTTON_IN` there.

**Before the event**, print one test button and check the browser's print
dialog has **scale set to 100%** — "Fit to page"/"Shrink to fit" will print
the design smaller than the real 3", throwing off the button machine. That's
a one-time setting per browser/printer, not something visitors need to touch
each time.

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
