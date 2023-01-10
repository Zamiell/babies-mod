import {
  CardType,
  CollectibleType,
  DamageFlag,
  DamageFlagZero,
  DoorState,
  EntityType,
  UseFlag,
} from "isaac-typescript-definitions";
import {
  addFlag,
  closeDoorFast,
  getDoors,
  getRandom,
  spawnCard,
  useActiveItemTemp,
  VectorZero,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { CollectibleTypeCustom } from "../types/CollectibleTypeCustom";

export const entityTakeDmgPlayerBabyFunctionMap = new Map<
  RandomBabyType,
  (
    player: EntityPlayer,
    amount: float,
    damageFlags: BitFlags<DamageFlag>,
    source: EntityRef,
    countdownFrames: int,
  ) => boolean | undefined
>();

// 301
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.BLOODIED, (player) => {
  const roomClear = g.r.IsClear();

  /** Indexed by target room index. */
  const doorStateMap = new Map<int, DoorState>();

  for (const door of getDoors()) {
    doorStateMap.set(door.TargetRoomIndex, door.State);
  }

  const useFlags = addFlag(UseFlag.NO_ANIMATION, UseFlag.NO_ANNOUNCER_VOICE);
  player.UseCard(CardType.SOUL_CAIN, useFlags);

  if (roomClear) {
    return;
  }

  // Soul of Cain will open all of the doors, but we only want to open the doors to the red rooms.
  for (const door of getDoors()) {
    const oldState = doorStateMap.get(door.TargetRoomIndex);
    if (oldState === undefined) {
      continue;
    }

    if (oldState !== door.State) {
      closeDoorFast(door);
    }
  }

  return undefined;
});

// 308
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.X_MOUTH, (player) => {
  useActiveItemTemp(player, CollectibleType.MOVING_BOX);

  return undefined;
});

// 310
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.STARRY_EYED, (player) => {
  spawnCard(CardType.STARS, player.Position, VectorZero, player);

  return undefined;
});

// 315
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.PUZZLE, (player) => {
  useActiveItemTemp(player, CollectibleType.D6);

  return undefined;
});

// 318
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.FIREBALL,
  (_player, _amount, _damageFlags, damageSource) => {
    // Immunity from fires
    if (damageSource.Type === EntityType.FIREPLACE) {
      return false;
    }

    return undefined;
  },
);

// 330
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.TORTOISE, (_player) => {
  // 0.5x speed + 50% chance to ignore damage.
  const avoidChance = getRandom(g.run.rng);
  if (avoidChance <= 0.5) {
    return false;
  }

  return undefined;
});

// 322
entityTakeDmgPlayerBabyFunctionMap.set(
  RandomBabyType.SKINLESS,
  (player, amount, _damageFlags, _source, countdownFrames) => {
    // Take double damage
    if (!g.run.babyBool) {
      g.run.babyBool = true;
      player.TakeDamage(
        amount,
        DamageFlagZero,
        EntityRef(player),
        countdownFrames,
      );
      g.run.babyBool = false;
    }

    return undefined;
  },
);

// 323
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.BALLERINA, (player) => {
  // Summons a Restock Machine after 6 hits.
  g.run.babyCounters++;
  if (g.run.babyCounters === 6) {
    g.run.babyCounters = 0;
    useActiveItemTemp(player, CollectibleTypeCustom.CLOCKWORK_ASSEMBLY);
  }

  return undefined;
});

// 336
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.HERO, (_player) => {
  // We want to evaluate the cache, but we can't do it here because the damage is not applied yet,
  // so mark to do it later in the `POST_UPDATE` callback.
  g.run.babyBool = true;

  return undefined;
});

// 359
entityTakeDmgPlayerBabyFunctionMap.set(RandomBabyType.TANOOKI, (player) => {
  useActiveItemTemp(player, CollectibleType.MR_ME);

  return undefined;
});
