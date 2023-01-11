import { EffectVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, spawnEffect } from "isaacscript-common";
import { Baby } from "../Baby";

/** Enemies leave a Red Candle fire upon death. */
export class ToastBaby extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    spawnEffect(EffectVariant.HOT_BOMB_FIRE, 0, entity.Position);
  }
}
