import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { SiweMessage } from "siwe";
import { cookies } from "next/headers";

export const authConfig = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Ethereum",
            credentials: { message: { label: "Message", type: "text" }, signature: { label: "Signature", type: "text" } },
            async authorize(creds) {
                if (!creds?.message || !creds?.signature) return null;

                const siwe = new SiweMessage(JSON.parse(String(creds.message)));
                const domain = new URL(process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000").host;

                // берём серверный nonce из cookie
                const serverNonce = (await cookies()).get('siwe_nonce')?.value;

                const { success } = await siwe.verify({
                    signature: String(creds.signature),
                    domain,
                    nonce: serverNonce, // сверяем с тем, что положили в cookie
                });
                if (!success) return null;

                const address = siwe.address.toLowerCase();
                const chainId = Number((siwe as any).chainId ?? 1);

                const user = await prisma.user.upsert({
                    where: { address },
                    create: { address, chainId, role: "USER" },
                    update: { chainId },
                });

                return {
                    id: user.id,
                    name: user.address,       // стандартное поле
                    address: user.address,    // кастом
                    role: user.role,          // кастом
                } as any;
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.sub = (user as any).id;
                (token as any).address = (user as any).address ?? user.name;
                (token as any).role = (user as any).role ?? "USER";
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).user = {
                id: token.sub,
                address: (token as any).address,
                role: (token as any).role,
            };
            return session;
        },
    },
} satisfies NextAuthConfig;

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST }, // <- отдаем сами функции
} = NextAuth(authConfig);
