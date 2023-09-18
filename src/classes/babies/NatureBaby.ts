import { PickupVariant } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

const HORSE_PILL_MODIFIER = 2048;

/** Starts with PhD + All pills are Horse pills. */
export class NatureBaby extends Baby {
  // 79
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_SELECTION_FILTER,
    PickupVariant.PILL,
  )
  postPickupInitPill(pickup: EntityPickup): [PickupVariant, int] | undefined {
    const pill = pickup as EntityPickupPill;

    return [PickupVariant.PILL, pill.SubType + HORSE_PILL_MODIFIER];
  }
}
