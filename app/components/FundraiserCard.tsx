'use client';
import Link from 'next/link';
import {FundraiserCardProps} from "@/app/lib/definitions";
import Image from "next/image";
import { Progress } from "@/app/components/ui/shadcn/progress"

export default function FundraiserCard(props: FundraiserCardProps) {
    const { slug, title, short, coverUrl, currency, goalAmount, totalRaised } = props;
    const pct = Math.min(100, Math.round((totalRaised / Math.max(goalAmount, 1)) * 100));

    return (
        <Link
            href={`/event/${slug}`}
            className="group block rounded-2xl overflow-hidden border border-zinc-200 hover:shadow-lg transition"
        >
            <div className="mt-4 flex items-center gap-3 px-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-200">
                    {coverUrl ? (
                        <Image
                            src={coverUrl}
                            alt={title}
                            fill
                            sizes="56px"
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                            no img
                        </div>
                    )}
                </div>

                <h1 className="text-xl sm:text-3xl font-bold leading-tight">{title}</h1>
            </div>

            <div className="p-4 flex flex-col gap-2">

                <p className="text-sm text-zinc-600 line-clamp-2">{short}</p>

                <div className="mt-2">
                    <div className="h-4 w-full rounded-md bg-zinc-200 overflow-hidden">
                        <Progress value={pct} className="" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-zinc-600">
                        <span>Raised: {totalRaised.toLocaleString()} {currency}</span>
                        <span>Goal: {goalAmount.toLocaleString()} {currency}</span>
                    </div>
                </div>

                <div className="mt-3">
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
            {pct}% funded
          </span>
                </div>
            </div>
        </Link>
    );
}
