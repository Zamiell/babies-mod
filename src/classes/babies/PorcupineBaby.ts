import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

// eslint-disable-next-line isaacscript/complete-sentences-jsdoc
/** Wait What? effect every N seconds. */
export class PorcupineBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      useActiveItemTemp(player, CollectibleType.WAIT_WHAT);
    }, num);
  }
}
