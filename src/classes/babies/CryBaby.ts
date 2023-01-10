import { CallbackCustom, getNPCs, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Enemies are fully healed on hit. */
export class CryBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(): boolean | undefined {
    for (const npc of getNPCs()) {
      if (npc.IsVulnerableEnemy()) {
        npc.HitPoints = npc.MaxHitPoints;
      }
    }

    return undefined;
  }
}
