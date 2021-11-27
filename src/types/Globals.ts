import { GlobalsRun } from "./GlobalsRun";

export class Globals {
  babiesMod: Mod | null = null;

  // Cached API functions
  g = Game();
  l = Game().GetLevel();
  r = Game().GetRoom();
  // "Isaac.GetPlayer()" will return nil if called from the main menu
  // We "lie" and say that it gets set to an EntityPlayer so that we don't have to do non-null
  // assertions everywhere
  // In reality, the value will be set in the PostPlayerInit callback, which will happen before any
  // other code gets run
  p = Isaac.GetPlayer();
  seeds = Game().GetSeeds();
  itemPool = Game().GetItemPool();
  itemConfig = Isaac.GetItemConfig();
  sfx = SFXManager();
  font = {
    droid: Font(),
  };

  // Variables per-run
  run = new GlobalsRun();

  // A list of the babies that we have chosen so far on this run / multi-character custom challenge
  pastBabies: int[] = [];

  // Used for testing specific babies
  debugBabyNum: number | null = null;
  debugLogging = false;

  constructor() {
    this.font.droid.Load("font/droid.fnt");
  }
}
