import { BombVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  spawnBomb,
} from "isaacscript-common";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Spawns a Mega Troll Bomb every N seconds. */
export class BluePigBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      spawnBomb(BombVariant.MEGA_TROLL, 0, player.Position);
    }, num);
  }
}
