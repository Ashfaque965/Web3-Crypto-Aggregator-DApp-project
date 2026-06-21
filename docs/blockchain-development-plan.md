# Blockchain Development Plan

## Why This Is Critical

An investment platform with Web3 features has elevated risk in custody, transaction integrity, and data consistency. The blockchain layer must be built with security-first architecture, least-privilege access, and strong observability.

## Core Scope

### 1) Wallet Connectivity

- Support MetaMask and WalletConnect.
- Implement network detection and safe network switching UX.
- Add robust session handling with reconnect strategy.
- Enforce signature domain separation and nonce-based replay protection.
- Provide typed wallet adapters to avoid UI-level provider coupling.

### 2) Smart Contract Development and Integration

- Develop contracts in Solidity with explicit role controls.
- Use OpenZeppelin security modules where appropriate.
- Add Hardhat pipelines for compile/test/deploy/verify.
- Create a typed contract interaction SDK for frontend/backend use.
- Separate read/write paths and isolate signer concerns.

### 3) On-Chain and Off-Chain Data Synchronization

- Treat on-chain state as source of truth for settlement-critical fields.
- Build indexer pipeline (event ingestion, normalization, idempotent writes).
- Use off-chain cache/materialized views for high-frequency reads.
- Add reconciliation jobs to detect and repair drift.
- Use block confirmations and finality thresholds for consistency rules.

### 4) Security and Decentralized Reliability

- Threat model wallet abuse, key compromise, replay, oracle poisoning, and DoS.
- Add transaction simulation before submit for user safety.
- Configure RPC failover across providers to avoid single points of failure.
- Enforce rate limiting, API auth, and signed server-side intents where needed.
- Add detailed audit trail for all state-changing blockchain actions.

## Recommended Stack

- Chains: Ethereum and EVM-compatible networks
- Smart contracts: Solidity + Hardhat
- Client interaction: Ethers.js + WalletConnect + MetaMask
- Indexing: event indexer service with retry queue and dead-letter handling
- Backend: API domain services with Redis cache and job queue

## Target Architecture

### Signing Layer (Critical Boundary)

- Keep signing logic isolated in a wallet/signer module.
- Never spread raw signer usage across UI components.
- Gate all write actions through policy checks and simulation.

### Relayer/Transaction Service

- Implement relayers for approved flows (meta-transactions where useful).
- Add nonce management, gas policies, and retry safety.
- Provide deterministic transaction state machine: queued, sent, mined, confirmed, failed.

### Indexer Layer

- Ingest contract events per block range.
- Guarantee idempotent processing with unique event keys.
- Persist normalized entities for analytics and portfolio views.

### RPC Strategy

- Do not call RPC directly from many frontend paths.
- Route reads through controlled data access layer when possible.
- Use fallback providers and health-based selection.

## Security Controls Checklist

### Smart Contract Security

- Reentrancy protection on external-call paths.
- Overflow/underflow safety (Solidity ^0.8 still requires logic checks).
- Access control tests for all privileged functions.
- Pause/emergency controls where operationally required.
- Event completeness for forensic and indexer reliability.

### Wallet and Signing Security

- EIP-712 typed data signatures for intent clarity.
- Anti-phishing UX with explicit message previews.
- Session expiration and chain-id validation on every write.

### Infrastructure Security

- Secret management via vault/KMS, never in client bundles.
- API-level abuse controls and anomaly detection.
- Dependency and container scanning in CI.

## Gas and Performance Optimization

- Minimize storage writes and pack data structures where safe.
- Batch operations and multicall reads for throughput.
- Cache derived views off-chain; avoid repetitive on-chain reads in hot paths.
- Use precomputed portfolio snapshots for dashboard latency control.

## Testing and Audit Pipeline

### Contract Testing

- Unit tests for each state transition.
- Invariant and fuzz tests for critical contract logic.
- Mainnet-fork tests for integration realism.

### Integration Testing

- End-to-end wallet flows: connect, sign, submit, confirm, error recovery.
- On-chain/off-chain reconciliation test suites.
- Load tests for indexer and transaction API.

### Audit Readiness

- Freeze contract scope before external audit.
- Provide architecture docs, threat model, and runbooks.
- Track audit findings with SLA-based remediation.

## Delivery Phases

### Phase 1: Audit and Design

- Review current frontend/backend/blockchain implementation.
- Map API/data flow and identify trust boundaries.
- Produce migration architecture and risk register.

### Phase 2: Blockchain Foundation

- Implement signer boundary, wallet adapters, and typed contract SDK.
- Introduce relayer service and transaction tracking.

### Phase 3: Data Reliability Layer

- Launch indexer and reconciliation jobs.
- Add RPC failover and observability dashboards.

### Phase 4: Security Hardening and Launch

- Complete test hardening and external audit cycle.
- Roll out with feature flags and staged traffic migration.

## Definition of Done

- Existing functionality preserved during migration.
- Wallet flows stable across supported devices/wallets.
- Contract interactions observable and recoverable.
- On-chain/off-chain data consistency proven by reconciliation metrics.
- Security controls verified through tests and audit outcomes.