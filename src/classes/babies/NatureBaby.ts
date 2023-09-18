import { PickupVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  isHorsePill,
} from "isaacscript-common";
import { Baby } from "../Baby";

const HORSE_PILL_MODIFIER = 2048;

/** Starts with PHD + All pills are horse pills. */
export class NatureBaby extends Baby {
  // 79
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_SELECTION_FILTER,
    PickupVariant.PILL,
  )
  postPickupSelectionPill(
    pickup: EntityPickup,
  ): [PickupVariant, int] | undefined {
    const pill = pickup as EntityPickupPill;

    if (!isHorsePill(pill.SubType)) {
      return [PickupVariant.PILL, pill.SubType + HORSE_PILL_MODIFIER];
    }

    return undefined;
  }
}
