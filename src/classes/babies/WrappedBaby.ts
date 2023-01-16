import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Nx Kamikaze effect on hit. */
export class WrappedBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    const num = this.getAttribute("num");

    g.run.babyCounters = num;

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const gameFrameCount = game.GetFrameCount();

    // If the explosions happen too fast, it looks buggy, so do it instead every 3 frames.
    if (gameFrameCount % 3 === 0 && g.run.babyCounters > 0) {
      // This should not cause any damage since the player will have invulnerability frames.
      g.run.babyCounters--;
      useActiveItemTemp(player, CollectibleType.KAMIKAZE);
    }
  }
}
