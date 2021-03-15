import babies from "../babies";
import GlobalsRun from "./GlobalsRun";

export default class Globals {
  // Contains the mod object; this is filled in after registration
  babiesMod: Mod | null = null;

  // Cached API functions
  g = Game();
  l = Game().GetLevel();
  r = Game().GetRoom();
  // "Isaac.GetPlayer()" will return nil if called from the main menu
  // We use the function instead of setting it to null so that the type is set correctly
  // This is reset in the PostPlayerInit callback
  p = Isaac.GetPlayer(0);
  seeds = Game().GetSeeds();
  itemPool = Game().GetItemPool();
  itemConfig = Isaac.GetItemConfig();
  sfx = SFXManager();
  font = Font();

  // Check for Racing+
  racingPlusEnabled = RacingPlusGlobals !== undefined;

  // Variables per-run
  run: GlobalsRun;

  // A list of all the babies
  babies = babies;

  // A list of the babies that we have chosen so far on this run / multi-character custom challenge
  pastBabies: int[] = [];

  // Used for testing specific babies
  debugBabyNum: number | null = null;

  constructor() {
    // Local variables
    const randomSeed = this.l.GetDungeonPlacementSeed();

    // Load the font
    this.font.Load("font/teammeatfont10.fnt");

    // Variables reset at the beginning of every run
    this.run = new GlobalsRun(randomSeed);
  }
}
