import {
  DamageFlag,
  EntityType,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, getNPCs, spawn } from "isaacscript-common";
import { g } from "../../globals";
import { EntityDescription } from "../../types/EntityDescription";
import { Baby } from "../Baby";

/** Extra enemies spawn on hit. */
export class ZipperBaby extends Baby {
  @Callback(ModCallback.ENTITY_TAKE_DMG, EntityType.PLAYER)
  entityTakeDmgPlayer(
    entity: Entity,
    _amount: float,
    _damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    const player = entity.ToPlayer();
    if (player === undefined) {
      return undefined;
    }

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
