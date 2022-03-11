import {
  ModCallbacksCustom,
  ModUpgraded,
  nextSeed,
  spawnCollectible,
} from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../utils";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_SLOT_DESTROYED, main);
}

function main(slot: Entity) {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Gappy Baby
  if (babyType !== 171) {
    return;
  }

  // Broken machines drop pedestal items
  g.run.randomSeed = nextSeed(g.run.randomSeed);
  spawnCollectible(
    CollectibleType.COLLECTIBLE_NULL,
    slot.Position,
    g.run.randomSeed,
  );
}
