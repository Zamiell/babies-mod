import { DoorSlot } from "isaac-typescript-definitions";
import { getRandomSeed, newRNG, setSeed } from "isaacscript-common";
import { TearDescription } from "./TearDescription";

// Per-room variables
export class GlobalsRunRoom {
  clearDelayFrame: int | null = null;

  rng = newRNG();
  pseudoClear = true;
  doorSlotsModified: DoorSlot[] = [];

  /** For poops and TNT barrels. */
  softlock = false;

  tears: TearDescription[] = [];

  constructor(roomSeed = getRandomSeed()) {
    setSeed(this.rng, roomSeed);
  }
}
