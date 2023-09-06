import {
  CollectibleType,
  EntityType,
  TrinketType,
} from "isaac-typescript-definitions";
import { doesEntityExist, spawnTrinket } from "isaacscript-common";
import { Baby } from "../Baby";

const TRINKET_PRICE = 10;
const TRINKET_GRID_INDEXES = [32, 34, 40, 42, 92, 94, 100, 102] as const;

/** Starts in a trinket shop. */
export class ThirteenthBaby extends Baby {
  /**
   * We want to ensure that the starting room of the floor is clean (e.g. no Blue Womb, no The
   * Chest, etc.)
   */
  override isValid(player: EntityPlayer): boolean {
    const coins = player.GetNumCoins();
    return coins >= TRINKET_PRICE && !doesEntityExist(EntityType.PICKUP);
  }

  override onAdd(player: EntityPlayer): void {
    const price = player.HasCollectible(CollectibleType.STEAM_SALE)
      ? Math.floor(
          TRINKET_PRICE /
            (player.GetCollectibleNum(CollectibleType.STEAM_SALE) + 1),
        )
      : TRINKET_PRICE;

    for (const gridIndex of TRINKET_GRID_INDEXES) {
      spawnRandomTrinketForSale(gridIndex, price);
    }
  }
}

function spawnRandomTrinketForSale(gridIndex: int, price: int) {
  const trinket = spawnTrinket(TrinketType.NULL, gridIndex);
  trinket.Price = price;
  trinket.AutoUpdatePrice = false;
}
