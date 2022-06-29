import { CollectibleType } from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  ModUpgraded,
  spawnCollectible,
} from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import g from "../globals";
import { getCurrentBaby } from "../utils";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_SLOT_DESTROYED, main);
}

function main(slot: Entity) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // 171
  if (babyType !== RandomBabyType.GAPPY) {
    return;
  }

  // Broken machines drop pedestal items.
  spawnCollectible(CollectibleType.NULL, slot.Position, g.run.rng);
}
