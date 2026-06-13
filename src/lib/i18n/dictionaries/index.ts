import type { LanguageCode } from "../regions";
import en from "./en";
import es from "./es";
import fr from "./fr";
import ar from "./ar";

/** The full dictionary shape, derived from the complete English source. */
export type Dictionary = typeof en;

/** Recursively-optional version of a type, for partial translations. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export const DICTIONARIES: Record<LanguageCode, DeepPartial<Dictionary>> = {
  en,
  es,
  fr,
  ar,
};

export { en };
