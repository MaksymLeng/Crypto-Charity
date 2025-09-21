'use client';

import { useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useAccount, useSignMessage, useDisconnect, useChainId } from 'wagmi';
import { SiweMessage } from 'siwe';

export default function WalletAuthBridge() {
    const { status: authStatus, data: session } = useSession();
    const { address, status: walletStatus } = useAccount();
    const chainId = useChainId();
    const { signMessageAsync } = useSignMessage();
    const { disconnect } = useDisconnect();

    const locking = useRef(false);
    const lastTriedFor = useRef<string | null>(null);

    useEffect(() => {
        const run = async () => {
            if (locking.current) return;

            // авто-logout, если кошелёк отключился
            if (walletStatus === 'disconnected' && authStatus === 'authenticated') {
                locking.current = true;
                try {
                    await signOut({ redirect: false });
                } finally {
                    locking.current = false;
                }
                lastTriedFor.current = null;
                return;
            }

            // авто-login, если кошелёк подключен
            if (walletStatus === 'connected' && address) {
                const u = session?.user as { address?: string } | undefined;
                const sessAddr = typeof u?.address === 'string' ? u.address.toLowerCase() : null;

                const needLogin =
                    authStatus !== 'authenticated' || sessAddr !== address.toLowerCase();
                if (!needLogin) return;

                if (lastTriedFor.current === address.toLowerCase()) return;

                locking.current = true;
                try {
                    // 1) серверный nonce
                    const r = await fetch('/api/siwe/nonce', { cache: 'no-store' });
                    const { nonce } = (await r.json()) as { nonce: string };

                    // 2) SIWE message
                    const msg = new SiweMessage({
                        domain: window.location.host,
                        address,
                        statement: 'Sign in to CryptoCharity',
                        uri: window.location.origin,
                        version: '1',
                        chainId,
                        nonce,
                    });

                    // 3) подпись
                    const signature = await signMessageAsync({ message: msg.prepareMessage() });

                    // 4) верификация через NextAuth
                    const res = (await signIn('credentials', {
                        message: JSON.stringify(msg),
                        signature,
                        redirect: false,
                    })) as { error?: string } | undefined;

                    if (!res || res.error) {
                        disconnect();
                        if (authStatus === 'authenticated') await signOut({ redirect: false });
                        lastTriedFor.current = null;
                        return;
                    }

                    lastTriedFor.current = address.toLowerCase();
                } catch {
                    // если что-то пошло не так — рвём коннект и чистим сессию
                    disconnect();
                    if (authStatus === 'authenticated') await signOut({ redirect: false });
                    lastTriedFor.current = null;
                } finally {
                    locking.current = false;
                }
            }
        };

        void run();
    }, [walletStatus, address, authStatus, session?.user, chainId, signMessageAsync, disconnect]);

    return null;
}