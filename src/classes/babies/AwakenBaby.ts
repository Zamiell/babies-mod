import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Constant Telekinesis effect. */
export class AwakenBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    everyNSeconds(() => {
      useActiveItemTemp(player, CollectibleType.TELEKINESIS);
    }, 1);
  }
}
