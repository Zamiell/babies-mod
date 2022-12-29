import { CacheFlag } from "isaac-typescript-definitions";
import {
  game,
  MIN_PLAYER_SHOT_SPEED_STAT,
  MIN_PLAYER_SPEED_STAT,
  repeat,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { getCurrentBabyDescription } from "../utilsBaby";

export const evaluateCacheBabyFunctionMap = new Map<
  RandomBabyType,
  (player: EntityPlayer, cacheFlag: CacheFlag) => void
>();

// 73
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.LOWFACE,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    // 0.5x range
    if (cacheFlag === CacheFlag.RANGE) {
      player.TearHeight /= 2;
      if (player.TearHeight > -5) {
        // Set an absolute minimum range.
        player.TearHeight = -5;
      }
    }
  },
);

// 78
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.DERP,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      player.Damage *= 0.5;
    }
  },
);

// 105
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.LIPSTICK,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.RANGE) {
      player.TearHeight *= 2;
    }
  },
);

// 124
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.TUSKS,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      player.Damage *= 2;
    }
  },
);

// 152
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.CAPE,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      player.MaxFireDelay = 1;
    }
  },
);

// 164
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.BLACK_EYE,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    // Starts with Leprosy, +5 damage on Leprosy breaking.
    if (cacheFlag !== CacheFlag.DAMAGE) {
      return;
    }

    const baby = getCurrentBabyDescription();
    if (baby.num === undefined) {
      error(`The "num" attribute was not defined for: ${baby.name}`);
    }

    // We use the "babyFrame" variable to track how many damage ups we have received.
    player.Damage += g.run.babyFrame * baby.num;
  },
);

// 187
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.SICK,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    // Explosive fly tears
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      player.MaxFireDelay = math.ceil(player.MaxFireDelay * 3);
    }
  },
);

// 240
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.BLISTERS,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    // This is the minimum shot speed that you can set.
    if (cacheFlag === CacheFlag.SHOT_SPEED) {
      player.ShotSpeed = MIN_PLAYER_SHOT_SPEED_STAT;
    }
  },
);

// 244
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.SNAIL,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.SPEED) {
      player.MoveSpeed *= 0.5;
    }
  },
);

// 291
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.KILLER,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      repeat(g.run.babyCounters, () => {
        player.Damage += 0.2;
      });
    }
  },
);

// 321
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.CUPCAKE,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.SHOT_SPEED) {
      player.ShotSpeed = 4;
    }
  },
);

// 322
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.SKINLESS,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      player.Damage *= 2;
    }
  },
);

// 336
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.HERO,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    const hearts = player.GetHearts();
    const soulHearts = player.GetSoulHearts();
    const eternalHearts = player.GetEternalHearts();
    const boneHearts = player.GetBoneHearts();
    const totalHearts = hearts + soulHearts + eternalHearts + boneHearts * 2;

    if (totalHearts <= 2) {
      if (cacheFlag === CacheFlag.DAMAGE) {
        player.Damage *= 3;
      } else if (cacheFlag === CacheFlag.FIRE_DELAY) {
        player.MaxFireDelay = math.ceil(player.MaxFireDelay / 3);
      }
    }
  },
);

// 350
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.RABBIT,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    // Starts with How to Jump; must jump often. Speed has a lower bound of 0.1, so we cannot set it
    // lower than this.
    if (
      cacheFlag === CacheFlag.SPEED &&
      game.GetFrameCount() >= g.run.babyFrame
    ) {
      player.MoveSpeed = MIN_PLAYER_SPEED_STAT;
    }
  },
);

// 369
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.SCARED_GHOST,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.SPEED) {
      player.MoveSpeed *= 2;
    }
  },
);

// 370
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.BLUE_GHOST,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      player.MaxFireDelay = 1;
    }
  },
);

// 371
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.RED_GHOST,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      player.Damage += 10;
    }
  },
);

// 385
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.FAIRYMAN,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      repeat(g.run.babyCounters, () => {
        player.Damage *= 0.7;
      });
    }
  },
);

// 419
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.FIREMAGE,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.LUCK) {
      player.Luck += 13;
    }
  },
);

// 459
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.SAD_BUNNY,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      repeat(g.run.babyCounters, () => {
        player.MaxFireDelay--;
      });
    }
  },
);

// 462
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.VOXDOG,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    // Shockwave tears
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2);
    }
  },
);

// 473
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.ROBBERMASK,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      repeat(g.run.babyCounters, () => {
        player.Damage++;
      });
    }
  },
);

// 483
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.BUBBLES,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      repeat(g.run.babyCounters, () => {
        player.Damage++;
      });
    }
  },
);

// 504
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.PSYCHIC,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      player.Damage *= 2;
    }
  },
);

// 511
evaluateCacheBabyFunctionMap.set(
  RandomBabyType.TWITCHY,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    // Tear rate oscillates
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      player.MaxFireDelay += g.run.babyCounters;
    }
  },
);
