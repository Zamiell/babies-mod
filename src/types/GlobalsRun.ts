import { getRandomSeed, newRNG, setSeed } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { GlobalsRunBabyExplosion } from "./GlobalsRunBabyExplosion";
import { GlobalsRunBabyTears } from "./GlobalsRunBabyTears";

// Per-run variables
export class GlobalsRun {
  // Tracking per run
  /** Set to true in the `POST_GAME_STARTED` callback. */
  startedRunAsRandomBaby = false;
  babyType: RandomBabyType | null = null;
  drawIntro = false;
  rng = newRNG();

  // Temporary variables
  showIntroFrame = 0;
  showVersionFrame = 0;
  /** Used to make the player temporarily invulnerable. */
  invulnerable = false;
  dealingExtraDamage = false;
  gettingCollectible = false;

  // Baby-specific variables
  /** Initialized to false at the beginning of every floor. */
  babyBool = false;
  /** Initialized to 0 at the beginning of every floor. */
  babyCounters = 0;
  /** Initialized to 0 at the beginning of every room. */
  babyCountersRoom = 0;
  /** Initialized to 0 at the beginning of every floor. */
  babyFrame = 0;
  /** Initialized at the beginning of every room. */
  babyTears = new GlobalsRunBabyTears();

  babyExplosions: GlobalsRunBabyExplosion[] = [];
  babySprite: Sprite | null = null;

  constructor(startSeed = getRandomSeed()) {
    setSeed(this.rng, startSeed);
  }
}
