import { EntityType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom, spawn } from "isaacscript-common";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Spawns a fly every N seconds. */
export class CorgiBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      spawn(EntityType.FLY, 0, 0, player.Position);
    }, num);
  }
}
