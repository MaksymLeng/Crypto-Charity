'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Info } from 'lucide-react';

import NavbarSearch from '@/app/components/ui/navbar/search';
import WalletAuthBridge from '@/app/components/ui/WalletAuthBridge';
import { useState } from 'react';
import HowItWorksModal from "@/app/components/ui/HowItWorksModal"; // ✅

export default function Navbar() {
    const { isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const [showHow, setShowHow] = useState(false); // ✅

    return (
        <nav className="w-full border-b border-white/10 pt-2">
            <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 sm:px-4">
                {/* Левый блок: логотип + название */}
                <div className="flex min-w-0 items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/crypto-charity-white.svg"
                            alt="Crypto Charity"
                            width={28}
                            height={28}
                            priority
                        />
                        <span className="truncate text-lg font-semibold">Crypto Charity</span>
                    </Link>
                </div>

                {/* Центр: большой поиск + How it works */}
                <div className="flex flex-1 items-center justify-center gap-3 px-2">
                    <div className="flex w-full max-w-3xl items-center gap-3">
                        <NavbarSearch
                            className="w-full"
                            placeholder="Search cryptocharity"
                            debounceMs={300}
                            variant="light"
                            size="lg"
                            showShortcutHint
                        />
                        {!isConnected && (
                            <button
                                className="hidden shrink-0 items-center gap-1.5 text-sm text-sky-500 hover:text-sky-400 md:inline-flex active:scale-95 transition cursor-pointer"
                                onClick={() => setShowHow(true)}
                            >
                                <Info className="h-4 w-4" />
                                <span>How it works</span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="hidden items-center gap-3 md:flex">
                    {!isConnected ? (
                        <>
                            <button
                                className="text-sm text-sky-500 active:scale-95 transition cursor-pointer"
                                onClick={openConnectModal ?? undefined}
                            >
                                Log In
                            </button>
                            <button
                                className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-400 active:scale-95 transition cursor-pointer text-white"
                                onClick={openConnectModal ?? undefined}
                            >
                                Sign Up
                            </button>
                        </>
                    ) : (
                        <WalletAuthBridge />
                    )}
                </div>
            </div>
            {!isConnected && (
                <HowItWorksModal
                    isOpen={showHow}
                    onCloseAction={() => setShowHow(false)}
                    onCompleteAction={() => {
                        // после 3-го шага → коннект кошелька
                        openConnectModal?.();
                    }}
                />
            )}
        </nav>
    );
}

