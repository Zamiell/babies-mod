import {
  CacheFlag,
  DamageFlag,
  EffectVariant,
  EntityPartition,
  ModCallback,
  SoundEffect,
} from "isaac-typescript-definitions";
import {
  Callback,
  DISTANCE_OF_GRID_TILE,
  game,
  sfxManager,
  spawnEffect,
  VectorZero,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Shockwave tears. */
export class VoxdogBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const gameFrameCount = game.GetFrameCount();

    for (let i = g.run.room.tears.length - 1; i >= 0; i--) {
      const tear = g.run.room.tears[i];
      if (tear === undefined) {
        error(`Failed to get tear number: ${i}`);
      }

      if ((gameFrameCount - tear.frame) % 2 === 0) {
        const explosion = spawnEffect(
          EffectVariant.ROCK_EXPLOSION,
          0,
          tear.position,
          VectorZero,
          g.p,
        );
        const index = g.r.GetGridIndex(tear.position);
        g.r.DestroyGrid(index, true);
        tear.position = tear.position.add(tear.velocity);

        // If the sound effect plays at full volume, it starts to get annoying.
        sfxManager.Play(SoundEffect.ROCK_CRUMBLE, 0.5, 0);

        // Make the shockwave deal damage to NPCs.
        const damage = g.p.Damage * 1.5;
        const entities = Isaac.FindInRadius(
          tear.position,
          DISTANCE_OF_GRID_TILE,
          EntityPartition.ENEMY,
        );
        for (const entity of entities) {
          if (entity.IsVulnerableEnemy()) {
            entity.TakeDamage(
              damage,
              DamageFlag.EXPLOSION,
              EntityRef(explosion),
              2,
            );
          }
        }
      }

      // Stop if it gets to a wall.
      if (!g.r.IsPositionInRoom(tear.position, 0)) {
        g.run.room.tears.splice(i, 1);
      }
    }
  }

  // 8
  @Callback(ModCallback.EVALUATE_CACHE, CacheFlag.FIRE_DELAY)
  evaluateCacheFireDelay(player: EntityPlayer): void {
    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2);
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const gameFrameCount = game.GetFrameCount();

    tear.Remove();

    g.run.room.tears.push({
      frame: gameFrameCount,
      position: tear.Position,
      velocity: tear.Velocity.Normalized().mul(30),
      num: 0,
    });
  }
}
