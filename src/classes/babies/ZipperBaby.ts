import type { DamageFlag } from "isaac-typescript-definitions";
import { EntityType, LeechVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getNPCs,
  isSelfDamage,
  onDarkRoom,
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
  entityTakeDmgPlayer(
    player: EntityPlayer,
    _amount: float,
    damageFlags: BitFlags<DamageFlag>,
    _source: EntityRef,
    _countdownFrames: int,
  ): boolean | undefined {
    if (isSelfDamage(damageFlags)) {
      return undefined;
    }

    const room = game.GetRoom();

    // Find an existing enemy in the room.
    const npcs = getNPCs();
    const firstNonBoss = npcs.find(
      (npc) => !npc.IsBoss() && npc.IsVulnerableEnemy(),
    );

    // Spawn a new enemy.
    const dupeEnemyDescription = this.getDupeEntityDescription(firstNonBoss);
    const position = room.FindFreePickupSpawnPosition(player.Position, 1, true);
    spawn(
      dupeEnemyDescription.entityType,
      dupeEnemyDescription.variant,
      dupeEnemyDescription.subType,
      position,
    );

    return undefined;
  }

  /**
   * If there were no non-boss enemies in the room, default to spawning a portal. (However, portals
   * do not work properly on the Dark Room, so use a Kamikaze Leech in that case.
   */
  getDupeEntityDescription(
    firstNonBoss: EntityNPC | undefined,
  ): EntityDescription {
    if (firstNonBoss !== undefined) {
      return {
        entityType: firstNonBoss.Type,
        variant: firstNonBoss.Variant,
        subType: firstNonBoss.SubType,
      };
    }

    if (onDarkRoom()) {
      return {
        entityType: EntityType.LEECH,
        variant: LeechVariant.KAMIKAZE_LEECH,
        subType: 0,
      };
    }

    return {
      entityType: EntityType.PORTAL,
      variant: 0,
      subType: 0,
    };
  }
}
