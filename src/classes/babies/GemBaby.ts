import {
  CoinSubType,
  PickupVariant,
  RoomType,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  levelHasRoomType,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Pennies spawn as nickels. */
export class GemBaby extends Baby {
  override isValid(): boolean {
    return levelHasRoomType(RoomType.SHOP);
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
