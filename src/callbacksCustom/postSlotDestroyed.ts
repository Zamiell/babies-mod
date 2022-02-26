import { nextSeed, spawnCollectible } from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../utils";

export function main(slot: Entity): void {
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
