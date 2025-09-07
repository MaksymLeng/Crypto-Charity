'use client';

import {ReactNode, useState} from "react";
import {SessionProvider} from "next-auth/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from 'wagmi';
import type { Chain } from 'wagmi/chains';
import {
    mainnet, polygon, arbitrum, base, bsc, optimism
} from 'wagmi/chains';
import {
    RainbowKitProvider,
    connectorsForWallets
} from '@rainbow-me/rainbowkit';
import {
    metaMaskWallet,
    rabbyWallet,
    okxWallet,
    walletConnectWallet,
    injectedWallet,
    phantomWallet
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';

const CHAINS: readonly [Chain, ...Chain[]] = [mainnet, polygon, arbitrum, base, bsc, optimism ];

const wallets = [
    metaMaskWallet,
    rabbyWallet,
    okxWallet,
    walletConnectWallet,
    injectedWallet,
    phantomWallet,
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

const transports = Object.fromEntries(
    CHAINS.map((ch) => [
        ch.id,
        http(process.env[`NEXT_PUBLIC_RPC_${ch.id}`] /* можно undefined */),
    ])
);

const config = createConfig({
    chains: CHAINS,
    transports,
    connectors
});

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>
                    <RainbowKitProvider>
                        {children}
                    </RainbowKitProvider>
                </WagmiProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
