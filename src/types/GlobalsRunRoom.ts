import { TearDescription } from "./TearDescription";

// Per-room variables
export class GlobalsRunRoom {
  clearState: boolean;
  clearDelayFrame: int | null = null;

  seed = 0 as Seed;
  pseudoClear = true;
  doorSlotsModified: int[] = [];

  /** For poops and TNT barrels. */
  softlock = false;

  tears: TearDescription[] = [];

  constructor(clearState = true, roomSeed = Random()) {
    this.clearState = clearState;
    this.seed = roomSeed;
  }
}
