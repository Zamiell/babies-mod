import {
  DamageFlag,
  DamageFlagZero,
  EffectVariant,
  EntityType,
} from "isaac-typescript-definitions";
import { getRandom, spawnEffect } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";

export const entityTakeDmgEntityBabyFunctionMap = new Map<
  RandomBabyType,
  (
    entity: Entity,
    damageAmount: float,
    damageFlags: BitFlags<DamageFlag>,
    damageSource: EntityRef,
    damageCountdownFrames: int,
  ) => boolean | undefined
>();

// 101
entityTakeDmgEntityBabyFunctionMap.set(
  RandomBabyType.D,
  (
    entity,
    _damageAmount,
    _damageFlags,
    damageSource,
    damageCountdownFrames,
  ) => {
    if (
      damageSource.Type === EntityType.EFFECT &&
      damageSource.Variant === (EffectVariant.PLAYER_CREEP_RED as int)
    ) {
      // Spawns creep on hit (improved). By default, player creep only deals 2 damage per tick, so
      // increase the damage.
      const damage = g.p.Damage * 2;
      entity.TakeDamage(
        damage,
        DamageFlagZero,
        EntityRef(g.p),
        damageCountdownFrames,
      );
      return false;
    }

    return undefined;
  },
);

// 281
entityTakeDmgEntityBabyFunctionMap.set(
  RandomBabyType.FANG_DEMON,
  (
    entity,
    _damageAmount,
    _damageFlags,
    damageSource,
    damageCountdownFrames,
  ) => {
    // Make the light beam damage be based on the player's damage. (Normally, light beams do 2
    // damage on every tick and are not based on the player's damage.)
    if (
      damageSource.Type === EntityType.EFFECT &&
      damageSource.Variant === (EffectVariant.CRACK_THE_SKY as int)
    ) {
      const damage = g.p.Damage;
      g.run.dealingExtraDamage = true;
      entity.TakeDamage(
        damage,
        DamageFlagZero,
        EntityRef(g.p),
        damageCountdownFrames,
      );
      g.run.dealingExtraDamage = false;
      return false;
    }

    return undefined;
  },
);

// 295
entityTakeDmgEntityBabyFunctionMap.set(
  RandomBabyType.RIDER,
  (
    entity,
    _damageAmount,
    _damageFlags,
    damageSource,
    damageCountdownFrames,
  ) => {
    // Make the Pony do extra damage.
    if (damageSource.Type === EntityType.PLAYER && damageSource.Variant === 0) {
      const damage = g.p.Damage * 4;
      g.run.dealingExtraDamage = true;
      entity.TakeDamage(
        damage,
        DamageFlagZero,
        EntityRef(g.p),
        damageCountdownFrames,
      );
      g.run.dealingExtraDamage = false;
      return false;
    }

    return undefined;
  },
);

// 377
entityTakeDmgEntityBabyFunctionMap.set(
  RandomBabyType.ELF,
  (
    entity,
    _damageAmount,
    _damageFlags,
    damageSource,
    damageCountdownFrames,
  ) => {
    // Make the Spear of Destiny do extra damage. (This does not work if we set
    // effect.CollisionDamage in the PostEffectInit callback; the damage appears to be hard-coded.)
    if (
      damageSource.Type === EntityType.EFFECT &&
      damageSource.Variant === (EffectVariant.SPEAR_OF_DESTINY as int)
    ) {
      const damage = g.p.Damage * 4;
      g.run.dealingExtraDamage = true;
      entity.TakeDamage(
        damage,
        DamageFlagZero,
        EntityRef(g.p),
        damageCountdownFrames,
      );
      g.run.dealingExtraDamage = false;
      return false;
    }

    return undefined;
  },
);

// 406
entityTakeDmgEntityBabyFunctionMap.set(
  RandomBabyType.ASTRONAUT,
  (
    _entity,
    _damageAmount,
    _damageFlags,
    damageSource,
    _damageCountdownFrames,
  ) => {
    if (
      damageSource.Type === EntityType.TEAR &&
      damageSource.Entity !== undefined &&
      damageSource.Entity.SubType === 1
    ) {
      // 5% chance for a black hole to spawn.
      const chance = getRandom(damageSource.Entity.InitSeed);
      if (chance <= 0.05) {
        spawnEffect(
          EffectVariant.BLACK_HOLE,
          0,
          damageSource.Position,
          damageSource.Entity.Velocity,
          undefined,
          damageSource.Entity.InitSeed,
        );
      }
    }

    return undefined;
  },
);

// 559
entityTakeDmgEntityBabyFunctionMap.set(
  RandomBabyType.BROTHER_BOBBY,
  (entity, _damageAmount, damageFlags, damageSource, damageCountdownFrames) => {
    if (damageSource.Entity === undefined) {
      return undefined;
    }

    const data = damageSource.Entity.GetData();
    if (data["godHeadTear"] === true) {
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
