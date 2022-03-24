import { getRandomSeed, newRNG, setSeed } from "isaacscript-common";
import { TearDescription } from "./TearDescription";

// Per-room variables
export class GlobalsRunRoom {
  clearState: boolean;
  clearDelayFrame: int | null = null;

  rng = newRNG();
  pseudoClear = true;
  doorSlotsModified: int[] = [];

  /** For poops and TNT barrels. */
  softlock = false;

  tears: TearDescription[] = [];

  constructor(clearState = true, roomSeed = getRandomSeed()) {
    this.clearState = clearState;
    setSeed(this.rng, roomSeed);
  }
}
