import { ModCallbacksCustom, ModUpgraded, nextSeed } from "isaacscript-common";
import g from "../globals";
import { getCurrentBaby } from "../util";

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
  if (baby.name === "Squirrel Baby") {
    // Starts with Walnut (improved)
    for (let i = 0; i < 5; i++) {
      const position = g.r.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      g.run.randomSeed = nextSeed(g.run.randomSeed);
      g.g.Spawn(
        EntityType.ENTITY_PICKUP,
        PickupVariant.PICKUP_COLLECTIBLE,
        position,
        Vector.Zero,
        undefined,
        0,
        g.run.randomSeed,
      );
    }
  }
}
