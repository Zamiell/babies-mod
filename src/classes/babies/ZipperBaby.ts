import { EntityType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  getNPCs,
  ModCallbackCustom,
  spawn,
} from "isaacscript-common";
import { Baby } from "../Baby";

interface EntityDescription {
  entityType: EntityType;
  variant: int;
  subType: int;
}

/** Extra enemies spawn on hit. */
export class ZipperBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.ENTITY_TAKE_DMG_PLAYER)
  entityTakeDmgPlayer(player: EntityPlayer): boolean | undefined {
    const room = game.GetRoom();

    // Find an existing enemy in the room.
    const npcs = getNPCs();
    const firstNonBoss = npcs.find(
      (npc) => !npc.IsBoss() && npc.IsVulnerableEnemy(),
    );

    // If there were no non-boss enemies in the room, default to spawning a portal.
    const dupeEnemyDescription: EntityDescription =
      firstNonBoss === undefined
        ? {
            entityType: EntityType.PORTAL,
            variant: 0,
            subType: 0,
          }
        : {
            entityType: firstNonBoss.Type,
            variant: firstNonBoss.Variant,
            subType: firstNonBoss.SubType,
          };

    // Spawn a new enemy.
    const position = room.FindFreePickupSpawnPosition(player.Position, 1, true);
    spawn(
      dupeEnemyDescription.entityType,
      dupeEnemyDescription.variant,
      dupeEnemyDescription.subType,
      position,
    );

    return undefined;
  }
}
