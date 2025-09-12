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
    // Чтобы не зациклиться, запомним адрес, для которого уже пытались логиниться
    const lastTriedFor = useRef<string | null>(null);

    useEffect(() => {
        const run = async () => {
            if (locking.current) return;

            // авто-logout, если кошелёк отключился
            if (walletStatus === 'disconnected' && authStatus === 'authenticated') {
                locking.current = true;
                try { await signOut({ redirect: false }); } finally { locking.current = false; }
                lastTriedFor.current = null;
                return;
            }

            // авто-login, если кошелёк подключен, но сессии нет/адрес другой
            if (walletStatus === 'connected' && address) {
                const sessAddr = (session?.user as any)?.address?.toLowerCase();
                const needLogin = authStatus !== 'authenticated' || sessAddr !== address.toLowerCase();
                if (!needLogin) return;

                // не спамим повторными попытками для того же адреса
                if (lastTriedFor.current === address.toLowerCase()) return;

                locking.current = true;
                try {
                    // 1) берём серверный nonce (ставит httpOnly cookie)
                    const r = await fetch('/api/siwe/nonce', { cache: 'no-store' });
                    const { nonce } = await r.json();

                    // 2) готовим SIWE
                    const msg = new SiweMessage({
                        domain: window.location.host,
                        address,
                        statement: 'Sign in to CryptoCharity',
                        uri: window.location.origin,
                        version: '1',
                        chainId, // текущая сеть, не хардкоженный 1
                        nonce,
                    });

                    // 3) подпись
                    const signature = await signMessageAsync({ message: msg.prepareMessage() });

                    // 4) верификация через NextAuth Credentials (JWT)
                    const res = await signIn('credentials', {
                        message: JSON.stringify(msg),
                        signature,
                        redirect: false,
                    });

                    if (!res || (res as any).error) {
                        // верификация не прошла → отключаем кошелёк и чистим сессию
                        disconnect();
                        if (authStatus === 'authenticated') await signOut({ redirect: false });
                        lastTriedFor.current = null;
                        return;
                    }

                    // удачно залогинились
                    lastTriedFor.current = address.toLowerCase();
                } catch (e: any) {
                    disconnect();                       // ← ключевой момент: рвём коннект
                    if (authStatus === 'authenticated') await signOut({ redirect: false });
                    lastTriedFor.current = null;
                } finally {
                    locking.current = false;
                }
            }
        };

        run();
        // реагируем на смену статусов/адреса/сети
    }, [walletStatus, address, authStatus, session?.user, chainId, signMessageAsync, disconnect]);

    return null;
}