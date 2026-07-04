# AGENTS.md · North Star Intelligence Site

This file governs all agent work in this repository. The full task
specification lives in NSI-Codex-Master-Prompt-v4-LAUNCH.md at the repo
root. Read it before any change. Where this file and that file conflict,
that file wins.

## What this repo is
Static launch site for northstarintelligence.org. Launch date July 14,
2026. Plain HTML/CSS/JS, no build step currently. Eleventy may be
introduced ONLY if partial extraction is needed, output must remain
static HTML at the same URLs.

## Structure
- index.html          single-page site, nine sections, order is canonical
- privacy.html        plain-language policy, keep the tone
- 404.html            design-system error page
- css/style.css       token system at top, all colors derive from
                      --navy, --platinum, --blue. Never add a color
                      outside the token block
- js/main.js          reveals, mobile nav, gap calculator, form. No
                      frameworks, no dependencies, ever
- assets/brand/       star.svg is the only source of the mark
- scripts/grade.sh    the grading suite, run before every commit

## Hard rules
1. Copy in NSI-Codex-Master-Prompt-v4-LAUNCH.md's VERBATIM COPY DECK is
   law. Do not paraphrase it.
2. Punctuation in visible copy: no em dashes, no semicolons, no hyphens
   used as dashes. Code is exempt.
3. Old engine names (Compass, Sphere, Atlas, Horizon, Board Advisor)
   must never appear in site copy.
4. TM marks only on: North Star Intelligence, North Star Index, Wisdom
   Graph, Wisdom OS, Potential Score. First use per page only.
5. Never change: the Formspree form ID once set, the Plausible domain,
   any URL path.
6. No adoption, scale, or results claims anywhere. The claims scrub in
   the master prompt is absolute.
7. prefers-reduced-motion must be honored by every animation you add.
8. Every commit message states which rubric criteria it targets.

## Grading suite
Run `bash scripts/grade.sh` from the repo root. It requires Node 18+
and Chrome. It runs Lighthouse (mobile and desktop), axe-core via
@axe-core/cli, html-validate, and a link check. Fix everything it
reports before opening a PR.

## Definition of done
100/100 against the rubric in the master prompt, or 6 loop iterations
with the remaining gap documented. Screenshots at 390, 768, and 1440
widths for every section in the PR description.
