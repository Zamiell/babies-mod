import {
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

/** Shockwave bombs. */
export class SkullBaby extends Baby {
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
        const volume = 0.5;
        sfxManager.Play(SoundEffect.ROCK_CRUMBLE, volume);

        // Make the shockwave deal damage to the player.
        if (tear.position.Distance(g.p.Position) <= 40) {
          g.p.TakeDamage(1, DamageFlag.EXPLOSION, EntityRef(explosion), 2);
        }

        // Make the shockwave deal damage to NPCs.
        const entities = Isaac.FindInRadius(
          tear.position,
          DISTANCE_OF_GRID_TILE,
          EntityPartition.ENEMY,
        );
        for (const entity of entities) {
          const damageAmount = g.p.Damage * 1.5;
          entity.TakeDamage(
            damageAmount,
            DamageFlag.EXPLOSION,
            EntityRef(explosion),
            2,
          );
        }
      }

      // Stop if it gets to a wall.
      if (!g.r.IsPositionInRoom(tear.position, 0)) {
        g.run.room.tears.splice(i, 1);
      }
    }
  }
}
