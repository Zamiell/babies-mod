import type { PillColor } from "isaac-typescript-definitions";
import { PickupVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getHorsePillColor,
  isHorsePill,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** Starts with PHD + All pills are horse pills. */
export class NatureBaby extends Baby {
  // 79
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_SELECTION_FILTER,
    PickupVariant.PILL,
  )
  postPickupSelectionPill(
    _pickup: EntityPickup,
    _variant: PickupVariant,
    subType: int,
  ): [PickupVariant, int] | undefined {
    const pillColor = subType as PillColor;

    if (!isHorsePill(pillColor)) {
      const horsePillColor = getHorsePillColor(pillColor);
      return [PickupVariant.PILL, horsePillColor];
    }

    return undefined;
  }
}
