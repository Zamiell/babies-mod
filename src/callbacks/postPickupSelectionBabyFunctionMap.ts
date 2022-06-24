import {
  CoinSubType,
  KeySubType,
  PickupVariant,
} from "isaac-typescript-definitions";

export const postPickupSelectionBabyFunctionMap = new Map<
  int,
  (pickup: EntityPickup, variant: int, subType: int) => [int, int] | void
>();

// Gem Baby
postPickupSelectionBabyFunctionMap.set(
  237,
  (_pickup: EntityPickup, variant: int, subType: int) => {
    if (
      variant === (PickupVariant.COIN as int) &&
      subType === (CoinSubType.PENNY as int)
    ) {
      return [PickupVariant.COIN, CoinSubType.NICKEL];
    }

    return undefined;
  },
);

// Merman Baby
postPickupSelectionBabyFunctionMap.set(
  342,
  (_pickup: EntityPickup, variant: int, subType: int) => {
    // Convert all keys to bombs.
    if (variant === (PickupVariant.KEY as int)) {
      return [PickupVariant.BOMB, subType];
      // (use the same sub-type, so e.g. a charged key would be converted to a golden bomb)
    }

    return undefined;
  },
);

// Mermaid Baby
postPickupSelectionBabyFunctionMap.set(
  395,
  (_pickup: EntityPickup, variant: int, subType: int) => {
    // Convert all bombs to keys.
    if (variant === (PickupVariant.BOMB as int)) {
      if (subType > (KeySubType.CHARGED as int)) {
        // There are more bomb sub-types than key sub-types.
        subType = 1;
      }

      return [PickupVariant.KEY, subType];
      // (use the same SubType, so e.g. a golden bomb would be converted to a charged key)
    }

    return undefined;
  },
);
