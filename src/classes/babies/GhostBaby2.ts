import {
  CallbackCustom,
  GAME_FRAMES_PER_MINUTE,
  ModCallbackCustom,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

const GAME_FRAMES_PER_HOUR = GAME_FRAMES_PER_MINUTE * 60;

/** Constant Maw of the Void effect + flight + blindfolded. */
export class GhostBaby2 extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    g.p.SpawnMawOfVoid(GAME_FRAMES_PER_HOUR);
  }
}
