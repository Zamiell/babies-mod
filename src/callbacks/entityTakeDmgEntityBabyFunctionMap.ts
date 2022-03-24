import { getRandom, newRNG } from "isaacscript-common";
import { RandomBabyType } from "../babies";
import g from "../globals";

export const entityTakeDmgEntityBabyFunctionMap = new Map<
  int,
  (
    entity: Entity,
    damageAmount: float,
    damageFlags: int,
    damageSource: EntityRef,
    damageCountdownFrames: int,
  ) => boolean | void
>();

// D Baby
entityTakeDmgEntityBabyFunctionMap.set(
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

    return undefined;
  },
);

// Fang Demon Baby
entityTakeDmgEntityBabyFunctionMap.set(
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

    return undefined;
  },
);

// Rider Baby
entityTakeDmgEntityBabyFunctionMap.set(
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

    return undefined;
  },
);

// Elf Baby
entityTakeDmgEntityBabyFunctionMap.set(
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

    return undefined;
  },
);

// Astronaut Baby
entityTakeDmgEntityBabyFunctionMap.set(
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
      const rng = newRNG(damageSource.Entity.InitSeed);
      const chance = getRandom(rng);
      if (chance <= 0.05) {
        g.g.Spawn(
          EntityType.ENTITY_EFFECT,
          EffectVariant.BLACK_HOLE,
          damageSource.Position,
          damageSource.Entity.Velocity,
          undefined,
          0,
          damageSource.Entity.InitSeed,
        );
      }
    }
  },
);

// Brother Bobby
entityTakeDmgEntityBabyFunctionMap.set(
  RandomBabyType.BROTHER_BOBBY,
  (entity, _damageAmount, damageFlags, damageSource, damageCountdownFrames) => {
    if (damageSource.Entity === undefined) {
      return undefined;
    }

    const data = damageSource.Entity.GetData();
    if (data.godHeadTear === true) {
      const damage = g.p.Damage;
      g.run.dealingExtraDamage = true;
      entity.TakeDamage(
        damage,
        damageFlags,
        EntityRef(g.p),
        damageCountdownFrames,
      );
      g.run.dealingExtraDamage = false;
      return false;
    }

    return undefined;
  },
);
