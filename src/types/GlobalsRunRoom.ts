import { NPCDescription } from "./NPCDescription";
import { TearDescription } from "./TearDescription";

// Per-room variables
export class GlobalsRunRoom {
  index = 0;
  lastRoomIndex = 0;

  clearState: boolean;
  clearDelayFrame = 0;

  RNG = 0;
  pseudoClear = true;
  doorsModified: int[] = [];
  buttonsPushed = false;
  softlock = false;
  tears: TearDescription[] = [];
  NPCs: NPCDescription[] = [];

  constructor(roomIndex: int, clearState: boolean, roomSeed: int) {
    this.lastRoomIndex = this.index;
    this.index = roomIndex;

    this.clearState = clearState;
    this.RNG = roomSeed;
  }
}
