import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getRoomListIndex } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** All enemies explode. */
export class WhoreBaby extends Baby {
  override onAdd(): void {
    g.run.babyExplosions = [];
  }

  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const roomListIndex = getRoomListIndex();

    // Perform the explosion that was initiated in the `POST_ENTITY_KILL` callback. We iterate
    // backwards because we need to remove elements from the array.
    for (let i = g.run.babyExplosions.length - 1; i >= 0; i--) {
      const explosion = g.run.babyExplosions[i];
      if (explosion === undefined) {
        error(`Failed to get explosion number: ${i}`);
      }

      if (explosion.roomListIndex === roomListIndex) {
        Isaac.Explode(explosion.position, undefined, 50); // 49 deals 1 half heart of damage.
        g.run.babyExplosions.splice(i, 1);
      }
    }
  }

  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    const roomListIndex = getRoomListIndex();

    // We cannot explode enemies in the `POST_ENTITY_KILL` callback due to a crash having to do with
    // black hearts. So, mark to explode in the `POST_UPDATE` callback.
    g.run.babyExplosions.push({
      roomListIndex,
      position: entity.Position,
    });
  }
}
