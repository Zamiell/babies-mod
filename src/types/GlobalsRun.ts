import { GlobalsRunBabyExplosion } from "./GlobalsRunBabyExplosion";
import { GlobalsRunBabyNPC } from "./GlobalsRunBabyNPC";
import { GlobalsRunBabyTears } from "./GlobalsRunBabyTears";
import { GlobalsRunLevel } from "./GlobalsRunLevel";
import { GlobalsRunRoom } from "./GlobalsRunRoom";

// Per-run variables
export class GlobalsRun {
  // Tracking per run
  /** Set to true in the PostGameStarted callback. */
  startedRunAsRandomBaby = false;
  babyType: number | null = null;
  drawIntro = false;
  /** Keep track of all of the collectibles that we pick up over the course of the run. */
  passiveCollectibles: int[] = [];
  randomSeed: int;

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

  // Baby-specific variables
  babyBool = false;
  babyCounters = 0;
  babyCountersRoom = 0;
  babyFrame = 0;
  babyTears = new GlobalsRunBabyTears();
  babyNPC: GlobalsRunBabyNPC = {
    type: 0,
    variant: 0,
    subType: 0,
  };

  babyExplosions: GlobalsRunBabyExplosion[] = [];
  babySprite: Sprite | null = null;

  // Item-specific variables
  flockOfSuccubi = false;
  clockworkAssemblySeed = 0;
  craneGameSeed = 0;

  constructor(randomSeed = Random()) {
    this.randomSeed = randomSeed;
    this.clockworkAssemblySeed = randomSeed;
    this.craneGameSeed = randomSeed;
  }
}
