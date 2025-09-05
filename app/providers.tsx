'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import {
    RainbowKitProvider,
    connectorsForWallets
} from '@rainbow-me/rainbowkit';
import {
    metaMaskWallet,
    rabbyWallet,
    okxWallet,
    coinbaseWallet,
    walletConnectWallet,
    injectedWallet,
    // phantomWallet — есть, если хочешь EVM-режим Phantom
    phantomWallet
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';

const wallets = [
    metaMaskWallet,
    rabbyWallet,
    okxWallet,
    coinbaseWallet,
    walletConnectWallet,
    injectedWallet,
    phantomWallet, // опционально (у Phantom есть EVM-режим)
];

const connectors = connectorsForWallets(
    [
    {
        groupName: 'Popular',
        wallets: wallets
    }
    ],
    {
        appName: 'CryptoCharity',
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
    }
);

const config = createConfig({
    chains: [mainnet],
    transports: { [mainnet.id]: http() },
    connectors
});

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <RainbowKitProvider>{children}</RainbowKitProvider>
        </WagmiProvider>
    );
}
