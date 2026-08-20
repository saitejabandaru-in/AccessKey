import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock in-memory usage DB (For demonstration only)
const usageDB: Record<string, number> = {};

// Contract Config (Replace with real contract address / ABI in production)
const ACCESS_KEY_ADDRESS = process.env.ACCESS_KEY_ADDRESS || "0x1234567890123456789012345678901234567890";
const PROVIDER_ADDRESS = process.env.PROVIDER_ADDRESS || "0x1234567890123456789012345678901234567890";

const ABI = [
    "function hasAccess(address user, address provider) external view returns (bool)"
];

// EIP-712 Domain for API Authentication
const DOMAIN = {
    name: 'AccessKey Gateway',
    version: '1',
    chainId: 31337, // Local testnet
    verifyingContract: ACCESS_KEY_ADDRESS
};

const TYPES = {
    AuthRequest: [
        { name: 'wallet', type: 'address' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
        { name: 'resource', type: 'string' }
    ]
};

// In a real app, you would use an RPC provider
// const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
// const contract = new ethers.Contract(ACCESS_KEY_ADDRESS, ABI, provider);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/v1/demo', async (req, res) => {
    try {
        const { wallet, nonce, deadline, resource, signature } = req.body;

        if (!wallet || !nonce || !deadline || !resource || !signature) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        if (Date.now() / 1000 > deadline) {
            return res.status(401).json({ error: 'Signature expired' });
        }

        // 1. Verify EIP-712 Signature
        const value = { wallet, nonce, deadline, resource };
        const recoveredAddress = ethers.verifyTypedData(DOMAIN, TYPES, value, signature);

        if (recoveredAddress.toLowerCase() !== wallet.toLowerCase()) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // 2. Check On-chain Subscription State (Mocked RPC call for demo)
        // const hasAccess = await contract.hasAccess(wallet, PROVIDER_ADDRESS);
        const hasAccess = true; // Hardcoded for this simple gateway demo

        if (!hasAccess) {
            return res.status(403).json({ error: 'No active subscription found' });
        }

        // 3. Increment Off-chain Usage
        const currentUsage = usageDB[wallet] || 0;
        usageDB[wallet] = currentUsage + 1;

        res.json({
            message: 'API request successful',
            resource,
            usage: usageDB[wallet]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`AccessKey API Gateway running on port ${PORT}`);
});
