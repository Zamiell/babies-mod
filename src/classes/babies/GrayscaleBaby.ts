import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Delirious effect every N seconds. */
export class GrayscaleBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      useActiveItemTemp(player, CollectibleType.DELIRIOUS);
    }, num);
  }
}
