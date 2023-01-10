import {
  CallbackCustom,
  getNPCs,
  isFirstPlayer,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Enemies are fully healed on hit. */
export class CryBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    if (!isFirstPlayer(player)) {
      return undefined;
    }

    for (const npc of getNPCs()) {
      if (npc.IsVulnerableEnemy()) {
        npc.HitPoints = npc.MaxHitPoints;
      }
    }

    return undefined;
  }
}
