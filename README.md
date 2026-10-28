# Grid Builder — C2R Marketing

9-box "choose your path" grid pages. A visitor picks one of nine titles and
routes to a matched destination (offer page, free-tip page, or capture form).

## Live grids

- Churches: /grids/churches/ → AI Visibility Audit $147
- Dentists: /grids/dentists/ → AI Visibility Audit $147
- Realtors: /grids/realtors/ → AI Visibility Audit $147
- Bible / NMV readers: /grids/nmv/ → NMV products

## Tools

- /builder.html — build a grid: topic, 9 suggested titles (built-in bank of
  top-searched question patterns — no paid AI call), edit, preview, save,
  export standalone HTML, shareable link (#config=).
- /dashboard.html — tracking: views, clicks, CTR per box (this browser),
  CSV export, reset.

## Tracking ($0)

Clicks are counted two ways: localStorage per box on this device (see
dashboard), and UTM tags on every outbound link
(utm_source=grid, utm_medium=<grid>, utm_campaign=<box>) for cross-device
counts in the destination's own analytics. No backend, no cookies, no spend.

## Email capture

Every grid embeds the "Grid Updates — C2R Marketing" Google Form, prefilled
with the grid name. Responses land in Google Forms.

## Build

`python3 build.py` regenerates dist/ from the data in build.py.
Deploy: push dist/ to this repo's main branch; GitHub Pages serves it.
