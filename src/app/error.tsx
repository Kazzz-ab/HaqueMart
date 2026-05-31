"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-28 text-center">
      <p className="mb-4 select-none text-8xl font-black text-destructive/20">!</p>
      <h1 className="mb-3 text-2xl font-bold">Something went wrong</h1>
      <p className="mb-8 text-muted-foreground">
        We hit an unexpected error. Please try again — it usually clears up straight away.
      </p>
      <div className="flex justify-center gap-3">
        <Button variant="outline" size="lg" onClick={reset}>
          Try again
        </Button>
        <Link href="/">
          <Button size="lg">Back to shop</Button>
        </Link>
      </div>
    </div>
  );
}
