import { GridEntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  spawnGridEntity,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with Callus + makes spikes. */
export class EyePatchBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    spawnGridEntity(GridEntityType.SPIKES, player.Position, false);
  }
}
