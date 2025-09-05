import {Magic} from "magic-sdk";
const { Web3 } = require("web3")

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

export type MagicContextType = {
    magic: Magic | null
    web3: typeof Web3 | null
}

// Define the type for the user
export type User = {
    address: string
}

// Define the type for the user context.
export type UserContextType = {
    user: User | null
    fetchUser: () => Promise<void>
}