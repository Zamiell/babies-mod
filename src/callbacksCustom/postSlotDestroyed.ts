import { CollectibleType } from "isaac-typescript-definitions";
import { ModCallbackCustom } from "isaacscript-common";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import { getCurrentBaby } from "../utils";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_SLOT_DESTROYED, main);
}

function main(slot: Entity) {
  const [babyType] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // 171
  if (babyType !== RandomBabyType.GAPPY) {
    return;
  }

  // Broken machines drop pedestal items.
  mod.spawnCollectible(CollectibleType.NULL, slot.Position, g.run.rng);
}
