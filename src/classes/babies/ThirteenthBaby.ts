import {
  CollectibleType,
  EntityType,
  ModCallback,
  PickupVariant,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  Callback,
  doesEntityExist,
  inStartingRoom,
  spawnTrinket,
} from "isaacscript-common";
import { isRerolledCollectibleBuggedHeart } from "../../utils";
import { Baby } from "../Baby";

const TRINKET_PRICE = 10;
const TRINKET_GRID_INDEXES = [32, 34, 40, 42, 92, 94, 100, 102] as const;

/** Starts in a trinket shop. */
export class ThirteenthBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    const coins = player.GetNumCoins();

    return (
      coins >= TRINKET_PRICE &&
      // Ensure that the starting room of the floor is clean (e.g. no Blue Womb, no The Chest, etc.)
      !doesEntityExist(EntityType.PICKUP)
    );
  }

  override onAdd(player: EntityPlayer): void {
    const numSteamSales = player.GetCollectibleNum(CollectibleType.STEAM_SALE);
    const price =
      numSteamSales > 0
        ? Math.floor(TRINKET_PRICE / (numSteamSales + 1))
        : TRINKET_PRICE;

    for (const gridIndex of TRINKET_GRID_INDEXES) {
      const trinket = spawnTrinket(TrinketType.NULL, gridIndex);
      trinket.Price = price;
      trinket.AutoUpdatePrice = false;
    }
  }

  /** Delete rerolled trinkets. */
  // 35
  @Callback(ModCallback.POST_PICKUP_UPDATE, PickupVariant.HEART)
  postPickupUpdateHeart(pickup: EntityPickup): void {
    if (isRerolledCollectibleBuggedHeart(pickup) && inStartingRoom()) {
      pickup.Remove();
    }
  }
}
