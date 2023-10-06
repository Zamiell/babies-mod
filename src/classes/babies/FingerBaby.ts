import { GridEntityType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  game,
  isGridIndexAdjacentToDoor,
  spawnGridEntity,
} from "isaacscript-common";
import { everyNSeconds } from "../../utils";
import { Baby } from "../Baby";

/** Spawns a teleporter every N seconds. */
export class FingerBaby extends Baby {
  // 1
  @Callback(ModCallback.POST_UPDATE)
  postUpdate(): void {
    const num = this.getAttribute("num");

    everyNSeconds(() => {
      const room = game.GetRoom();
      const player = Isaac.GetPlayer();
      const gridIndex = room.GetGridIndex(player.Position);

      if (isGridIndexAdjacentToDoor(gridIndex)) {
        return;
      }

      const gridEntity = room.GetGridEntityFromPos(player.Position);
      if (gridEntity === undefined) {
        spawnGridEntity(GridEntityType.TELEPORTER, player.Position);
      }
    }, num);
  }
}
