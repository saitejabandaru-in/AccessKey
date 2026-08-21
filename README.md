<div align="center">

# 🗝️ AccessKey Protocol

**The verifiable authorization layer for the decentralized web.** <br>
Abstracting payments, metering, and session keys for machines, AI agents, and Oracles.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-saitejabandaru--in.github.io%2FAccessKey-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://saitejabandaru-in.github.io/AccessKey/)
[![Build Status](https://img.shields.io/github/actions/workflow/status/saitejabandaru-in/AccessKey/deploy-pages.yml?style=for-the-badge&logo=github)](https://github.com/saitejabandaru-in/AccessKey/actions)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Foundry](https://img.shields.io/badge/Tested%20with-Foundry-red?style=for-the-badge)](https://getfoundry.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

<br/>

> **⚠️ SECURITY DISCLAIMER:** AccessKey is an educational and portfolio-grade protocol designed using production-oriented engineering practices. It has **not** undergone a professional security audit and **must not** be used with real funds on mainnet.

## 🌐 Live Product Experience

The front-end client showcases an elite, Silicon-Valley grade user interface demonstrating how providers and subscribers interact with the protocol. 

**[🔗 Access the Live Application](https://saitejabandaru-in.github.io/AccessKey/)**

### UI/UX Highlights:
- **Interactive Sandbox Terminal:** Simulates SDK execution and on-chain escrow locks directly in the browser.
- **Physics-Based Interactivity:** Powered by Framer Motion, featuring 3D mouse-tracking tilt cards and magnetic buttons.
- **Web3 Wallet Integration:** Fully functional wallet connection via `wagmi` and `viem`, including ENS resolution.
- **High-Fidelity Dashboard:** An institutional-grade subscriber dashboard featuring shimmering loading states, copy-to-clipboard haptics, and a `CMD+K` command palette.

---

## 🏗️ Protocol Overview

AccessKey is a foundational smart contract primitive for API authorization. It provides the economic scaffolding required for machines to trustlessly pay machines for data and computation, entirely on-chain.

### Target Use Cases
1. **🤖 AI Agent Economy:** Allow autonomous AI agents to subscribe to premium data feeds or LLM inferences using their own wallets and session keys.
2. **⛓️ Decentralized Oracles:** Oracle networks can monetize high-frequency data streams directly. Escrow guarantees payment, while cryptographic signatures prevent data theft.
3. **⚡ RPC & Node Providers:** Replace Web2 credit card subscriptions with trustless Web3 billing. Automate usage settlement for heavy infrastructure consumers via Keeper networks.

## ⚙️ Core Architecture (V2)

- **Trustless State-Channel Settlement:** Usage metering is completely trustless. API Gateways require EIP-712 cryptographic signatures directly from the user, preventing providers from forging usage.
- **Time-Locked Streaming Escrow:** Provider revenue is locked in a streaming escrow and unlocks linearly block-by-block, protecting users from rug-pulls and sudden service deprecation.
- **Prorated Upgrades & Instant Refunds:** Upgrades and cancellations dynamically calculate unearned stream balances and instantly refund the subscriber.
- **Fiat-Pegged Pricing Oracles:** Deep integration with Chainlink `AggregatorV3Interface` allows providers to price plans in USD while settling in dynamic ERC-20 amounts.
- **Delegated Auto-Renewals:** Support for Chainlink Automation / Keepers to pull pre-approved ERC-20 tokens and seamlessly renew expired subscriptions.
- **Deflationary Token Support:** Strict `balanceAfter - balanceBefore` accounting safely processes fee-on-transfer and deflationary tokens natively.

## 💻 Developer Integration

Integrating AccessKey into your Node/TypeScript application requires only a few lines of code.

```typescript
// Initialize AccessKey SDK for autonomous billing
import { AccessKey } from '@accesskey/core';

const sdk = new AccessKey({
  network: 'mainnet',
  provider: window.ethereum
});

// Trustlessly authorize a Session Key
const stream = await sdk.authorize({
  plan: 'ENTERPRISE_NODE_RPC',
  credits: 50_000, 
  ttl: '30d' // Expires in 30 days
});

console.log('Verifiable Stream Active:', stream.id);
```

## 🛠️ Local Development

### Smart Contracts (Foundry)
We use Foundry for comprehensive testing, including integration tests, fuzz tests, and gas snapshots.

```bash
forge install
forge test
forge snapshot
```

### Front-End Application (Vite + React)
The frontend uses Tailwind CSS V4, React 19, and Framer Motion.

```bash
cd frontend
npm install
npm run dev
```

## 📚 Documentation
See the `/docs` folder for detailed architectural specifications:
- [Threat Model](docs/threat-model.md)
- [Architecture](docs/architecture.md)
- [EVM Guide](docs/evm.md)

## 📄 License & Attribution
Copyright (c) 2026 AccessKey Protocol.

This project is licensed under the MIT License. If you intend to use, modify, or distribute any part of this software, **you must include the original copyright notice and give appropriate attribution** by quoting the source. See the `LICENSE` file for more details.
