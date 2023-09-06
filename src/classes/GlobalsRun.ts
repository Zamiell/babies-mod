import type { RandomBabyType } from "../enums/RandomBabyType";

// Per-run variables
export class GlobalsRun {
  // Tracking per run
  babyType: RandomBabyType | null = null;
  drawIntro = false;

  // Temporary variables
  showIntroFrame = 0;
  showVersionFrame = 0;
  dealingExtraDamage = false;
  gettingCollectible = false;

  /** Initialized to 0 at the beginning of every floor. */
  babyCounters = 0;

  /** Initialized to null at the beginning of every floor. */
  babySprite: Sprite | null = null;
}
