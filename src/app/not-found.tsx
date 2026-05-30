import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-28 text-center">
      <p className="mb-4 text-8xl font-black text-primary/20 select-none">404</p>
      <h1 className="mb-3 text-2xl font-bold">Page not found</h1>
      <p className="mb-8 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button size="lg">Back to shop</Button>
      </Link>
    </div>
  );
}
