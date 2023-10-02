import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, spawnEffect } from "isaacscript-common";
import { isValidForEnemyDeathEffect } from "../../utils";
import { Baby } from "../Baby";

/** Enemies leave a Red Candle fire upon death. */
export class ToastBaby extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    if (!isValidForEnemyDeathEffect(entity)) {
      return;
    }

    spawnEffect(EffectVariant.HOT_BOMB_FIRE, 0, entity.Position);
  }
}
