import { ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  getClosestEntityTo,
  getNPCs,
  getPlayerFromEntity,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Super homing tears. */
export class SkinnyBaby extends Baby {
  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const player = getPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    if (tear.SubType !== 1 || tear.FrameCount < 10) {
      return;
    }

    const npcs = getNPCs();
    const closestEnemy = getClosestEntityTo(
      player,
      npcs,
      (npc: EntityNPC) => npc.IsVulnerableEnemy() && !npc.IsDead(),
    );
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
