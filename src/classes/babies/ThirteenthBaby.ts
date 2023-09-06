import {
  CollectibleType,
  LevelStage,
  TrinketType,
} from "isaac-typescript-definitions";
import { getEffectiveStage, onStage, spawnTrinket } from "isaacscript-common";
import { Baby } from "../Baby";

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
      coins >= 10 &&
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
    // Top-left
    spawnRandomTrinketForSale(32, player);
    spawnRandomTrinketForSale(34, player);

    // Top-right
    spawnRandomTrinketForSale(40, player);
    spawnRandomTrinketForSale(42, player);

    // Bottom-left
    spawnRandomTrinketForSale(92, player);
    spawnRandomTrinketForSale(94, player);

    // Bottom-right
    spawnRandomTrinketForSale(100, player);
    spawnRandomTrinketForSale(102, player);
  }
}

function spawnRandomTrinketForSale(gridIndex: int, player: EntityPlayer) {
  const trinket = spawnTrinket(TrinketType.NULL, gridIndex);
  trinket.Price = player.HasCollectible(CollectibleType.STEAM_SALE) ? 5 : 10;
  trinket.AutoUpdatePrice = false;
}
