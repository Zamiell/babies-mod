import { CollectibleType, RoomType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  levelHasRoomType,
} from "isaacscript-common";
import { mod } from "../../mod";
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

    for (const gridIndex of COLLECTIBLE_GRID_INDEXES) {
      const collectible = mod.spawnCollectible(CollectibleType.NULL, gridIndex);
      collectible.Price = 15; // It will be set to the correct price on the next frame.
      collectible.ShopItemId = -1;
    }
  }
}
