export const postPickupSelectionBabyFunctionMap = new Map<
  int,
  (pickup: EntityPickup, variant: int, subType: int) => [int, int] | void
>();

// Gem Baby
postPickupSelectionBabyFunctionMap.set(
  237,
  (_pickup: EntityPickup, variant: int, subType: int) => {
    if (
      variant === PickupVariant.PICKUP_COIN &&
      subType === CoinSubType.COIN_PENNY
    ) {
      return [PickupVariant.PICKUP_COIN, CoinSubType.COIN_NICKEL];
    }

    return undefined;
  },
);

// Merman Baby
postPickupSelectionBabyFunctionMap.set(
  342,
  (_pickup: EntityPickup, variant: int, subType: int) => {
    // Convert all keys to bombs
    if (variant === PickupVariant.PICKUP_KEY) {
      return [PickupVariant.PICKUP_BOMB, subType];
      // (use the same SubType, so e.g. a charged key would be converted to a golden bomb)
    }

    return undefined;
  },
);

// Mermaid Baby
postPickupSelectionBabyFunctionMap.set(
  395,
  (_pickup: EntityPickup, variant: int, subType: int) => {
    // Convert all bombs to keys
    if (variant === PickupVariant.PICKUP_BOMB) {
      if (subType > KeySubType.KEY_CHARGED) {
        // There are more bomb sub-types than key sub-types
        subType = 1;
      }

      return [PickupVariant.PICKUP_KEY, subType];
      // (use the same SubType, so e.g. a golden bomb would be converted to a charged key)
    }

    return undefined;
  },
);
