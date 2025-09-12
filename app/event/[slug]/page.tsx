import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navbar from "@/app/components/ui/navbar/navbar";
import DonateForm from '@/app/components/ui/DonateForm';
import {EventPageProps} from "@/app/lib/definitions";

export default async function EventPage({ params }: EventPageProps) {
    const { slug } = await params;

    const fr = await prisma.fundraiser.findUnique({
        where: { slug },
    });
    if (!fr) return notFound();

    const goal = Number(fr.goalAmount);
    const raised = Number(fr.totalRaised);
    const pct = Math.min(100, Math.round((raised / Math.max(goal, 1)) * 100));

    return (
        <main className="flex min-h-screen flex-col">
            <Navbar />
            <div className="h-px w-full bg-gray-200 my-2"></div>
            <div className="p-6 max-w-4xl mx-auto">
                <div className="aspect-[16/9] bg-zinc-100 rounded-2xl overflow-hidden">
                    {fr.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <div className="flex justify-between">
                            <img src={fr.coverUrl} alt={fr.title} className="w-full h-full object-cover" />
                        </div>


                    ) : null}
                </div>
                <h1 className="mt-5 text-3xl font-bold">{fr.title}</h1>

                <div className="mt-5">
                    <div className="h-3 w-full rounded bg-zinc-200 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-zinc-600">
                        <span>Raised: {raised.toLocaleString()} {fr.currency}</span>
                        <span>Goal: {goal.toLocaleString()} {fr.currency}</span>
                    </div>
                </div>

                <DonateForm currency={fr.currency} />

                <p className="mt-5 text-zinc-700 whitespace-pre-line"> {fr.description.replace(/\\n/g, '\n')}
                </p>
            </div>
        </main>
    );
}
