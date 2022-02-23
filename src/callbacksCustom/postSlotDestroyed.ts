import { nextSeed } from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../utils";

export function main(slot: Entity): void {
  const [babyType, , valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Gappy Baby
  if (babyType === 171) {
    // Broken machines drop pedestal items
    g.run.randomSeed = nextSeed(g.run.randomSeed);
    g.g.Spawn(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_COLLECTIBLE,
      slot.Position,
      Vector.Zero,
      undefined,
      CollectibleType.COLLECTIBLE_NULL,
      g.run.randomSeed,
    );
  }
}
