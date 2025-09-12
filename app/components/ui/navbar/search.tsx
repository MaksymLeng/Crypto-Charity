'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '@/app/components/ui/shadcn/input';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/app/components/ui/shadcn/command';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/app/components/ui/shadcn/popover';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { NavbarSearchProps, Suggestion} from '@/app/lib/definitions';


export default function NavbarSearch({
                                         placeholder = 'Search cryptocharity',
                                         onSearch,
                                         suggestions = [],
                                         className,
                                         debounceMs = 300,
                                         isLoading = false,
                                         variant = 'light',
                                         size = 'md',
                                         showShortcutHint = false,
                                     }: NavbarSearchProps) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
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
            const key = s.group ?? 'Suggestions';
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

    function handleBlur() {
        setTimeout(() => {
            const active = document.activeElement as HTMLElement | null;
            if (!containerRef.current?.contains(active)) setOpen(false);
        }, 0);
    }

    const sizeCls =
        size === 'lg'
            ? 'h-11 text-sm'
            : size === 'sm'
                ? 'h-9 text-sm'
                : 'h-10 text-sm';

    const variantCls =
        variant === 'dark'
            ? 'bg-white/5 hover:bg-white/10 text-white placeholder:text-white/60 ring-1 ring-white/10 focus-visible:ring-white/20'
            : 'bg-gray-100 hover:bg-gray-200 text-black placeholder:text-black/60';

    return (
        <div ref={containerRef} className={className}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className="relative w-full">
                        <SearchIcon
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70"
                            aria-hidden
                        />
                        <Input
                            placeholder={placeholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onClick={() => setOpen(true)}
                            onBlur={handleBlur}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') setOpen(true);
                                if (e.key === 'Escape') setOpen(false);
                            }}
                            className={[
                                'w-full rounded-xl pl-9 pr-12',
                                sizeCls,
                                variantCls,
                            ].join(' ')}
                            aria-label="Search"
                        />
                        {/* Индикатор загрузки */}
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-70">
                            {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-label="Loading" />}
                        </div>
                        {/* Подсказка '/' как у Polymarket */}
                        {showShortcutHint && (
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                <kbd className="rounded-md border border-white/20 px-1.5 py-0.5 text-[11px] opacity-80">
                                    /
                                </kbd>
                            </div>
                        )}
                    </div>
                </PopoverTrigger>

                <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                    sideOffset={8}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <Command className={variant === 'dark' ? 'bg-white/5 text-white' : 'bg-gray-200'}>
                        <CommandList>
                            <CommandEmpty>No results.</CommandEmpty>

                            <CommandGroup heading="Browse">
                                <CommandItem onSelect={() => handleItemSelect('trending')}>🔥 Trending</CommandItem>
                                <CommandItem onSelect={() => handleItemSelect('popular')}>⭐ Popular</CommandItem>
                                <CommandItem onSelect={() => handleItemSelect('liquid')}>💧 Liquid</CommandItem>
                            </CommandGroup>

                            <CommandGroup heading="Topics">
                                <CommandItem onSelect={() => handleItemSelect('live-crypto')}>📈 Live Crypto</CommandItem>
                                <CommandItem onSelect={() => handleItemSelect('politics')}>🏛 Politics</CommandItem>
                                <CommandItem onSelect={() => handleItemSelect('sports')}>⚽ Sports</CommandItem>
                                <CommandItem onSelect={() => handleItemSelect('tech')}>💻 Tech</CommandItem>
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
