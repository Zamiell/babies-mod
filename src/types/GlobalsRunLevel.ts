import PoopDescription from "./PoopDescription";

// Per-level variables
export default class GlobalsRunLevel {
  stage: int;
  stageType: int;
  stageFrame: int;
  roomsEntered = 0;
  trinketGone = false;
  blindfoldedApplied = false;
  killedPoops: PoopDescription[] = [];

  constructor(stage: int, stageType: int, stageFrame: int) {
    this.stage = stage;
    this.stageType = stageType;
    this.stageFrame = stageFrame;
  }
}
