import {
  CollectibleType,
  LevelStage,
  TrinketType,
} from "isaac-typescript-definitions";
import { getEffectiveStage, onStage, spawnTrinket } from "isaacscript-common";
import { Baby } from "../Baby";

const TRINKET_PRICE = 10;
const TRINKET_GRID_INDEXES = [32, 34, 40, 42, 92, 94, 100, 102] as const;

/** Starts in a trinket shop. */
export class ThirteenthBaby extends Baby {
  /**
   * - The player won't have any resources to spend on trinkets on the first floor or second floor.
   * - We want to ensure that the starting room of the floor is clean (e.g. no Blue Womb, no The
   *   Chest, etc.)
   */
  override isValid(player: EntityPlayer): boolean {
    const coins = player.GetNumCoins();
    return (
      coins >= TRINKET_PRICE &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      getEffectiveStage() > 2 &&
      !onStage(
        LevelStage.BLUE_WOMB, // 9
        LevelStage.DARK_ROOM_CHEST, // 11
        LevelStage.HOME, // 13
      )
    );
  }

  override onAdd(player: EntityPlayer): void {
    const price = player.HasCollectible(CollectibleType.STEAM_SALE)
      ? TRINKET_PRICE / 2
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
