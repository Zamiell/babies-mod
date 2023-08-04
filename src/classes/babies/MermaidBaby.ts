import { KeySubType, PickupVariant } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getHighestEnumValue,
} from "isaacscript-common";
import { Baby } from "../Baby";

const FINAL_KEY_SUB_TYPE = getHighestEnumValue(KeySubType);

/** Bombs spawn as keys. */
export class MermaidBaby extends Baby {
  @CallbackCustom(
    ModCallbackCustom.POST_PICKUP_SELECTION_FILTER,
    PickupVariant.BOMB,
  )
  postPickupSelection(
    _pickup: EntityPickup,
    _variant: PickupVariant,
    subType: int,
  ): [PickupVariant, int] | undefined {
    // There are more bomb sub-types than key sub-types, so we may have to convert it.
    const newSubType =
      subType > (FINAL_KEY_SUB_TYPE as int) ? KeySubType.NORMAL : subType;
    return [PickupVariant.KEY, newSubType];
    // (use the same sub-type, so e.g. a golden bomb would be converted to a charged key)
  }
}
