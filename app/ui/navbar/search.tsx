'use client'

import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/app/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/app/components/ui/command";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/app/components/ui/popover";
import { Search, Loader2 } from "lucide-react";
import { NavbarSearchProps, Suggestion } from "@/app/lib/definitions";

export default function NavbarSearch({
                                         placeholder = "Search cryptocharity",
                                         onSearch,
                                         suggestions = [],
                                         className,
                                         debounceMs = 300,
                                         isLoading = false,
                                     }: NavbarSearchProps) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    // корневой контейнер — чтобы понимать, ушёл ли фокус наружу
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Debounce onSearch
    useEffect(() => {
        if (!onSearch) return;
        const handle = setTimeout(() => {
            const q = query.trim();
            if (!q) return;
            onSearch(q);
        }, debounceMs);
        return () => clearTimeout(handle);
    }, [query, debounceMs, onSearch]);

    const grouped = useMemo(() => {
        const map = new Map<string, Suggestion[]>();
        for (const s of suggestions) {
            const key = s.group ?? "Suggestions";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(s);
        }
        return Array.from(map.entries());
    }, [suggestions]);

    function handleItemSelect(val: string) {
        setQuery(val);
        setOpen(false);
        onSearch?.(val);
    }

    // Закрыть, если ушёл фокус из всего поповера
    function handleBlur() {
        setTimeout(() => {
            const active = document.activeElement as HTMLElement | null;
            if (!containerRef.current?.contains(active)) setOpen(false);
        }, 0);
    }

    return (
        <div ref={containerRef} className={className}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className="relative w-full max-w-xs">
                        <Search
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"
                            aria-hidden
                        />
                        <Input
                            placeholder={placeholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onClick={() => setOpen(true)}
                            onBlur={handleBlur}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") setOpen(true);
                                if (e.key === "Escape") setOpen(false);
                            }}
                            className="pl-9 pr-30 cursor-text bg-gray-100 hover:bg-gray-200"
                            aria-label="Search"
                        />
                        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-60">
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-label="Loading" />}
                        </div>
                    </div>
                </PopoverTrigger>

                <PopoverContent
                    className="w-[320px] p-0"
                    align="start"
                    sideOffset={8}
                    onOpenAutoFocus={(e) => e.preventDefault()} // не перехватывать фокус у инпута
                >
                    <Command className="bg-gray-200">
                        <CommandList>
                            <CommandEmpty>No results.</CommandEmpty>

                            <CommandGroup heading="Browse" className="">
                                <CommandItem onSelect={() => handleItemSelect("trending")}>🔥 Trending</CommandItem>
                                <CommandItem onSelect={() => handleItemSelect("popular")}>⭐ Popular</CommandItem>
                                <CommandItem onSelect={() => handleItemSelect("liquid")}>💧 Liquid</CommandItem>
                            </CommandGroup>

                            <CommandGroup heading="Topics">
                                <CommandItem onSelect={() => handleItemSelect("live-crypto")}>📈 Live Crypto</CommandItem>
                                <CommandItem onSelect={() => handleItemSelect("politics")}>🏛 Politics</CommandItem>
                                <CommandItem onSelect={() => handleItemSelect("sports")}>⚽ Sports</CommandItem>
                                <CommandItem onSelect={() => handleItemSelect("tech")}>💻 Tech</CommandItem>
                            </CommandGroup>

                            {grouped.map(([group, items]) => (
                                <CommandGroup key={group} heading={group}>
                                    {items.map((s) => (
                                        <CommandItem key={s.value} onSelect={() => handleItemSelect(s.value)}>
                                            {s.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

