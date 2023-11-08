import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  levelHasRoomType,
  newRNG,
  spawnCollectible,
} from "isaacscript-common";
import { Baby } from "../Baby";

const COLLECTIBLE_GRID_INDEXES = [48, 56] as const;

/** Improved shops. */
export class DownwellBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    const coins = player.GetNumCoins();
    return coins >= 10 && levelHasRoomType(RoomType.SHOP);
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_ROOM_REORDERED, RoomType.SHOP)
  postNewRoomReorderedShop(): void {
    const room = game.GetRoom();
    const isFirstVisit = room.IsFirstVisit();
    if (!isFirstVisit) {
      return;
    }

    const seed = room.GetAwardSeed();
    const rng = newRNG(seed);

    for (const gridIndex of COLLECTIBLE_GRID_INDEXES) {
      const collectible = spawnCollectible(
        CollectibleType.NULL,
        gridIndex,
        rng,
      );
      collectible.Price = 15; // It will be set to the correct price on the next frame.
      collectible.ShopItemId = -1;
    }
  }
}
