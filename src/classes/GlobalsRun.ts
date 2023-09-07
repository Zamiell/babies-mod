import type { RandomBabyType } from "../enums/RandomBabyType";

// Per-run variables
export class GlobalsRun {
  // Tracking per run
  babyType: RandomBabyType | null = null;

  // Temporary variables
  gettingCollectible = false;
}
