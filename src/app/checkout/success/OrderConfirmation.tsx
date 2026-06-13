"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/context";
import { useLocale } from "@/lib/i18n/locale";
import { Button } from "@/components/ui/button";

interface Props {
  orderId: string;
}

export function OrderConfirmation({ orderId }: Props) {
  const { clearCart } = useCart();
  const { t } = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time post-mount confirmation state
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <div className="mb-6 flex justify-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="size-9 text-primary" strokeWidth={1.6} />
        </span>
      </div>

      <h1 className="font-heading mb-3 text-3xl font-semibold">{t("success.title")}</h1>

      <p className="mb-2 text-muted-foreground">{t("success.body")}</p>

      <p className="mb-10 text-sm text-muted-foreground">
        {t("success.reference")}:{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">{orderId}</code>
      </p>

      <Link href="/">
        <Button size="lg" className="gap-2">
          <ShoppingBag className="size-4" />
          {t("success.continue")}
        </Button>
      </Link>
    </div>
  );
}
