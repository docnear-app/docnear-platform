'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectChipsProps {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  maxSelections?: number;
}

export function MultiSelectChips({
  options,
  selected,
  onToggle,
  maxSelections,
}: MultiSelectChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        const limitReached =
          maxSelections !== undefined && selected.length >= maxSelections && !isSelected;

        return (
          <button
            key={opt}
            type="button"
            onClick={() => !limitReached && onToggle(opt)}
            disabled={limitReached}
            className={cn(
              'chip-select',
              isSelected ? 'selected' : 'unselected',
              limitReached && 'opacity-40 cursor-not-allowed',
            )}
          >
            {isSelected && <Check size={12} strokeWidth={2.5} />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}
