import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback, getNPCs } from "isaacscript-common";
import { Baby } from "../Baby";

/** Enemies are fully healed on hit. */
export class CryBaby extends Baby {
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    for (const npc of getNPCs()) {
      if (npc.IsVulnerableEnemy()) {
        npc.HitPoints = npc.MaxHitPoints;
      }
    }

    return undefined;
  }
}
