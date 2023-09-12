import { ItemPoolType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  levelHasRoomType,
  newRNG,
  onFirstFloor,
} from "isaacscript-common";
import { mod } from "../../mod";
import { Baby } from "../Baby";
import { getRandomCollectibleTypeFromPool } from "../features/GetRandomCollectibleTypeFromPool";

const ITEM_POOL_TYPES = [
  ItemPoolType.DEVIL,
  ItemPoolType.ANGEL,
  ItemPoolType.BOSS,
  ItemPoolType.PLANETARIUM,
] as const;

/** Improved Secret Rooms (4 items). */
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

    for (const itemPoolType of ITEM_POOL_TYPES) {
      const position = room.FindFreePickupSpawnPosition(center, 1, true);
      const collectibleType = getRandomCollectibleTypeFromPool(
        itemPoolType,
        rng,
      );
      mod.spawnCollectible(collectibleType, position, rng);
    }
  }
}
