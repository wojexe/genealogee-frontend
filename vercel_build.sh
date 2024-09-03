#!/usr/bin/env bash

if [[ $VERCEL_ENV == "production" ]]; then
  echo 'Building production'
  bun run build
elif [[ $VERCEL_ENV == "staging" ]]; then
  echo 'Building staging'
  bun run build:staging
else
  echo 'Building production ($VERCEL_ENV not set)'
  bun run build
fi
