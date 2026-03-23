# Now world is (NWI) 2026

Premium multilingual global intelligence web app built with Next.js App Router.

## Key Features

- Dark-first premium map intelligence UI (mobile friendly)
- `Map (2D)` and `Globe (3D)` toggle with smooth interaction
- Country hover tooltip:
  - flag
  - localized country name
  - GDP per capita + year
  - PPP GDP per capita + year
  - Average IQ (curated benchmark)
- Country click detail drawer/page:
  - photos (Pexels -> Unsplash -> local fallback)
  - economy, language, history, politics, demographics safety handling
- 17 locales (default English + Korean + 15 others)
- Automatic language start from browser/device `Accept-Language`
- Country favorites (heart) with Supabase Auth
- Compare lab:
  - select countries + metrics
  - yearly GDP/PPP line charts
  - IQ visual comparison card
  - yearly comparison table
- Deep links:
  - `/{locale}/country/{iso2}`
  - `/s/{iso2}` (fixed share URL, auto-detect locale then redirect)
  - `/{locale}/compare?countries=KR,JP&metrics=gdpPerCapita,pppGdpPerCapita,averageIq`

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- next-intl
- react-simple-maps + d3-zoom
- react-globe.gl
- @floating-ui/react (tooltip layer)
- framer-motion
- Supabase Auth + RLS favorites
- SWR

## Fixed URL / Deployment

- Canonical URL: `https://nwi.world`
- Deployment target: Vercel + custom domain

## Project Structure (high level)

- `app/[locale]/*`: localized pages
- `app/api/*`: data + favorites routes
- `components/*`: map, globe, drawer, compare, profile/favorites/settings UI
- `lib/api/*`: REST Countries / World Bank / photo adapters
- `lib/data/*`: normalized mock fallback datasets (10+ countries)
- `messages/*.json`: locale files (17)
- `supabase/schema.sql`: profile/favorites schema + RLS

## Environment Variables

Copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_APP_URL=https://nwi.world
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
PEXELS_API_KEY=
UNSPLASH_ACCESS_KEY=
NEXT_PUBLIC_ENABLE_GLOBE=true
```

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Run SQL in `supabase/schema.sql`.
3. Enable Auth providers:
   - Google OAuth
   - Email magic link
4. Set env vars in `.env.local` and Vercel dashboard.

## Data Strategy

- World Bank:
  - `NY.GDP.PCAP.CD`
  - `NY.GDP.PCAP.PP.CD`
- REST Countries for base metadata
- Photos: Pexels first, Unsplash fallback
- Local curated content for history/politics/demographics notes
- If data is missing:
  - `Latest data unavailable`
  - `Photo unavailable`
  - `Demographic data not consistently available`

## Language Detection

- Root route (`/`) checks:
  1. `NWI_LOCALE` cookie
  2. `Accept-Language` header
- If user changes language, cookie is updated and used on next visit.

## Favorites + Compare Workflow

1. Open a country detail and tap heart to save favorite.
2. Go to `/{locale}/favorites`.
3. Pick favorite countries + metrics (GDP / PPP / IQ).
4. Tap Compare to open `/{locale}/compare` with query params.
5. Analyze yearly charts and table.

## Testing

```bash
npm run test
npm run test:e2e
```

Included:

- Unit: country name normalization, latest indicator selection
- Integration: detail fallback behavior
- E2E skeleton: compare page visibility

## Notes

- IQ values are modeled as curated benchmark references and shown with source-note fields.
- IQ is visualized as static comparison, not a yearly time-series.
- Demographic/ethnic composition is intentionally conservative: no guessed ratios.
