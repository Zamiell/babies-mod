import { EntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getNPCs,
  ModCallbackCustom,
  spawn,
} from "isaacscript-common";
import { g } from "../../globals";
import { EntityDescription } from "../../types/EntityDescription";
import { Baby } from "../Baby";

/** Extra enemies spawn on hit. */
export class ZipperBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    // Find an existing enemy in the room.
    const npcs = getNPCs();
    const firstNonBoss = npcs.find(
      (npc) => !npc.IsBoss() && npc.IsVulnerableEnemy(),
    );

    // If there were no non-boss enemies in the room, default to spawning a portal.
    const dupeEnemyDescription: EntityDescription =
      firstNonBoss === undefined
        ? {
            type: EntityType.PORTAL,
            variant: 0,
            subType: 0,
          }
        : {
            type: firstNonBoss.Type,
            variant: firstNonBoss.Variant,
            subType: firstNonBoss.SubType,
          };

    // Spawn a new enemy.
    const position = g.r.FindFreePickupSpawnPosition(player.Position, 1, true);
    spawn(
      dupeEnemyDescription.type,
      dupeEnemyDescription.variant,
      dupeEnemyDescription.subType,
      position,
    );

    return undefined;
  }
}
