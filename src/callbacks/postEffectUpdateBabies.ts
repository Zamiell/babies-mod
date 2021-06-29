import { ZERO_VECTOR } from "../constants";
import g from "../globals";
import { getCurrentBaby } from "../misc";
import { EffectVariantCustom } from "../types/enums";

const functionMap = new Map<int, (effect: EntityEffect) => void>();
export default functionMap;

// Mustache Baby
functionMap.set(66, (effect: EntityEffect) => {
  if (effect.Variant === EffectVariant.BOOMERANG) {
    // Check for NPC collision
    const entities = Isaac.FindInRadius(
      effect.Position,
      30,
      EntityPartition.ENEMY,
    );
    if (entities.length > 0) {
      const closestEntity = entities[0];
      closestEntity.TakeDamage(g.p.Damage, 0, EntityRef(effect), 2);
      effect.Remove();
    }

    // Check for player collision
    const players = Isaac.FindInRadius(
      effect.Position,
      30,
      EntityPartition.PLAYER,
    );
    if (players.length > 0 && effect.FrameCount > 20) {
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
  }
});

// Sloppy Baby
functionMap.set(146, (effect: EntityEffect) => {
  // Shorten the lag time of the missiles
  // (this is not possible in the PostEffectInit callback since effect.Timeout is -1)
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
functionMap.set(281, (effect: EntityEffect) => {
  // Directed light beams
  if (effect.Variant !== EffectVariant.TARGET) {
    return;
  }

  const gameFrameCount = g.g.GetFrameCount();
  const [, baby] = getCurrentBaby();
  if (baby.cooldown === undefined) {
    error(`The "cooldown" attribute was not defined for ${baby.name}.`);
  }

  if (effect.FrameCount === 1) {
    // By default, the Marked target spawns at the center of the room,
    // and we want it to be spawned at the player instead
    effect.Position = g.p.Position;
    effect.Visible = true;
  } else if (gameFrameCount >= g.run.babyFrame) {
    // Check to see if there is a nearby NPC
    const entities = Isaac.FindInRadius(
      effect.Position,
      30,
      EntityPartition.ENEMY,
    );
    if (entities.length > 0) {
      // Fire the beam
      g.run.babyFrame = gameFrameCount + baby.cooldown;
      Isaac.Spawn(
        EntityType.ENTITY_EFFECT,
        EffectVariant.CRACK_THE_SKY,
        0,
        effect.Position,
        ZERO_VECTOR,
        g.p,
      );
    }
  }
});

// Cool Orange Baby
functionMap.set(485, (effect: EntityEffect) => {
  if (
    effect.Variant === EffectVariantCustom.FETUS_BOSS_TARGET &&
    effect.FrameCount === 30 // 1 second
  ) {
    const rocket = Isaac.Spawn(
      EntityType.ENTITY_EFFECT,
      EffectVariantCustom.FETUS_BOSS_ROCKET,
      0,
      effect.Position,
      ZERO_VECTOR,
      null,
    );
    const rocketHeightOffset = Vector(0, -300);
    rocket.SpriteOffset = rocket.SpriteOffset.add(rocketHeightOffset);
  } else if (effect.Variant === EffectVariantCustom.FETUS_BOSS_ROCKET) {
    const rocketFallSpeed = Vector(0, 30);
    effect.SpriteOffset = effect.SpriteOffset.add(rocketFallSpeed);
    if (effect.SpriteOffset.Y >= 0) {
      Isaac.Explode(effect.Position, null, 50); // 49 deals 1 half heart of damage
      effect.Remove();
      const targets = Isaac.FindByType(
        EntityType.ENTITY_EFFECT,
        EffectVariantCustom.FETUS_BOSS_TARGET,
      );
      if (targets.length > 0) {
        const target = targets[0];
        target.Remove();
      }
    }
  }
});
