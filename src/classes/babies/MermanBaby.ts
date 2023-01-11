import { PickupVariant } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Keys spawn as bombs. */
export class MermanBaby extends Baby {
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_SELECTION_FILTER,
    PickupVariant.KEY,
  )
  postPickupSelection(
    _pickup: EntityPickup,
    _variant: PickupVariant,
    subType: int,
  ): [PickupVariant, int] | undefined {
    return [PickupVariant.BOMB, subType];
    // (use the same sub-type, so e.g. a charged key would be converted to a golden bomb)
  }
}
