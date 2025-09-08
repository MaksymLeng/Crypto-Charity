'use client';

import { useState } from 'react';
import NavbarSearch from "@/app/components/ui/navbar/search";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import WalletAuthBridge from "@/app/components/WalletAuthBridge";
import { Menu } from "lucide-react";
import { useAccount } from 'wagmi';

export default function Navbar () {
    const [open, setOpen] = useState(false);
    const { isConnected } = useAccount();

    return (
        <nav className="w-full py-3 px-3 sm:px-4 border-b border-gray-200/60">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                {/* Лого + название */}
                <div className="flex items-center gap-2 min-w-0">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/crypto-charity-black.svg" alt="Icons cryptocharity" width={24} height={24}/>
                        <span className="text-base sm:text-lg font-semibold truncate">Crypto Charity</span>
                    </Link>
                </div>

                {/* Поиск — на мобилках занимает всю ширину в выпадайке */}
                <div className="hidden md:flex items-center gap-4">
                    <NavbarSearch className="w-64" />
                    {!isConnected && ( // 👈 показываем только если кошелек НЕ подключен
                        <button className="hidden sm:inline-block text-sm text-blue-600 cursor-pointer font-semibold transition transform active:scale-95">
                            How it works
                        </button>
                    )}
                </div>

                {/* Правый блок */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Поджали кнопки, чтобы не ломали строку на md */}
                    <div className="scale-95 origin-right">
                        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
                    </div>
                    <WalletAuthBridge />
                </div>

                {/* Бургер — только на мобилках */}
                <button
                    className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100 active:scale-95 transition"
                    aria-label="Open menu"
                    onClick={() => setOpen(v => !v)}
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Мобильное меню (collapsible) */}
            {open && (
                <div className="md:hidden mt-3 space-y-3">
                    <div className="px-1">
                        <NavbarSearch className="w-full" />
                    </div>

                    <div className="px-1 flex items-center justify-between gap-2">
                        {!isConnected && (
                            <button className="text-sm text-blue-600 font-semibold transition active:scale-95">
                                ⓘ How it works
                            </button>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="scale-95">
                                <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
                            </div>
                            <WalletAuthBridge />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
