import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getPlayerFromEntity } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Guppy tears. */
export class MortBaby extends Baby {
  // 42
  @Callback(ModCallback.PRE_TEAR_COLLISION)
  preTearCollision(tear: EntityTear): boolean | undefined {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    if (tear.SubType === 1) {
      player.AddBlueFlies(1, g.p.Position, undefined);
    }

    return undefined;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
