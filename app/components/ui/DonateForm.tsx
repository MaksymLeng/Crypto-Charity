"use client";

import { useState } from "react";

export default function DonateForm({ currency }: { currency: string }) {
    const [amount, setAmount] = useState("");

    const handleDonate = () => {
        if (!amount || isNaN(Number(amount))) {
            alert("Введите корректную сумму");
            return;
        }
        alert(`Отправляем транзакцию на ${amount} ${currency}`);
        // TODO: здесь реальная интеграция с API или Web3
    };

    return (
        <div className="mt-6 flex gap-3">
            <input
                type="number"
                placeholder="Введите сумму"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="px-3 py-2 border rounded-lg w-40"
            />
            <button
                onClick={handleDonate}
                className="px-4 py-2 rounded-lg bg-black text-white cursor-pointer"
            >
                Donate
            </button>
        </div>
    );
}
