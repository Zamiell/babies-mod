import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  levelHasRoomType,
  newRNG,
  onFirstFloor,
  repeat,
} from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";

/** Improved Secret Rooms. */
export class StatueBaby2 extends Baby {
  override isValid(): boolean {
    // We do not want players to explicitly reset for this baby, so we exclude it from the first
    // floor.
    return levelHasRoomType(RoomType.SECRET) && !onFirstFloor();
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, RoomType.SECRET)
  postNewRoomReordered(): void {
    const room = game.GetRoom();
    const isFirstVisit = room.IsFirstVisit();

    if (!isFirstVisit) {
      return;
    }

    const center = room.GetCenterPos();
    const seed = room.GetAwardSeed();
    const rng = newRNG(seed);
    const num = this.getAttribute("num");

    repeat(num, () => {
      const position = room.FindFreePickupSpawnPosition(center, 1, true);
      mod.spawnCollectible(CollectibleType.NULL, position, rng);
    });
  }
}
