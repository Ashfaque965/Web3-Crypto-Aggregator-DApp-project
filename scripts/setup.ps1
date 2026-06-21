$ErrorActionPreference = "Stop"

Write-Host "Installing dependencies..."
npm install

Write-Host "Validating frontend app..."
npm run lint
npm run build

Write-Host "Running smart contract checks..."
Write-Host "If this fails on Node 24, switch to Node 20 LTS first."
npm run contracts:compile
npm run contracts:test

Write-Host "Project setup complete."
