import { CacheFlag } from "isaac-typescript-definitions";
import {
  MIN_PLAYER_SHOT_SPEED_STAT,
  MIN_PLAYER_SPEED_STAT,
  repeat,
} from "isaacscript-common";
import g from "../globals";
import { getCurrentBabyDescription } from "../utils";

export const evaluateCacheBabyFunctionMap = new Map<
  int,
  (player: EntityPlayer, cacheFlag: CacheFlag) => void
>();

// Cute Baby
evaluateCacheBabyFunctionMap.set(
  11,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      // -1 damage per pickup taken.
      repeat(g.run.babyCounters, () => {
        player.Damage -= 1;
      });
    }
  },
);

// Lowface Baby
evaluateCacheBabyFunctionMap.set(
  73,
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

// Derp Baby
evaluateCacheBabyFunctionMap.set(
  78,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      player.Damage *= 0.5;
    }
  },
);

// Lipstick Baby
evaluateCacheBabyFunctionMap.set(
  105,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.RANGE) {
      player.TearHeight *= 2;
    }
  },
);

// Tusks Baby
evaluateCacheBabyFunctionMap.set(
  124,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      player.Damage *= 2;
    }
  },
);

// Cape Baby
evaluateCacheBabyFunctionMap.set(
  152,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      player.MaxFireDelay = 1;
    }
  },
);

// Black Eye Baby
evaluateCacheBabyFunctionMap.set(
  164,
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

// Sick Baby
evaluateCacheBabyFunctionMap.set(
  187,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    // Explosive fly tears
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      player.MaxFireDelay = math.ceil(player.MaxFireDelay * 3);
    }
  },
);

// Blisters Baby
evaluateCacheBabyFunctionMap.set(
  240,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    // This is the minimum shot speed that you can set.
    if (cacheFlag === CacheFlag.SHOT_SPEED) {
      player.ShotSpeed = MIN_PLAYER_SHOT_SPEED_STAT;
    }
  },
);

// Snail Baby
evaluateCacheBabyFunctionMap.set(
  244,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.SPEED) {
      player.MoveSpeed *= 0.5;
    }
  },
);

// Killer Baby
evaluateCacheBabyFunctionMap.set(
  291,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      repeat(g.run.babyCounters, () => {
        player.Damage += 0.2;
      });
    }
  },
);

// Cupcake Baby
evaluateCacheBabyFunctionMap.set(
  321,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.SHOT_SPEED) {
      player.ShotSpeed = 4;
    }
  },
);

// Skinless Baby
evaluateCacheBabyFunctionMap.set(
  322,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      player.Damage *= 2;
    }
  },
);

// Hero Baby
evaluateCacheBabyFunctionMap.set(
  336,
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

// Rabbit Baby
evaluateCacheBabyFunctionMap.set(
  350,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    // Starts with How to Jump; must jump often. Speed has a lower bound of 0.1, so we cannot set it
    // lower than this.
    if (
      cacheFlag === CacheFlag.SPEED &&
      g.g.GetFrameCount() >= g.run.babyFrame
    ) {
      player.MoveSpeed = MIN_PLAYER_SPEED_STAT;
    }
  },
);

// Scared Ghost Baby
evaluateCacheBabyFunctionMap.set(
  369,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.SPEED) {
      player.MoveSpeed *= 2;
    }
  },
);

// Blue Ghost Baby
evaluateCacheBabyFunctionMap.set(
  370,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      player.MaxFireDelay = 1;
    }
  },
);

// Red Ghost Baby
evaluateCacheBabyFunctionMap.set(
  371,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      player.Damage += 10;
    }
  },
);

// Fairyman Baby
evaluateCacheBabyFunctionMap.set(
  385,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      repeat(g.run.babyCounters, () => {
        player.Damage *= 0.7;
      });
    }
  },
);

// Firemage Baby
evaluateCacheBabyFunctionMap.set(
  419,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.LUCK) {
      player.Luck += 13;
    }
  },
);

// Sad Bunny Baby
evaluateCacheBabyFunctionMap.set(
  459,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      repeat(g.run.babyCounters, () => {
        player.MaxFireDelay -= 1;
      });
    }
  },
);

// Voxdog Baby
evaluateCacheBabyFunctionMap.set(
  462,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    // Shockwave tears
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2);
    }
  },
);

// Robbermask Baby
evaluateCacheBabyFunctionMap.set(
  473,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      repeat(g.run.babyCounters, () => {
        player.Damage += 1;
      });
    }
  },
);

// Bubbles Baby
evaluateCacheBabyFunctionMap.set(
  483,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      repeat(g.run.babyCounters, () => {
        player.Damage += 1;
      });
    }
  },
);

// Psychic Baby
evaluateCacheBabyFunctionMap.set(
  504,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    if (cacheFlag === CacheFlag.DAMAGE) {
      player.Damage *= 2;
    }
  },
);

// Twitchy Baby
evaluateCacheBabyFunctionMap.set(
  511,
  (player: EntityPlayer, cacheFlag: CacheFlag) => {
    // Tear rate oscillates
    if (cacheFlag === CacheFlag.FIRE_DELAY) {
      player.MaxFireDelay += g.run.babyCounters;
    }
  },
);
