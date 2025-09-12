'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { HowItWorksModalProps, Step } from '@/app/lib/definitions';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/app/components/ui/shadcn/dialog';
import {dataSteps} from "@/data/steps";

export default function HowItWorksModal({isOpen, onCloseAction, onCompleteAction, steps}: HowItWorksModalProps) {

    const data: Step[] = steps ?? dataSteps;
    const [step, setStep] = useState(0);
    const last = step === data.length - 1;

    useEffect(() => { if (isOpen) setStep(0); }, [isOpen]);

    const onOpenChange = (open: boolean) => {
        if (!open) {
            onCloseAction();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="p-0 sm:px-4 overflow-hidden rounded-2xl bg-white text-gray-900 max-w-md gap-0"
            >

                {data[step].image && (
                    <div className="w-full">
                        <Image
                            src={data[step].image!.src}
                            alt={data[step].image!.alt}
                            width={1600}
                            height={900}
                            className="w-full h-80 object-cover object-[center_20%]"
                            priority
                        />
                    </div>
                )}

                <div className="p-5 sm:p-6">
                    <DialogHeader className="space-y-1">
                        <DialogTitle className="text-center text-xl font-semibold">
                            {data[step].title}
                        </DialogTitle>
                        {data[step].subtitle && (
                            <DialogDescription className="text-center text-gray-600">
                                {data[step].subtitle}
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    {data[step].body && (
                        <p className="mt-3 text-center text-gray-600">{data[step].body}</p>
                    )}

                    {/* Кнопки */}
                    <div className="mt-6 flex gap-2">
                        <button
                            onClick={() => (step > 0 ? setStep(step - 1) : onCloseAction())}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 active:scale-95 transition"
                        >
                            {step > 0 ? 'Back' : 'Close'}
                        </button>
                        <button
                            onClick={() => {
                                if (!last) return setStep(step + 1);
                                onCloseAction();
                                onCompleteAction();
                            }}
                            className="flex-1 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400 active:scale-95 transition"
                        >
                            {last ? 'Connect wallet' : 'Next'}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
