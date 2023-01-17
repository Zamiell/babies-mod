import { TearDescription } from "./TearDescription";

// Per-room variables
export class GlobalsRunRoom {
  /** For poops and TNT barrels. */
  softlock = false;

  tears: TearDescription[] = [];
}
