import { CollectibleType, SoundEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  sfxManager,
  useActiveItemTemp,
} from "isaacscript-common";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Monster Manual effect every N seconds. */
export class BoundBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      useActiveItemTemp(player, CollectibleType.MONSTER_MANUAL);
      sfxManager.Stop(SoundEffect.SATAN_GROW);
    }, num);
  }
}
