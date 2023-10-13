import { CollectibleType, EntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  hasCollectible,
  spawn,
} from "isaacscript-common";
import { EXPLOSIVE_COLLECTIBLE_TYPES } from "../../constantsCollectibleTypes";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

const ANTI_SYNERGY_COLLECTIBLES_WITH_FLIES = [
  CollectibleType.MONSTROS_LUNG, // 229
] as const;

/** Spawns a fly every N seconds. */
export class CorgiBaby extends Baby {
  /** Certain collectibles make the baby too dangerous. */
  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(
      player,
      ...ANTI_SYNERGY_COLLECTIBLES_WITH_FLIES,
      ...EXPLOSIVE_COLLECTIBLE_TYPES,
    );
  }

  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      spawn(EntityType.FLY, 0, 0, player.Position);
    }, num);
  }
}
