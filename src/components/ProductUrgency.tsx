"use client";

import { useState, useEffect } from "react";
import { Eye, Clock } from "lucide-react";

interface Props {
  viewingSeed: number;
  inStock: boolean;
}

function useDispatchCountdown() {
  const [label, setLabel] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(15, 0, 0, 0);
      if (now >= cutoff) cutoff.setDate(cutoff.getDate() + 1);
      const diff = cutoff.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setLabel(`${h}h ${m}m`);
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return label;
}

export function ProductUrgency({ viewingSeed, inStock }: Props) {
  const [viewing, setViewing] = useState(viewingSeed);
  const countdown = useDispatchCountdown();

  useEffect(() => {
    const id = setInterval(() => {
      setViewing((v) => Math.max(3, v + Math.floor(Math.random() * 3) - 1));
    }, 8_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
      <div className="flex items-center gap-2.5">
        <Eye className="size-4 shrink-0 text-primary" />
        <span className="text-muted-foreground">
          <strong className="font-semibold text-foreground">{viewing} people</strong> are viewing this right now
        </span>
      </div>
      {inStock && countdown && (
        <div className="flex items-center gap-2.5">
          <Clock className="size-4 shrink-0 text-orange-500" />
          <span className="text-muted-foreground">
            Order in{" "}
            <strong className="font-semibold text-orange-600">{countdown}</strong> for next-day dispatch
          </span>
        </div>
      )}
    </div>
  );
}
