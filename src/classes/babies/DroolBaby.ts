import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  room: {
    numMonstrosSummoned: 0,
    useMonstrosToothOnFrame: null as int | null,
  },
};

/** Starts with Monstro's Tooth (improved). */
export class DroolBaby extends Baby {
  v = v;

  /** Summon extra Monstro's, spaced apart. */
  // 3
  @Callback(ModCallback.POST_USE_ITEM, CollectibleType.MONSTROS_TOOTH)
  postUseItemMonstrosTooth(): boolean | undefined {
    const num = this.getAttribute("num");

    v.room.numMonstrosSummoned++;
    if (v.room.numMonstrosSummoned === num) {
      v.room.numMonstrosSummoned = 0;
      v.room.useMonstrosToothOnFrame = null;
    } else {
      const gameFrameCount = game.GetFrameCount();
      v.room.useMonstrosToothOnFrame = gameFrameCount + 15;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const room = game.GetRoom();
    const roomClear = room.IsClear();

    if (
      v.room.useMonstrosToothOnFrame !== null &&
      gameFrameCount >= v.room.useMonstrosToothOnFrame
    ) {
      if (roomClear) {
        // The room might have been cleared since the initial Monstro's Tooth activation. If so,
        // cancel the remaining Monstro's.
        v.room.numMonstrosSummoned = 0;
        v.room.useMonstrosToothOnFrame = null;
      } else {
        useActiveItemTemp(player, CollectibleType.MONSTROS_TOOTH);
      }
    }
  }
}
