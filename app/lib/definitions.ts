
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
