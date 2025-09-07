'use client';

import { useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { useChainId } from 'wagmi';

export default function WalletAuthBridge() {
    const { status: authStatus, data: session } = useSession();
    const { address, status: walletStatus } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const locking = useRef(false); // защита от повторов
    const chainId = useChainId();

    useEffect(() => {
        const run = async () => {
            if (locking.current) return;

            // 1) Автовход: кошелёк подключился, а сессии нет или адрес другой
            if (walletStatus === 'connected' && address) {
                const sessAddr = (session?.user as any)?.address?.toLowerCase();
                if (authStatus !== 'authenticated' || sessAddr !== address.toLowerCase()) {
                    try {
                        locking.current = true;
                        // берём server-nonce (ставит httpOnly cookie)
                        const r = await fetch('/api/siwe/nonce', { cache: 'no-store' });
                        const { nonce } = await r.json();

                        const msg = new SiweMessage({
                            domain: window.location.host,
                            address,
                            statement: 'Sign in to CryptoCharity',
                            uri: window.location.origin,
                            version: '1',
                            chainId,
                            nonce,
                        });

                        const signature = await signMessageAsync({ message: msg.prepareMessage() });
                        await signIn('credentials', {
                            message: JSON.stringify(msg),
                            signature,
                            redirect: false,
                        });
                    } finally {
                        locking.current = false;
                    }
                }
            }

            // 2) Автовыход: кошелёк отключился — выходим из NextAuth
            if (walletStatus === 'disconnected' && authStatus === 'authenticated') {
                try {
                    locking.current = true;
                    await signOut({ redirect: false });
                } finally {
                    locking.current = false;
                }
            }
        };

        run();
        // реагируем на смену статусов/адреса
    }, [walletStatus, address, authStatus, session?.user, signMessageAsync]);

    return null; // компонент невидимый, просто держит синхронизацию
}
