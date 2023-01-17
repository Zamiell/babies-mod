import { ModCallback } from "isaac-typescript-definitions";
import { Callback, getRoomListIndex } from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** All enemies explode. */
export class WhoreBaby extends Baby {
  // 68
  @Callback(ModCallback.POST_ENTITY_KILL)
  postEntityKill(entity: Entity): void {
    const roomListIndex = getRoomListIndex();

    // We cannot explode enemies in the `POST_ENTITY_KILL` callback due to a crash having to do with
    // black hearts.
    mod.runNextGameFrame(() => {
      const futureRoomListIndex = getRoomListIndex();
      if (futureRoomListIndex !== roomListIndex) {
        return;
      }

      Isaac.Explode(entity.Position, undefined, 50); // 49 deals 1 half heart of damage.
    });
  }
}
