import { LevelStage, TrinketType } from "isaac-typescript-definitions";
import { getEffectiveStage, onStage, spawnTrinket } from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts in a trinket shop. */
export class ThirteenthBaby extends Baby {
  /**
   * - The player won't have any resources to spend on trinkets on the first floor or second floor.
   * - We want to ensure that the starting room of the floor is clean (e.g. no Blue Womb, no The
   *   Chest, etc.)
   */
  override isValid(): boolean {
    return (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      getEffectiveStage() > 2 &&
      !onStage(
        LevelStage.BLUE_WOMB, // 9
        LevelStage.DARK_ROOM_CHEST, // 11
        LevelStage.HOME, // 13
      )
    );
  }

  override onAdd(): void {
    // Top-left
    spawnRandomTrinketForSale(32);
    spawnRandomTrinketForSale(34);

    // Top-right
    spawnRandomTrinketForSale(40);
    spawnRandomTrinketForSale(42);

    // Bottom-left
    spawnRandomTrinketForSale(92);
    spawnRandomTrinketForSale(94);

    // Bottom-right
    spawnRandomTrinketForSale(100);
    spawnRandomTrinketForSale(102);
  }
}

function spawnRandomTrinketForSale(gridIndex: int) {
  const trinket = spawnTrinket(TrinketType.NULL, gridIndex);
  trinket.Price = 10;
  trinket.AutoUpdatePrice = false;
}
