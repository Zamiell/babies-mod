import {
  CoinSubType,
  LevelStage,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getEffectiveStage,
  ModCallbackCustom,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Pennies spawn as nickels. */
export class GemBaby extends Baby {
  /** Money is useless past Depths 2. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage <= LevelStage.DEPTHS_2;
  }

  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_SELECTION_FILTER,
    PickupVariant.COIN,
    CoinSubType.PENNY,
  )
  postPickupSelection(): [PickupVariant, int] | undefined {
    return [PickupVariant.COIN, CoinSubType.NICKEL];
  }
}
