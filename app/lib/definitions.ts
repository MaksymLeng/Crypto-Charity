
export type Suggestion = {
    label: string;
    value: string;
    group?: string;
};

export interface NavbarSearchProps {
    placeholder?: string;
    onSearch?: (query: string) => void | Promise<void>;
    suggestions?: Suggestion[];
    hotkeyHint?: string;
    className?: string;
    debounceMs?: number;
    isLoading?: boolean;
    variant?: 'light' | 'dark';
    size?: 'sm' | 'md' | 'lg';
    showShortcutHint?: boolean;
}

export type FundraiserCardProps = {
    slug: string;
    title: string;
    short: string;
    coverUrl?: string | null;
    currency: string;
    goalAmount: number;
    totalRaised: number;
};

export type Step = {
    title: string;
    subtitle?: string;
    image?: { src: string; alt: string; w?: number; h?: number };
    body?: string;
};

export type HowItWorksModalProps = {
    isOpen: boolean;
    onCloseAction: () => void;
    onCompleteAction: () => void;           // вызовем это после 3-го шага
    steps?: Step[];                    // можно пробросить свои шаги
};

export type EventPageProps = { params: Promise<{ slug: string }> };
