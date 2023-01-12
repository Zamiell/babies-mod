import { BabyDescription } from "../types/BabyDescription";

export const UNKNOWN_BABY = {
  name: "Unknown Baby",
  description: "Unknown",
  // This file does not actually exist, but we cannot specify a blank string.
  sprite: "unknown.png",
} as const satisfies BabyDescription;
