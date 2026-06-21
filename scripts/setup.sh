#!/usr/bin/env bash
set -euo pipefail

echo "Installing dependencies..."
npm install

echo "Validating frontend app..."
npm run lint
npm run build

echo "Running smart contract checks..."
echo "If this fails on Node 24, switch to Node 20 LTS first."
npm run contracts:compile
npm run contracts:test

echo "Project setup complete."
