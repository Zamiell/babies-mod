import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  onOrAfterGameFrame,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const SUMMON_MONSTRO_DELAY_GAME_FRAMES = 15;

const v = {
  room: {
    numMonstrosSummoned: 0,
    useMonstrosToothOnGameFrame: null as int | null,
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
      v.room.useMonstrosToothOnGameFrame = null;
    } else {
      const gameFrameCount = game.GetFrameCount();
      v.room.useMonstrosToothOnGameFrame =
        gameFrameCount + SUMMON_MONSTRO_DELAY_GAME_FRAMES;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const room = game.GetRoom();
    const roomClear = room.IsClear();

    if (
      v.room.useMonstrosToothOnGameFrame !== null
      && onOrAfterGameFrame(v.room.useMonstrosToothOnGameFrame)
    ) {
      if (roomClear) {
        // The room might have been cleared since the initial Monstro's Tooth activation. If so,
        // cancel the remaining Monstro's.
        v.room.numMonstrosSummoned = 0;
        v.room.useMonstrosToothOnGameFrame = null;
      } else {
        useActiveItemTemp(player, CollectibleType.MONSTROS_TOOTH);
      }
    }
  }
}
