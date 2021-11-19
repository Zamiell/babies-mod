import { NPCDescription } from "./NPCDescription";
import { TearDescription } from "./TearDescription";

// Per-room variables
export class GlobalsRunRoom {
  clearState: boolean;
  clearDelayFrame: int | null = null;

  seed = 0;
  pseudoClear = true;
  doorsModified: int[] = [];
  softlock = false;
  tears: TearDescription[] = [];
  NPCs: NPCDescription[] = [];

  constructor(clearState = true, roomSeed = Random()) {
    this.clearState = clearState;
    this.seed = roomSeed;
  }
}
