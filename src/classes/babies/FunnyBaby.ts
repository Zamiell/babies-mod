import { BombVariant, ModCallback } from "isaac-typescript-definitions";
import { Callback, spawnBomb } from "isaacscript-common";
import { isValidForEnemyDeathEffect } from "../../utils";
import { Baby } from "../Baby";

/** Enemies spawn Troll Bombs on death. */
export class FunnyBaby extends Baby {
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    if (!isValidForEnemyDeathEffect(entity)) {
      return;
    }

    spawnBomb(BombVariant.TROLL, 0, entity.Position);
  }
}
