import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getClosestEntityTo, getNPCs } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Super homing tears. */
export class SkinnyBaby extends Baby {
  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    if (tear.SubType !== 1 || tear.FrameCount < 10) {
      return;
    }

    const npcs = getNPCs();
    const filterFunc = (npc: EntityNPC) =>
      npc.IsVulnerableEnemy() && !npc.IsDead();
    const closestEnemy = getClosestEntityTo(g.p, npcs, filterFunc);
    if (closestEnemy === undefined) {
      return;
    }

    const initialSpeed = tear.Velocity.LengthSquared();
    tear.Velocity = closestEnemy.Position.sub(tear.Position);
    tear.Velocity = tear.Velocity.Normalized();
    while (tear.Velocity.LengthSquared() < initialSpeed) {
      tear.Velocity = tear.Velocity.mul(1.1);
    }
  }

  // 61
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    tear.SubType = 1; // Mark that we shot this tear.
  }
}
