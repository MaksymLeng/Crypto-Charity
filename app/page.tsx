'use client'

import NavbarSearch from "@/app/ui/navbar/search";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import WalletAuthBridge from "@/app/components/WalletAuthBridge";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col">
            <nav className="flex flex-wrap items-center justify-between w-full py-6 px-4">
                <div className="flex gap-2">
                    <Image src="/crypto-charity-black.svg" alt="Icons cryptocharity" width={24} height={24}/>
                    <Link href="/" className="text-xl font-semibold">
                        Crypto Charity
                    </Link>
                </div>
                <div className="flex gap-5 items-center">
                    <NavbarSearch/>
                    <button className="text-md text-blue-500 cursor-pointer font-semibold transition transform active:scale-95">How it works</button>
                </div>
                <div>
                    <ConnectButton />
                    <WalletAuthBridge />
                </div>
            </nav>
            <div className="h-px w-full bg-gray-200 my-2"></div>
        </main>
    );
}
