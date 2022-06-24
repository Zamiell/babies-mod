import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  ModUpgraded,
  repeat,
  spawnCollectible,
} from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../utils";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_TRINKET_BREAK,
    walnut,
    TrinketType.WALNUT,
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

  // Starts with Walnut (improved).
  repeat(baby.num, () => {
    const position = g.r.FindFreePickupSpawnPosition(player.Position, 1, true);
    spawnCollectible(CollectibleType.NULL, position, g.run.rng);
  });
}
