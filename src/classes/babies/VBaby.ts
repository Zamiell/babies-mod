import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

const RING_RADIUS = 5;

/** Electric ring tears. */
export class VBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    g.p.FireTechXLaser(tear.Position, tear.Velocity, RING_RADIUS);
    tear.Remove();
  }
}
