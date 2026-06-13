"use client";

import Image from "next/image";
import { Leaf, Receipt, HeartHandshake } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale";
import { STORY_IMAGE } from "@/lib/mock-data";

export function StorySection() {
  const { t } = useLocale();

  const points = [
    { icon: Leaf, title: t("story.point1Title"), body: t("story.point1Body") },
    { icon: Receipt, title: t("story.point2Title"), body: t("story.point2Body") },
    { icon: HeartHandshake, title: t("story.point3Title"), body: t("story.point3Body") },
  ];

  return (
    <section
      id="story"
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-border bg-card"
    >
      <div className="grid gap-0 lg:grid-cols-2">
        {/* Image */}
        <div className="relative min-h-64 lg:min-h-full">
          <Image
            src={STORY_IMAGE}
            alt="Considered goods on a workspace"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Copy */}
        <div data-reveal className="flex flex-col justify-center gap-6 p-8 sm:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t("story.eyebrow")}
            </p>
            <h2 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("story.title")}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{t("story.body")}</p>
          </div>

          <ul className="flex flex-col gap-5">
            {points.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
