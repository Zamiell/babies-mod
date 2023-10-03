import {
  CollectibleType,
  DamageFlagZero,
  EffectVariant,
  EntityPartition,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback, spawnEffect } from "isaacscript-common";
import { Baby } from "../Baby";

const BOOMERANG_DISTANCE = 30;

/** Boomerang tears. */
export class MustacheBaby extends Baby {
  /** Boomerangs remove Ipecac explosions. */
  override isValid(player: EntityPlayer): boolean {
    return !player.HasCollectible(CollectibleType.IPECAC);
  }

  // 55
  @Callback(ModCallback.POST_EFFECT_UPDATE, EffectVariant.BOOMERANG)
  postEffectUpdateBoomerang(effect: EntityEffect): void {
    const player = Isaac.GetPlayer();

    // Check for NPC collision.
    const closeEntities = Isaac.FindInRadius(
      effect.Position,
      BOOMERANG_DISTANCE,
      EntityPartition.ENEMY,
    );
    const closestEntity = closeEntities[0];
    if (closestEntity !== undefined) {
      effect.Remove();
      closestEntity.TakeDamage(
        player.Damage,
        DamageFlagZero,
        EntityRef(effect),
        2,
      );
      return;
    }

    // Check for player collision.
    const closePlayers = Isaac.FindInRadius(
      effect.Position,
      BOOMERANG_DISTANCE,
      EntityPartition.PLAYER,
    );
    if (closePlayers.length > 0 && effect.FrameCount > 20) {
      effect.Remove();
      return;
    }

    // Make boomerangs return to the player.
    if (effect.FrameCount >= 26) {
      // `effect.FollowParent(player)` does not work.
      const initialSpeed = effect.Velocity.LengthSquared();
      effect.Velocity = player.Position.sub(effect.Position);
      effect.Velocity = effect.Velocity.Normalized();
      while (effect.Velocity.LengthSquared() < initialSpeed) {
        effect.Velocity = effect.Velocity.mul(1.1);
      }
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    // We can't activate The Boomerang item because there is no way to avoid a long cooldown.
    // Instead, we spawn a boomerang effect.
    tear.Remove();
    spawnEffect(
      EffectVariant.BOOMERANG,
      0,
      tear.Position,
      tear.Velocity,
      tear.SpawnerEntity,
      tear.InitSeed,
    );
  }
}
