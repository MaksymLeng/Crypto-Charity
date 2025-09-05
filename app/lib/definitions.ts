
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


// Define the type for the user
export type User = {
    address: string
}
