/**
 * This is a helper function to get an item name from a CollectibleType or a TrinketType.
 *
 * Example:
 * ```
 * const item = CollectibleType.COLLECTIBLE_SAD_ONION;
 * const itemName = getItemName(item); // itemName is now "Sad Onion"
 * ```
 */
export function getItemName(
  collectibleOrTrinketType: int,
  trinket = false,
): string {
  const itemConfig = Isaac.GetItemConfig();
  const defaultName = "Unknown";

  if (type(collectibleOrTrinketType) !== "number") {
    return defaultName;
  }

  const itemConfigItem = trinket
    ? itemConfig.GetTrinket(collectibleOrTrinketType)
    : itemConfig.GetCollectible(collectibleOrTrinketType);

  if (itemConfigItem === null) {
    return defaultName;
  }

  return itemConfigItem.Name;
}

export function getRoomData(): RoomConfig | null {
  const game = Game();
  const level = game.GetLevel();
  const roomIndex = getRoomIndex();
  const roomDesc = level.GetRoomByIdx(roomIndex);

  return roomDesc.Data;
}

/**
 * Helper function to get the variant for the current room from the XML/STB data. You can think of a
 * room variant as its identifier. For example, to go to Basement room #123, you would use a console
 * command of `goto d.123` while on the Basement.
 *
 * @returns The room variant. Returns -1 if the variant was not found.
 */
export function getRoomVariant(): int {
  const roomData = getRoomData();

  if (roomData === null) {
    return -1;
  }

  return roomData.Variant;
}

/**
 * Helper function to get the room index of the current room. Use this instead of calling
 * `Game().GetLevel().GetCurrentRoomIndex()` directly to avoid bugs with big rooms.
 * (Big rooms will return the specific 1x1 quadrant that the player entered the room at,
 * which can break data structures that use the room index as an index.)
 */
export function getRoomIndex(): int {
  const game = Game();
  const level = game.GetLevel();
  const roomIndex = level.GetCurrentRoomIndex();

  if (roomIndex < 0) {
    // SafeGridIndex is always -1 for rooms outside the grid,
    // so default to returning the room index provided by the "GetCurrentRoomIndex() function"
    return roomIndex;
  }

  // SafeGridIndex is equal to the top-left index of the room
  const roomDesc = level.GetCurrentRoomDesc();
  return roomDesc.SafeGridIndex;
}
