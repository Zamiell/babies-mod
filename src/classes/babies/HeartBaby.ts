import { CollectibleType, SoundEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  inStartingRoom,
  ModCallbackCustom,
  sfxManager,
  useActiveItemTemp,
} from "isaacscript-common";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Dull Razor effect every N seconds. */
export class HeartBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    // Ignore the starting room.
    if (inStartingRoom()) {
      return;
    }

    everyNSeconds(() => {
      useActiveItemTemp(player, CollectibleType.DULL_RAZOR);
      sfxManager.Stop(SoundEffect.ISAAC_HURT_GRUNT);
    }, num);
  }
}
