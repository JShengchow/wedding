#!/usr/bin/env bash
set -euo pipefail

commit_message="${1:-Deploy wedding site}"
branch="$(git branch --show-current)"

if [[ -z "$branch" ]]; then
  echo "No current Git branch found."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Missing Git remote: origin."
  exit 1
fi

if [[ ! -d ".vercel" ]]; then
  echo "Missing .vercel project link. Run: npx vercel link"
  exit 1
fi

echo "Building production bundle..."
npm run build

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Committing changes..."
  git add -A
  git commit -m "$commit_message"
else
  echo "No Git changes to commit."
fi

echo "Pushing $branch to origin..."
git push origin "$branch"

echo "Deploying to Vercel production..."
npx vercel deploy --prod
