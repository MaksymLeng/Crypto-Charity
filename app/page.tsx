
import { prisma } from '@/lib/prisma';
import Navbar from "@/app/components/ui/navbar/navbar";
import FundraiserCard from '@/app/components/FundraiserCard';

export const revalidate = 60;

export default async function Home() {
    const items = await prisma.fundraiser.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
        take: 30,
        select: {
            slug: true,
            title: true,
            short: true,
            coverUrl: true,
            currency: true,
            goalAmount: true,
            totalRaised: true,
        },
    });

    const data = items.map((i) => ({
        ...i,
        goalAmount: Number(i.goalAmount),
        totalRaised: Number(i.totalRaised),
    }));

    return (
        <main className="flex min-h-screen flex-col">
            <Navbar />
            <div className="h-px w-full bg-gray-200 my-2"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((fr) => (
                    <FundraiserCard key={fr.slug} {...fr} />
                ))}
            </div>
        </main>
    );
}
