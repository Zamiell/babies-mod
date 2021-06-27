const functionMap = new Map<
  int,
  (pickup: EntityPickup, variant: int, subType: int) => [int, int] | void
>();
export default functionMap;

// Gem Baby
functionMap.set(237, (_pickup: EntityPickup, variant: int, subType: int) => {
  if (
    variant === PickupVariant.PICKUP_COIN &&
    subType === CoinSubType.COIN_PENNY
  ) {
    return [PickupVariant.PICKUP_COIN, CoinSubType.COIN_NICKEL];
  }

  return undefined;
});

// Merman Baby
functionMap.set(342, (_pickup: EntityPickup, variant: int, subType: int) => {
  // Convert all keys to bombs
  if (variant === PickupVariant.PICKUP_KEY) {
    return [PickupVariant.PICKUP_BOMB, subType];
    // (use the same SubType, so e.g. a charged key would be converted to a golden bomb)
  }

  return undefined;
});

// Mermaid Baby
functionMap.set(395, (_pickup: EntityPickup, variant: int, subType: int) => {
  // Convert all bombs to keys
  if (variant === PickupVariant.PICKUP_BOMB) {
    if (subType === 5) {
      // There is a subType of 5 for bombs but not for keys
      subType = 1;
    }

    return [PickupVariant.PICKUP_KEY, subType];
    // (use the same SubType, so e.g. a golden bomb would be converted to a charged key)
  }

  return undefined;
});
