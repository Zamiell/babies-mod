import g from "../globals";
import { getCurrentBaby } from "../misc";

const functionMap = new Map<
  int,
  (player: EntityPlayer, cacheFlag: CacheFlag) => void
>();
export default functionMap;

// Cute Baby
functionMap.set(11, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_DAMAGE) {
    // -1 damage per pickup taken
    for (let i = 1; i <= g.run.babyCounters; i++) {
      player.Damage -= 1;
    }
  }
});

// Lowface Baby
functionMap.set(73, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  // 0.5x range
  if (cacheFlag === CacheFlag.CACHE_RANGE) {
    player.TearHeight /= 2;
    if (player.TearHeight > -5) {
      // Set an absolute minimum range
      player.TearHeight = -5;
    }
  }
});

// Derp Baby
functionMap.set(78, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_DAMAGE) {
    player.Damage *= 0.5;
  }
});

// Lipstick Baby
functionMap.set(105, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_RANGE) {
    player.TearHeight *= 2;
  }
});

// Tusks Baby
functionMap.set(124, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_DAMAGE) {
    player.Damage *= 2;
  }
});

// Cape Baby
functionMap.set(152, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_FIREDELAY) {
    player.MaxFireDelay = 1;
  }
});

// Black Eye Baby
functionMap.set(164, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  // Starts with Leprosy, +5 damage on Leprosy breaking
  if (cacheFlag !== CacheFlag.CACHE_DAMAGE) {
    return;
  }

  const [, baby] = getCurrentBaby();
  if (baby.num === undefined) {
    error(`The "num" attribute was not defined for ${baby.name}.`);
  }

  // We use the "babyFrame" variable to track how many damage ups we have received
  player.Damage += g.run.babyFrame * baby.num;
});

// Sick Baby
functionMap.set(187, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  // Explosive fly tears
  if (cacheFlag === CacheFlag.CACHE_FIREDELAY) {
    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 3);
  }
});

// Blisters Baby
functionMap.set(240, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  // This is the minimum shot speed that you can set
  if (cacheFlag === CacheFlag.CACHE_SHOTSPEED) {
    player.ShotSpeed = 0.6;
  }
});

// Snail Baby
functionMap.set(244, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_SPEED) {
    player.MoveSpeed *= 0.5;
  }
});

// Tabby Baby
functionMap.set(269, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_FIREDELAY) {
    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2);
  }
});

// Killer Baby
functionMap.set(291, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_DAMAGE) {
    for (let i = 1; i <= g.run.babyCounters; i++) {
      player.Damage += 0.2;
    }
  }
});

// Cupcake Baby
functionMap.set(321, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_SHOTSPEED) {
    player.ShotSpeed = 4;
  }
});

// Skinless Baby
functionMap.set(322, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_DAMAGE) {
    player.Damage *= 2;
  }
});

// Hero Baby
functionMap.set(336, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  const hearts = player.GetHearts();
  const soulHearts = player.GetSoulHearts();
  const eternalHearts = player.GetEternalHearts();
  const boneHearts = player.GetBoneHearts();
  const totalHearts = hearts + soulHearts + eternalHearts + boneHearts * 2;

  if (totalHearts <= 2) {
    if (cacheFlag === CacheFlag.CACHE_DAMAGE) {
      player.Damage *= 3;
    } else if (cacheFlag === CacheFlag.CACHE_FIREDELAY) {
      player.MaxFireDelay = math.ceil(player.MaxFireDelay / 3);
    }
  }
});

// Rabbit Baby
functionMap.set(350, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  // Starts with How to Jump; must jump often
  // Speed has a lower bound of 0.1, so we cannot set it lower than this
  if (
    cacheFlag === CacheFlag.CACHE_SPEED &&
    g.g.GetFrameCount() >= g.run.babyFrame
  ) {
    player.MoveSpeed = 0.1;
  }
});

// Scared Ghost Baby
functionMap.set(369, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_SPEED) {
    player.MoveSpeed *= 2;
  }
});

// Blue Ghost Baby
functionMap.set(370, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_FIREDELAY) {
    player.MaxFireDelay = 1;
  }
});

// Red Ghost Baby
functionMap.set(371, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_DAMAGE) {
    player.Damage += 10;
  }
});

// Fairyman Baby
functionMap.set(385, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_DAMAGE) {
    for (let i = 1; i <= g.run.babyCounters; i++) {
      player.Damage *= 0.7;
    }
  }
});

// Firemage Baby
functionMap.set(419, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_LUCK) {
    player.Luck += 13;
  }
});

// Sad Bunny Baby
functionMap.set(459, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_FIREDELAY) {
    for (let i = 1; i <= g.run.babyCounters; i++) {
      player.MaxFireDelay -= 1;
    }
  }
});

// Voxdog Baby
functionMap.set(462, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  // Shockwave tears
  if (cacheFlag === CacheFlag.CACHE_FIREDELAY) {
    player.MaxFireDelay = math.ceil(player.MaxFireDelay * 2);
  }
});

// Robbermask Baby
functionMap.set(473, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_DAMAGE) {
    for (let i = 1; i <= g.run.babyCounters; i++) {
      player.Damage += 1;
    }
  }
});

// Text Baby
functionMap.set(476, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_DAMAGE) {
    player.Damage /= 2;
  }
});

// Bubbles Baby
functionMap.set(483, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  if (cacheFlag === CacheFlag.CACHE_DAMAGE) {
    for (let i = 1; i <= g.run.babyCounters; i++) {
      player.Damage += 1;
    }
  }
});

// Twitchy Baby
functionMap.set(511, (player: EntityPlayer, cacheFlag: CacheFlag) => {
  // Tear rate oscillates
  if (cacheFlag === CacheFlag.CACHE_FIREDELAY) {
    player.MaxFireDelay += g.run.babyCounters;
  }
});
