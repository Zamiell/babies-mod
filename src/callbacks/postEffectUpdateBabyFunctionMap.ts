import {
  CollectibleType,
  DamageFlagZero,
  EffectVariant,
  EntityPartition,
  PlayerForm,
} from "isaac-typescript-definitions";
import { game, spawnEffect, VectorZero } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { getCurrentBabyDescription } from "../utilsBaby";

export const postEffectUpdateBabyFunctionMap = new Map<
  RandomBabyType,
  (effect: EntityEffect) => void
>();

// 66
postEffectUpdateBabyFunctionMap.set(
  RandomBabyType.MUSTACHE,
  (effect: EntityEffect) => {
    if (effect.Variant !== EffectVariant.BOOMERANG) {
      return;
    }

    const distance = 30;

    // Check for NPC collision.
    const closeEntities = Isaac.FindInRadius(
      effect.Position,
      distance,
      EntityPartition.ENEMY,
    );
    const closestEntity = closeEntities[0];
    if (closestEntity !== undefined) {
      closestEntity.TakeDamage(
        g.p.Damage,
        DamageFlagZero,
        EntityRef(effect),
        2,
      );
      effect.Remove();
    }

    // Check for player collision.
    const closePlayers = Isaac.FindInRadius(
      effect.Position,
      distance,
      EntityPartition.PLAYER,
    );
    if (closePlayers.length > 0 && effect.FrameCount > 20) {
      effect.Remove();
    }

    // Make boomerangs return to the player.
    if (effect.FrameCount >= 26) {
      // "effect.FollowParent(player)" does not work.
      const initialSpeed = effect.Velocity.LengthSquared();
      effect.Velocity = g.p.Position.sub(effect.Position);
      effect.Velocity = effect.Velocity.Normalized();
      while (effect.Velocity.LengthSquared() < initialSpeed) {
        effect.Velocity = effect.Velocity.mul(1.1);
      }
    }
  },
);

// 146
postEffectUpdateBabyFunctionMap.set(
  RandomBabyType.SLOPPY,
  (effect: EntityEffect) => {
    // Shorten the lag time of the missiles. (This is not possible in the PostEffectInit callback
    // since "effect.Timeout" is -1.)
    if (
      effect.Variant === EffectVariant.TARGET &&
      effect.FrameCount === 1 &&
      // There is a bug where the target will disappear if you have multiple shots.
      !g.p.HasCollectible(CollectibleType.INNER_EYE) && // 2
      !g.p.HasCollectible(CollectibleType.MUTANT_SPIDER) && // 153
      !g.p.HasCollectible(CollectibleType.TWENTY_TWENTY) && // 245
      !g.p.HasCollectible(CollectibleType.WIZ) && // 358
      !g.p.HasPlayerForm(PlayerForm.CONJOINED) && // 7
      !g.p.HasPlayerForm(PlayerForm.BOOKWORM) // 10
    ) {
      effect.Timeout = 10; // 9 does not result in a missile coming out
    }
  },
);

// 281
postEffectUpdateBabyFunctionMap.set(
  RandomBabyType.FANG_DEMON,
  (effect: EntityEffect) => {
    // Directed light beams
    if (
      effect.Variant !== EffectVariant.TARGET &&
      effect.Variant !== EffectVariant.OCCULT_TARGET
    ) {
      return;
    }

    const distance = 30;

    const gameFrameCount = game.GetFrameCount();
    const baby = getCurrentBabyDescription();
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for: ${baby.name}`);
    }

    if (effect.FrameCount === 1) {
      // By default, the Marked target spawns at the center of the room, and we want it to be
      // spawned at the player instead.
      effect.Position = g.p.Position;
      effect.Visible = true;
    } else if (gameFrameCount >= g.run.babyFrame) {
      // Check to see if there is a nearby NPC.
      const closeEntities = Isaac.FindInRadius(
        effect.Position,
        distance,
        EntityPartition.ENEMY,
      );
      if (closeEntities.length > 0) {
        // Fire the beam.
        g.run.babyFrame = gameFrameCount + baby.num;
        spawnEffect(
          EffectVariant.CRACK_THE_SKY,
          0,
          effect.Position,
          VectorZero,
          g.p,
        );
      }
    }
  },
);
