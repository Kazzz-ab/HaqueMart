"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({ value, min = 1, max = 99, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="size-8"
      >
        <Minus />
      </Button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <Button
        variant="outline"
        size="icon"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="size-8"
      >
        <Plus />
      </Button>
    </div>
  );
}
