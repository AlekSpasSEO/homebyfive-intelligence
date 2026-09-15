# Home by Five Website

A complete, responsive marketing website and interactive product demo for Home by Five.

Home by Five is marketing decision intelligence for franchises and multi-location service providers. It turns fragmented performance signals into a trusted operating picture, a ranked decision queue, and—depending on the subscription—strategy and human guidance.

## Site Map

- `/` — Homepage and primary conversion story
- `/product/` — Numbers → Decisions → Strategy → Human Touch
- `/who-its-for/` — Franchise and multi-location buyer use cases
- `/pricing/` — Three founding subscriptions and comparison table
- `/insights/` — The Local Control Gap research-in-progress page
- `/about/` — The Home by Five mission
- `/demo/` — Interactive Atlas Home Services dashboard with synthetic data
- `/start/` — Plan selection and an honest, non-transmitting onboarding-request preview

## Founding Subscriptions

1. Numbers & Decisions — $100 per month
2. Numbers, Decisions & Strategy — $500 per month
3. Numbers, Decisions, Strategy & Human Touch — $1,000 per month

The final commercial model still needs a decision about location limits, integrations, onboarding, billing, cancellation, and service scope. The site names this uncertainty rather than inventing terms.

## Preview

Serve this directory over HTTP:

```sh
python -m http.server 4175 --bind 127.0.0.1
```

Open http://127.0.0.1:4175/.

## Product Boundaries

- All dashboard data, locations, findings, and opportunity ranges are synthetic.
- The Local Control Gap research is labeled in progress. No headline loss percentage is published before validation.
- Revenue-based ROI is not presented as profit ROI or causal marketing lift.
- The plan request form does not transmit or store user data. A booking link, CRM endpoint, or lead-delivery email must be provided before public launch.
- No customers, logos, testimonials, or outcome claims are invented.
- No payment is collected.

## Documentation

- `.agents/product-marketing-context.md` — positioning, audience, pains, differentiation, voice, proof boundaries, and open decisions
- `SITE_ARCHITECTURE.md` — page hierarchy, conversion journey, navigation, homepage argument, and launch boundaries
- `EXISTING_COMMAND_CENTER_REVIEW.md` — source-product review from the earlier demo phase

## Implementation

The website is plain HTML, CSS, and JavaScript with no build step. Marketing pages share `assets/site.css` and `assets/site.js`. The dashboard owns its files inside `demo/`.

All links are relative so the site can run under a GitHub Pages project subpath. `.nojekyll` disables Jekyll processing. Google Fonts are optional and system fallbacks are present. No client systems, credentials, tracking scripts, external APIs, or payment providers are connected.

## Before Public Launch

1. Confirm how pricing scales with locations.
2. Provide the preferred booking link, contact email, or CRM endpoint.
3. Confirm billing, cancellation, refund, privacy, and service terms.
4. Replace synthetic proof with approved outcomes only after customer validation.
5. Review all pages, then publish through the chosen GitHub Pages setup without changing repository visibility unless explicitly approved.
