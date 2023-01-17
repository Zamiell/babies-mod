import { DoorSlot } from "isaac-typescript-definitions";
import { TearDescription } from "./TearDescription";

// Per-room variables
export class GlobalsRunRoom {
  clearDelayFrame: int | null = null;

  pseudoClear = true;
  doorSlotsModified: DoorSlot[] = [];

  /** For poops and TNT barrels. */
  softlock = false;

  tears: TearDescription[] = [];
}
