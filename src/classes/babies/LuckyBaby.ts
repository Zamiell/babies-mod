import { EffectVariant, TallLadderSubType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  inStartingRoom,
  spawnEffect,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Copied from vanilla. */
const STAIRWAY_GRID_INDEX = 25;

/** Starts with The Stairway (improved). */
export class LuckyBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    if (!inStartingRoom()) {
      return;
    }

    spawnEffect(
      EffectVariant.TALL_LADDER,
      TallLadderSubType.STAIRWAY,
      STAIRWAY_GRID_INDEX,
    );
  }
}
