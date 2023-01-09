import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Guppy tears. */
export class MortBaby extends Baby {
  // 42
  @Callback(ModCallback.PRE_TEAR_COLLISION)
  preTearCollision(tear: EntityTear): boolean | undefined {
    if (tear.SubType === 1) {
      g.p.AddBlueFlies(1, g.p.Position, undefined);
    }

    return undefined;
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
