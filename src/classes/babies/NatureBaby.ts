import { PickupVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  isHorsePill,
} from "isaacscript-common";
import { Baby } from "../Baby";

const HORSE_PILL_MODIFIER = 2048;

/** Starts with PhD + All pills are Horse pills. */
export class NatureBaby extends Baby {
  // 70
  @CallbackCustom(ModCallbackCustom.POST_PICKUP_INIT_FILTER, PickupVariant.PILL)
  postPickupInitPill(pickup: EntityPickup): void {
    const pill = pickup as EntityPickupPill;

    if (!isHorsePill(pill.SubType)) {
      pill.Morph(
        pill.Type,
        pill.Variant,
        pill.SubType + HORSE_PILL_MODIFIER,
        true,
        true,
        true,
      );
    }
  }
}
