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

const GAME_FRAMES_BETWEEN_BROWN_NUGGET_USES = 3;

const v = {
  room: {
    brownNuggetsUsed: 0,
    useBrownNuggetOnFrame: null as int | null,
  },
};

/** Starts with Brown Nugget (improved). */
export class PizzaBaby extends Baby {
  v = v;

  // 3
  @Callback(ModCallback.POST_USE_ITEM, CollectibleType.BROWN_NUGGET)
  postUseItemBrownNugget(): boolean | undefined {
    const gameFrameCount = game.GetFrameCount();

    // Mark to use more Brown Nuggets on future frames.
    if (v.room.brownNuggetsUsed === 0) {
      v.room.brownNuggetsUsed = 1;
      v.room.useBrownNuggetOnFrame =
        gameFrameCount + GAME_FRAMES_BETWEEN_BROWN_NUGGET_USES;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    if (
      v.room.useBrownNuggetOnFrame !== null
      && onOrAfterGameFrame(v.room.useBrownNuggetOnFrame)
    ) {
      useActiveItemTemp(player, CollectibleType.BROWN_NUGGET);

      v.room.brownNuggetsUsed++;
      v.room.useBrownNuggetOnFrame =
        gameFrameCount + GAME_FRAMES_BETWEEN_BROWN_NUGGET_USES;

      if (v.room.brownNuggetsUsed === num) {
        v.room.brownNuggetsUsed = 0;
        v.room.useBrownNuggetOnFrame = null;
      }
    }
  }
}
