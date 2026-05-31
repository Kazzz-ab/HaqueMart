"use client";

import { useState } from "react";
import { Mail, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="rounded-2xl bg-primary px-8 py-12 text-center text-primary-foreground">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary-foreground/15">
            <Mail className="size-5" />
          </span>
        </div>

        <h2 className="mb-2 text-2xl font-bold">Get 10% off your first order</h2>
        <p className="mb-6 text-primary-foreground/80">
          Join 12,000+ subscribers. New arrivals, exclusive deals, and styling tips — straight to your inbox.
        </p>

        {submitted ? (
          <div className="animate-in fade-in flex items-center justify-center gap-2 rounded-xl bg-primary-foreground/10 py-4 font-medium">
            <Check className="size-5" />
            You&apos;re in! Check your inbox for your discount code.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email…"
              className="min-w-0 flex-1 rounded-lg border-0 bg-primary-foreground/10 px-4 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
            />
            <Button
              type="submit"
              variant="secondary"
              className="shrink-0 gap-1.5 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Subscribe
              <ArrowRight className="size-4" />
            </Button>
          </form>
        )}

        <p className="mt-4 text-xs text-primary-foreground/50">
          No spam, ever. Unsubscribe any time.
        </p>
      </div>
    </section>
  );
}
