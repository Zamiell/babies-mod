import { EntityType, ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { getBabyPlayerFromEntity } from "../../utils";
import { Baby } from "../Baby";

/** Fiery tears. */
export class TurtleDragonBaby extends Baby {
  @Callback(ModCallback.POST_FIRE_TEAR)
  postFireTear(tear: EntityTear): void {
    const player = getBabyPlayerFromEntity(tear);
    if (player === undefined) {
      return;
    }

    tear.Remove();

    // If we use the base tear's velocity, the fires have enormous speed and are hard to control.
    const normalizedVelocity = tear.Velocity.Normalized();

    player.ShootRedCandle(normalizedVelocity);
  }

  /** Prevent softlocks with enemies that are immune to fires. */
  @Callback(ModCallback.POST_NPC_UPDATE, EntityType.FLAMING_HOPPER)
  postNPCUpdateFlamingHopper(npc: EntityNPC): void {
    npc.Kill();
  }
}
