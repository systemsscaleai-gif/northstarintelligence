#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════
# grade.sh · North Star Intelligence grading suite
# Runs the machine-verified gates from the rubric.
# Usage: bash scripts/grade.sh
# Requires: Node 18+, Chrome/Chromium available to Lighthouse.
# ══════════════════════════════════════════════════════════════
set -uo pipefail

PORT=8877
URL="http://localhost:$PORT"
PAGES=("/" "/privacy.html" "/404.html")
FAIL=0

echo "── Installing grading tools (local, no repo pollution) ──"
npm ls -g @lhci/cli >/dev/null 2>&1 || npm i -g @lhci/cli >/dev/null 2>&1
npm ls -g @axe-core/cli >/dev/null 2>&1 || npm i -g @axe-core/cli >/dev/null 2>&1
npm ls -g html-validate >/dev/null 2>&1 || npm i -g html-validate >/dev/null 2>&1
npm ls -g linkinator >/dev/null 2>&1 || npm i -g linkinator >/dev/null 2>&1
npm ls -g serve >/dev/null 2>&1 || npm i -g serve >/dev/null 2>&1

echo "── Starting static server on :$PORT ──"
npx serve -l $PORT -s . >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null' EXIT
sleep 2

echo "── Gate 1: HTML validation ──"
npx html-validate index.html privacy.html 404.html || FAIL=1

echo "── Gate 2: Broken links and anchors ──"
npx linkinator "$URL" --recurse --skip "plausible.io|formspree.io|fonts.g" || FAIL=1

echo "── Gate 3: axe-core accessibility ──"
for p in "${PAGES[@]}"; do
  npx axe "$URL$p" --exit || FAIL=1
done

echo "── Gate 4: Lighthouse (mobile) ──"
for p in "/" "/privacy.html"; do
  npx lhci collect --url="$URL$p" --settings.preset=mobile >/dev/null 2>&1
done
npx lhci assert \
  --assertions.categories:performance=0.95 \
  --assertions.categories:seo=1 \
  --assertions.categories:accessibility=1 \
  --assertions.categories:best-practices=1 || FAIL=1

echo ""
if [ $FAIL -eq 0 ]; then
  echo "✦ ALL MACHINE GATES PASS. Judged criteria remain: review"
  echo "  screenshots at 390/768/1440 per the rubric."
else
  echo "✗ GATES FAILED. Fix the reports above before committing."
fi
exit $FAIL
