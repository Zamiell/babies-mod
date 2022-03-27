import {
  GAME_FRAMES_PER_SECOND,
  getEffects,
  spawnEffect,
  VectorZero,
} from "isaacscript-common";
import g from "../globals";
import { EffectVariantCustom } from "../types/EffectVariantCustom";
import { getCurrentBaby } from "../utils";

export const postEffectUpdateBabyFunctionMap = new Map<
  int,
  (effect: EntityEffect) => void
>();

// Mustache Baby
postEffectUpdateBabyFunctionMap.set(66, (effect: EntityEffect) => {
  if (effect.Variant !== EffectVariant.BOOMERANG) {
    return;
  }

  const distance = 30;

  // Check for NPC collision
  const closeEntities = Isaac.FindInRadius(
    effect.Position,
    distance,
    EntityPartition.ENEMY,
  );
  if (closeEntities.length > 0) {
    const closestEntity = closeEntities[0];
    closestEntity.TakeDamage(g.p.Damage, 0, EntityRef(effect), 2);
    effect.Remove();
  }

  // Check for player collision
  const closePlayers = Isaac.FindInRadius(
    effect.Position,
    distance,
    EntityPartition.PLAYER,
  );
  if (closePlayers.length > 0 && effect.FrameCount > 20) {
    effect.Remove();
  }

  // Make boomerangs return to the player
  if (effect.FrameCount >= 26) {
    // "effect.FollowParent(player)" does not work
    const initialSpeed = effect.Velocity.LengthSquared();
    effect.Velocity = g.p.Position.sub(effect.Position);
    effect.Velocity = effect.Velocity.Normalized();
    while (effect.Velocity.LengthSquared() < initialSpeed) {
      effect.Velocity = effect.Velocity.mul(1.1);
    }
  }
});

// Sloppy Baby
postEffectUpdateBabyFunctionMap.set(146, (effect: EntityEffect) => {
  // Shorten the lag time of the missiles
  // (this is not possible in the PostEffectInit callback since "effect.Timeout" is -1)
  if (
    effect.Variant === EffectVariant.TARGET &&
    effect.FrameCount === 1 &&
    // There is a bug where the target will disappear if you have multiple shots
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) && // 2
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) && // 153
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_20_20) && // 245
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_THE_WIZ) && // 358
    !g.p.HasPlayerForm(PlayerForm.PLAYERFORM_BABY) && // 7
    !g.p.HasPlayerForm(PlayerForm.PLAYERFORM_BOOK_WORM) // 10
  ) {
    effect.Timeout = 10; // 9 does not result in a missile coming out
  }
});

// Fang Demon Baby
postEffectUpdateBabyFunctionMap.set(281, (effect: EntityEffect) => {
  // Directed light beams
  if (
    effect.Variant !== EffectVariant.TARGET &&
    effect.Variant !== EffectVariant.OCCULT_TARGET
  ) {
    return;
  }

  const distance = 30;

  const gameFrameCount = g.g.GetFrameCount();
  const [, baby] = getCurrentBaby();
  if (baby.cooldown === undefined) {
    error(`The "cooldown" attribute was not defined for: ${baby.name}`);
  }

  if (effect.FrameCount === 1) {
    // By default, the Marked target spawns at the center of the room,
    // and we want it to be spawned at the player instead
    effect.Position = g.p.Position;
    effect.Visible = true;
  } else if (gameFrameCount >= g.run.babyFrame) {
    // Check to see if there is a nearby NPC
    const closeEntities = Isaac.FindInRadius(
      effect.Position,
      distance,
      EntityPartition.ENEMY,
    );
    if (closeEntities.length > 0) {
      // Fire the beam
      g.run.babyFrame = gameFrameCount + baby.cooldown;
      spawnEffect(
        EffectVariant.CRACK_THE_SKY,
        0,
        effect.Position,
        VectorZero,
        g.p,
      );
    }
  }
});

// Cool Orange Baby
postEffectUpdateBabyFunctionMap.set(485, (effect: EntityEffect) => {
  if (
    effect.Variant === EffectVariantCustom.FETUS_BOSS_TARGET &&
    effect.FrameCount === GAME_FRAMES_PER_SECOND
  ) {
    const rocket = spawnEffect(
      EffectVariantCustom.FETUS_BOSS_ROCKET,
      0,
      effect.Position,
    );
    const rocketHeightOffset = Vector(0, -300);
    rocket.SpriteOffset = rocket.SpriteOffset.add(rocketHeightOffset);
  } else if (effect.Variant === EffectVariantCustom.FETUS_BOSS_ROCKET) {
    const rocketFallSpeed = Vector(0, 30);
    effect.SpriteOffset = effect.SpriteOffset.add(rocketFallSpeed);
    if (effect.SpriteOffset.Y >= 0) {
      Isaac.Explode(effect.Position, undefined, 50); // 49 deals 1 half heart of damage
      effect.Remove();
      const targets = getEffects(EffectVariantCustom.FETUS_BOSS_TARGET);
      if (targets.length > 0) {
        const target = targets[0];
        target.Remove();
      }
    }
  }
});
