import g from "../globals";
import * as misc from "../misc";

export function main(
  entity: Entity,
  damageAmount: float,
  damageFlags: int,
  damageSource: EntityRef,
  damageCountdownFrames: int,
): boolean | null {
  // Local variables
  const [babyType, , valid] = misc.getCurrentBaby();
  if (!valid) {
    return null;
  }

  if (g.run.dealingExtraDamage) {
    return null;
  }

  const babyFunc = functionMap.get(babyType);
  if (babyFunc !== undefined) {
    return babyFunc(
      entity,
      damageAmount,
      damageFlags,
      damageSource,
      damageCountdownFrames,
    );
  }

  return null;
}

const functionMap = new Map<
  int,
  (
    entity: Entity,
    damageAmount: float,
    damageFlags: int,
    damageSource: EntityRef,
    damageCountdownFrames: int,
  ) => boolean | null
>();

// D Baby
functionMap.set(
  101,
  (
    entity,
    _damageAmount,
    _damageFlags,
    damageSource,
    damageCountdownFrames,
  ) => {
    if (
      damageSource.Type === EntityType.ENTITY_EFFECT &&
      damageSource.Variant === EffectVariant.PLAYER_CREEP_RED
    ) {
      // Spawns creep on hit (improved)
      // By default, player creep only deals 2 damage per tick, so increase the damage
      const damage = g.p.Damage * 2;
      entity.TakeDamage(damage, 0, EntityRef(g.p), damageCountdownFrames);
      return false;
    }

    return null;
  },
);

// Fang Demon Baby
functionMap.set(
  281,
  (
    entity,
    _damageAmount,
    _damageFlags,
    damageSource,
    damageCountdownFrames,
  ) => {
    // Make the light beam damage be based on the player's damage
    // (normally, light beams do 2 damage on every tick and are not based on the player's damage)
    if (
      damageSource.Type === EntityType.ENTITY_EFFECT &&
      damageSource.Variant === EffectVariant.CRACK_THE_SKY
    ) {
      const damage = g.p.Damage;
      g.run.dealingExtraDamage = true;
      entity.TakeDamage(damage, 0, EntityRef(g.p), damageCountdownFrames);
      g.run.dealingExtraDamage = false;
      return false;
    }

    return null;
  },
);

// Rider Baby
functionMap.set(
  295,
  (
    entity,
    _damageAmount,
    _damageFlags,
    damageSource,
    damageCountdownFrames,
  ) => {
    // Make the Pony do extra damage
    if (
      damageSource.Type === EntityType.ENTITY_PLAYER &&
      damageSource.Variant === 0
    ) {
      const damage = g.p.Damage * 4;
      g.run.dealingExtraDamage = true;
      entity.TakeDamage(damage, 0, EntityRef(g.p), damageCountdownFrames);
      g.run.dealingExtraDamage = false;
      return false;
    }

    return null;
  },
);

// Boxers Baby
functionMap.set(
  337,
  (
    entity,
    _damageAmount,
    _damageFlags,
    damageSource,
    _damageCountdownFrames,
  ) => {
    if (
      damageSource.Type === EntityType.ENTITY_TEAR &&
      damageSource.Entity.SubType === 1
    ) {
      // Play a random punching-related sound effect
      g.sfx.Play(Isaac.GetSoundIdByName("Fist"), 1, 0, false, 1);

      // Give the tear extra knockback
      // ("damageSource.Velocity" doesn't exist)
      const extraVelocity = damageSource.Entity.Velocity.__mul(5);
      entity.Velocity = entity.Velocity.__add(extraVelocity);
    }

    return null;
  },
);

// Elf Baby
functionMap.set(
  377,
  (
    entity,
    _damageAmount,
    _damageFlags,
    damageSource,
    damageCountdownFrames,
  ) => {
    // Make the Spear of Destiny do extra damage
    // (this does not work if we set effect.CollisionDamage in the PostEffectInit callback;
    // the damage appears to be hard-coded)
    if (
      damageSource.Type === EntityType.ENTITY_EFFECT &&
      damageSource.Variant === EffectVariant.SPEAR_OF_DESTINY
    ) {
      const damage = g.p.Damage * 4;
      g.run.dealingExtraDamage = true;
      entity.TakeDamage(damage, 0, EntityRef(g.p), damageCountdownFrames);
      g.run.dealingExtraDamage = false;
      return false;
    }

    return null;
  },
);

// Astronaut Baby
functionMap.set(
  406,
  (
    _entity,
    _damageAmount,
    _damageFlags,
    damageSource,
    _damageCountdownFrames,
  ) => {
    if (
      damageSource.Type === EntityType.ENTITY_TEAR &&
      damageSource.Entity.SubType === 1
    ) {
      // 5% chance for a black hole to spawn
      math.randomseed(damageSource.Entity.InitSeed);
      const chance = math.random(1, 100);
      if (chance <= 5) {
        Isaac.Spawn(
          EntityType.ENTITY_EFFECT,
          EffectVariant.BLACK_HOLE,
          0,
          damageSource.Position,
          damageSource.Entity.Velocity,
          null,
        );
      }
    }

    return null;
  },
);

// Road Kill Baby
functionMap.set(
  507,
  (
    entity,
    _damageAmount,
    _damageFlags,
    damageSource,
    damageCountdownFrames,
  ) => {
    // Give the Pointy Rib extra damage
    if (
      damageSource.Type === EntityType.ENTITY_FAMILIAR && // 3
      damageSource.Variant === FamiliarVariant.POINTY_RIB // 127
    ) {
      const damage = g.p.Damage * 3;
      g.run.dealingExtraDamage = true;
      entity.TakeDamage(damage, 0, EntityRef(g.p), damageCountdownFrames);
      g.run.dealingExtraDamage = false;
      return false;
    }

    return null;
  },
);
