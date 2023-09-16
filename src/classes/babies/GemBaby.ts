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

  /** This callback will fire even if e.g. a single penny is spawned with `spawn 5.20.1`. */
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_SELECTION_FILTER,
    PickupVariant.COIN,
    CoinSubType.PENNY,
  )
  postPickupSelectionPenny(): [PickupVariant, int] | undefined {
    return [PickupVariant.COIN, CoinSubType.NICKEL];
  }
}
