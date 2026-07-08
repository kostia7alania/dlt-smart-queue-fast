import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Tailwind runs with prefix(tw); tailwind-merge must know it to dedupe classes.
const twMerge = extendTailwindMerge({ prefix: "tw" });

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
