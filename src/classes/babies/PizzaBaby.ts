import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  game,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Starts with Brown Nugget (improved). */
export class PizzaBaby extends Baby {
  // 23
  @Callback(ModCallback.PRE_USE_ITEM, CollectibleType.BROWN_NUGGET)
  preUseItemBrownNugget(): boolean | undefined {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    // Mark to spawn more of them on subsequent frames.
    if (g.run.babyCounters === 0) {
      g.run.babyCounters = 1;
      g.run.babyFrame = gameFrameCount + num;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();
    const num = this.getAttribute("num");

    if (g.run.babyFrame !== 0 && gameFrameCount >= g.run.babyFrame) {
      g.run.babyCounters++;
      g.run.babyFrame = gameFrameCount + num;
      useActiveItemTemp(player, CollectibleType.BROWN_NUGGET);
      if (g.run.babyCounters === 19) {
        // One is already spawned with the initial trigger.
        g.run.babyCounters = 0;
        g.run.babyFrame = 0;
      }
    }
  }
}
