import type {
  ActiveSlot,
  CollectibleType,
  UseFlag,
} from "isaac-typescript-definitions";
import {
  EntityType,
  ModCallback,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  Callback,
  doesEntityExist,
  getAdjustedPrice,
  inStartingRoom,
  spawnTrinket,
} from "isaacscript-common";
import { isTrinketRerollCollectibleType } from "../../utils";
import { Baby } from "../Baby";

const TRINKET_PRICE = 10;
const TRINKET_GRID_INDEXES = [32, 34, 40, 42, 92, 94, 100, 102] as const;

/** Starts in a trinket shop. */
export class ThirteenthBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    const coins = player.GetNumCoins();

    return (
      coins >= TRINKET_PRICE
      // Ensure that the starting room of the floor is clean (e.g. no Blue Womb, no The Chest, etc.)
      && !doesEntityExist(EntityType.PICKUP)
    );
  }

  override onAdd(): void {
    const price = getAdjustedPrice(TRINKET_PRICE);

    for (const gridIndex of TRINKET_GRID_INDEXES) {
      const trinket = spawnTrinket(TrinketType.NULL, gridIndex);
      trinket.Price = price;
      trinket.ShopItemId = -1;

      // Since the trinket price is normally 5 cents and our chosen price is more than that, we need
      // to disable automatic price updating.
      trinket.AutoUpdatePrice = false;
    }
  }

  // 23
  @Callback(ModCallback.PRE_USE_ITEM)
  preUseItem(
    collectibleType: CollectibleType,
    _rng: RNG,
    player: EntityPlayer,
    _useFlags: BitFlags<UseFlag>,
    _activeSlot: ActiveSlot,
    _customVarData: int,
  ): boolean | undefined {
    if (isTrinketRerollCollectibleType(collectibleType) && inStartingRoom()) {
      player.AnimateSad();
      return true;
    }

    return undefined;
  }
}
