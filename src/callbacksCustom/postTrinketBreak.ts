import {
  ModCallbacksCustom,
  ModUpgraded,
  nextSeed,
  repeat,
  spawnCollectible,
} from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../utils";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbacksCustom.MC_POST_TRINKET_BREAK,
    walnut,
    TrinketType.TRINKET_WALNUT,
  );
}

function walnut(player: EntityPlayer) {
  const [, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // 268
  if (baby.name !== "Squirrel Baby") {
    return;
  }

  if (baby.num === undefined) {
    error('Squirrel Baby does not have a "num" property defined.');
  }

  // Starts with Walnut (improved)
  repeat(baby.num, () => {
    const position = g.r.FindFreePickupSpawnPosition(player.Position, 1, true);
    g.run.randomSeed = nextSeed(g.run.randomSeed);
    spawnCollectible(
      CollectibleType.COLLECTIBLE_NULL,
      position,
      g.run.randomSeed,
    );
  });
}
