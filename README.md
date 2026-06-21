# Web3 Crypto Aggregator DApp

This project is a modern crypto market aggregator built with Next.js, React, TypeScript, and Tailwind CSS. It aggregates market data from CoinGecko and provides responsive market views with coin-level detail pages.

## Current Features

- Live crypto market aggregation from CoinGecko.
- Responsive dashboard with mobile cards and desktop table layout.
- Coin detail pages with market KPIs and summarized description.
- Typed API layer with revalidation for stable data fetching.
- Web3 control panel for wallet connect, network switch, signed intents, and chain sync.
- Server APIs for transaction-relayer simulation and on-chain/off-chain state synchronization.
- Solidity `InvestmentVault` contract scaffold with reentrancy guard pattern.

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Millify
- Framer Motion
- Ethers.js
- Viem
- Zod

## Getting Started

Node.js LTS (20.x) is recommended for the smart contract toolchain.

1. Install dependencies:

	```bash
	npm install
	```

2. Start the development server:

	```bash
	npm run dev
	```

3. Open http://localhost:3000

## Available Scripts

- `npm run dev` — Start local development server
- `npm run lint` — Run ESLint
- `npm run build` — Create production build
- `npm run start` — Run production server
- `npm run contracts:compile` — Compile Solidity contracts
- `npm run contracts:test` — Run Hardhat contract tests
- `npm run contracts:deploy:local` — Deploy `InvestmentVault` to local Hardhat network
- `npm run contracts:deploy:sepolia` — Deploy `InvestmentVault` to Sepolia
- `npm run contracts:verify:sepolia` — Verify deployed `InvestmentVault` on Etherscan
- `npm run contracts:check` — Run contract compile and tests
- `npm run check` — Run app lint and production build

## One-Command Setup

- PowerShell (Windows):

	```powershell
	./scripts/setup.ps1
	```

- Bash (macOS/Linux):

	```bash
	bash ./scripts/setup.sh
	```

## Project Structure

- `src/app` — App Router pages and layout
- `src/components` — Reusable UI components
- `src/features/coins` — CoinGecko API layer and coin types
- `src/features/web3` — Wallet, signing, on-chain read, chain, and contract modules
- `src/app/api/web3/sync` — Sync route for chain balance reconciliation
- `src/app/api/web3/tx` — Relayer simulation route for signed intents
- `contracts/InvestmentVault.sol` — Smart contract scaffold

## Environment Variables

Create a `.env.local` file if you want to wire a deployed vault contract address:

```env
NEXT_PUBLIC_INVESTMENT_VAULT_ADDRESS=0xYourDeployedContractAddress
```

For contract deployment, copy `.env.example` to `.env.local` and set:

```env
SEPOLIA_RPC_URL=https://your-sepolia-rpc
DEPLOYER_PRIVATE_KEY=0xyourprivatekey
ETHERSCAN_API_KEY=your-api-key
INVESTMENT_VAULT_ADDRESS=0xDeployedAddress
```

## Smart Contract Workflow

Note: Hardhat v2 does not support Node 24.x. If you are on Node 24 (Windows default), switch to Node 20 LTS before running contract commands.

1. Compile contracts:

	```bash
	npm run contracts:compile
	```

2. Run contract tests:

	```bash
	npm run contracts:test
	```

3. Deploy to Sepolia:

	```bash
	npm run contracts:deploy:sepolia
	```

4. Set deployed address in `.env.local`:

	```env
	NEXT_PUBLIC_INVESTMENT_VAULT_ADDRESS=0xDeployedAddress
	```

5. Verify contract on Etherscan:

	```bash
	npm run contracts:verify:sepolia
	```

## Web3 Upgrade Blueprint

For the blockchain/security-first modernization plan (wallets, contracts, on-chain/off-chain sync, indexing, relayers, and audits), see:

- `docs/blockchain-development-plan.md`

## CI Workflows

- App CI: `.github/workflows/app-ci.yml`
- Contracts CI: `.github/workflows/contracts-ci.yml`

Both workflows run on Node 20 to keep Next.js and Hardhat checks stable.
