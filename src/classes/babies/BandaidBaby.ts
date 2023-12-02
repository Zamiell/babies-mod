import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getRandom,
  inRoomType,
  onFirstFloor,
  spawnCollectible,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** N% chance to spawn a random pedestal item on room clear. */
export class BandaidBaby extends Baby {
  /** Too powerful for the first floor. */
  override isValid(): boolean {
    return !onFirstFloor();
  }

  @CallbackCustom(ModCallbackCustom.POST_ROOM_CLEAR_CHANGED, true)
  postRoomClearChangedTrue(): void {
    const room = game.GetRoom();
    const roomSeed = room.GetSpawnSeed();
    const player = Isaac.GetPlayer();

    if (inRoomType(RoomType.BOSS)) {
      return;
    }

    const collectibleChance = getRandom(roomSeed);
    const num = this.getAttribute("num");

    if (collectibleChance < num) {
      const position = room.FindFreePickupSpawnPosition(
        player.Position,
        1,
        true,
      );
      spawnCollectible(CollectibleType.NULL, position, roomSeed);
    }
  }
}
