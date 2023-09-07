import type { RandomBabyType } from "../enums/RandomBabyType";

// Per-run variables
export class GlobalsRun {
  // Tracking per run
  babyType: RandomBabyType | null = null;
  drawIntro = false;

  // Temporary variables
  showVersionFrame = 0;
  gettingCollectible = false;
}
