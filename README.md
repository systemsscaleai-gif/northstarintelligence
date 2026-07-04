# North Star Intelligence · Launch Site

Static launch site for northstarintelligence.org. Launch: July 14, 2026.

## Stack
Plain HTML/CSS/JS. No build step. No frameworks. Deploys to Vercel as a
static site.

## Before deploy (required)
1. Replace `YOUR_FORM_ID` in index.html with the live Formspree form ID.
2. Confirm cody@northstarintelligence.org exists with SPF/DKIM/DMARC.
3. Generate OG card at assets/brand/og-home.png (1200x630, navy field,
   star mark, hero headline).

## Local dev
    npx serve .

## Grading suite (the Codex loop runs this)
    bash scripts/grade.sh
Runs html-validate, linkinator, axe-core, and Lighthouse against the
rubric thresholds in NSI-Codex-Master-Prompt-v4-LAUNCH.md.

## Deploy
Connect the repo to Vercel, framework preset "Other", no build command,
output directory root. vercel.json handles headers and clean URLs.

## Governance
AGENTS.md defines the rules for all agent work. The master prompt file
is the canonical spec. Copy deck is verbatim law.
