import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import { ModCallbackCustom, repeat } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_TRINKET_BREAK,
    walnut,
    TrinketType.WALNUT,
  );
}

function walnut(player: EntityPlayer) {
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // 268
  if (babyType !== RandomBabyType.SQUIRREL) {
    return;
  }

  if (baby.num === undefined) {
    error('Squirrel Baby does not have a "num" property defined.');
  }

  // Starts with Walnut (improved).
  repeat(baby.num, () => {
    const position = g.r.FindFreePickupSpawnPosition(player.Position, 1, true);
    mod.spawnCollectible(CollectibleType.NULL, position, g.run.rng);
  });
}
