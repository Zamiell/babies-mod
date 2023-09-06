import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const NUM_BROWN_NUGGET_USES = 20;

const v = {
  room: {
    brownNuggetsUsed: 0,
    useBrownNuggetOnFrame: null as int | null,
  },
};

/** Starts with Brown Nugget (improved). */
export class PizzaBaby extends Baby {
  v = v;

  // 23
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.BROWN_NUGGET)
  preUseItemBrownNugget(): boolean | undefined {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    // Mark to use more Brown Nuggets on future frames.
    if (v.room.brownNuggetsUsed === 0) {
      v.room.brownNuggetsUsed = 1;
      v.room.useBrownNuggetOnFrame = gameFrameCount + num;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    if (
      v.room.useBrownNuggetOnFrame !== null &&
      gameFrameCount >= v.room.useBrownNuggetOnFrame
    ) {
      useActiveItemTemp(player, CollectibleType.BROWN_NUGGET);

      v.room.brownNuggetsUsed++;
      v.room.useBrownNuggetOnFrame = gameFrameCount + num;

      // One fly is already spawned with the initial Brown Nugget activation.
      if (v.room.brownNuggetsUsed === NUM_BROWN_NUGGET_USES - 1) {
        v.room.brownNuggetsUsed = 0;
        v.room.useBrownNuggetOnFrame = null;
      }
    }
  }
}
