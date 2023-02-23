import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  game,
  ModCallbackCustom,
  repeat,
} from "isaacscript-common";
import { g } from "../../globals";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Improved Secret Rooms. */
export class StatueBaby2 extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    const roomType = room.GetType();
    const isFirstVisit = room.IsFirstVisit();
    const center = room.GetCenterPos();
    const num = this.getAttribute("num");

    if (roomType !== RoomType.SECRET || !isFirstVisit) {
      return;
    }

    repeat(num, () => {
      const position = room.FindFreePickupSpawnPosition(center, 1, true);
      mod.spawnCollectible(CollectibleType.NULL, position, g.run.rng);
    });
  }
}
