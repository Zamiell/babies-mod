import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getClosestEntityTo, getNPCs } from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

const v = {
  room: {
    tearPtrHashes: new Set<PtrHash>(),
  },
};

/** Super homing tears. */
export class SkinnyBaby extends Baby {
  v = v;

  // 40
  @Callback(ModCallback.POST_TEAR_UPDATE)
  postTearUpdate(tear: EntityTear): void {
    const ptrHash = GetPtrHash(tear);
    if (!v.room.tearPtrHashes.has(ptrHash)) {
      return;
    }

    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    if (tear.FrameCount < 10) {
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
    const ptrHash = GetPtrHash(tear);
    v.room.tearPtrHashes.add(ptrHash);
  }
}
