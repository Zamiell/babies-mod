import { PoopDescription } from "./PoopDescription";

// Per-level variables
export class GlobalsRunLevel {
  roomsEntered = 0;
  trinketGone = false;
  blindfoldedApplied = false;
  killedPoops: PoopDescription[] = [];
}
