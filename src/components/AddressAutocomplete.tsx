"use client";

import { useEffect, useRef, useState } from "react";

interface Suggestion {
  streetLine: string;
  postalCode: string;
  city: string;
  lat: number;
  lng: number;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: Suggestion | null) => void;
  placeholder?: string;
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (value.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(value)}`);
      if (!res.ok) return;
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
      setOpen(true);
      setHighlighted(-1);
    }, 350);

    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const pick = (suggestion: Suggestion) => {
    onChange(suggestion.streetLine);
    onSelect(suggestion);
    setOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        required
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          onSelect(null);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={(e) => {
          if (!open || suggestions.length === 0) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlighted((i) => Math.min(i + 1, suggestions.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlighted((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter" && highlighted >= 0) {
            e.preventDefault();
            pick(suggestions[highlighted]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder={placeholder ?? "Numéro et rue"}
        autoComplete="off"
        className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink"
      />
      {open && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-border bg-white shadow-lg">
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <li key={`${s.lat}-${s.lng}`}>
                <button
                  type="button"
                  onClick={() => pick(s)}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`block w-full px-4 py-2 text-left text-sm text-ink ${
                    i === highlighted ? "bg-secondary" : "hover:bg-secondary"
                  }`}
                >
                  {s.streetLine}, {s.postalCode} {s.city}
                </button>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-muted">
              Aucune adresse trouvée en Île-de-France
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
