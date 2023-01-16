import { newRNG, setSeed } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { GlobalsRunBabyExplosion } from "./GlobalsRunBabyExplosion";
import { GlobalsRunBabyNPC } from "./GlobalsRunBabyNPC";
import { GlobalsRunBabyTears } from "./GlobalsRunBabyTears";
import { GlobalsRunLevel } from "./GlobalsRunLevel";
import { GlobalsRunRoom } from "./GlobalsRunRoom";

// Per-run variables
export class GlobalsRun {
  // Tracking per run
  /** Set to true in the `POST_GAME_STARTED` callback. */
  startedRunAsRandomBaby = false;
  babyType: RandomBabyType | null = null;
  drawIntro = false;
  rng = newRNG();

  // Tracking per level
  level = new GlobalsRunLevel();

  // Tracking per room
  room = new GlobalsRunRoom();

  // Temporary variables
  showIntroFrame = 0;
  showVersionFrame = 0;
  /** Used to make the player temporarily invulnerable. */
  invulnerable = false;
  /** Used to make the player temporarily invulnerable. */
  invulnerabilityUntilFrame: int | null = null;
  dealingExtraDamage = false;
  gettingCollectible = false;

  // Baby-specific variables
  babyBool = false;
  babyCounters = 0;
  babyCountersRoom = 0;
  babyFrame = 0;
  babyTears = new GlobalsRunBabyTears();
  babyNPC: GlobalsRunBabyNPC = {
    entityType: 0,
    variant: 0,
    subType: 0,
  };

  babyExplosions: GlobalsRunBabyExplosion[] = [];
  babySprite: Sprite | null = null;

  // Item-specific variables
  flockOfSuccubi = false;
  clockworkAssemblyRNG = newRNG();
  craneGameRNG = newRNG();

  constructor(startSeed: Seed) {
    setSeed(this.rng, startSeed);
    setSeed(this.clockworkAssemblyRNG, startSeed);
    setSeed(this.craneGameRNG, startSeed);
  }
}
