export enum PlayerTypeCustom {
  PLAYER_RANDOM_BABY = Isaac.GetPlayerTypeByName("Random Baby"),
}

export enum EffectVariantCustom {
  FETUS_BOSS_TARGET = Isaac.GetEntityVariantByName("FetusBossTarget"),
  FETUS_BOSS_ROCKET = Isaac.GetEntityVariantByName("FetusBossRocket"),
}

export enum CollectibleTypeCustom {
  COLLECTIBLE_CLOCKWORK_ASSEMBLY = Isaac.GetItemIdByName("Clockwork Assembly"),
  COLLECTIBLE_FLOCK_OF_SUCCUBI = Isaac.GetItemIdByName("Flock of Succubi"),
  COLLECTIBLE_CHARGING_STATION = Isaac.GetItemIdByName("Charging Station"),

  COLLECTIBLE_SHOP_TELEPORT = Isaac.GetItemIdByName("Shop Teleport"),
  COLLECTIBLE_TREASURE_ROOM_TELEPORT = Isaac.GetItemIdByName(
    "Treasure Room Teleport",
  ),
  COLLECTIBLE_MINIBOSS_ROOM_TELEPORT = Isaac.GetItemIdByName(
    "Mini-Boss Room Teleport",
  ),
  COLLECTIBLE_ARCADE_TELEPORT = Isaac.GetItemIdByName("Arcade Teleport"),
  COLLECTIBLE_CURSE_ROOM_TELEPORT = Isaac.GetItemIdByName(
    "Curse Room Teleport",
  ),
  COLLECTIBLE_CHALLENGE_ROOM_TELEPORT = Isaac.GetItemIdByName(
    "Challenge Room Teleport",
  ),
  COLLECTIBLE_LIBRARY_TELEPORT = Isaac.GetItemIdByName("Library Teleport"),
  COLLECTIBLE_SACRIFICE_ROOM_TELEPORT = Isaac.GetItemIdByName(
    "Sacrifice Room Teleport",
  ),
  COLLECTIBLE_BEDROOM_CLEAN_TELEPORT = Isaac.GetItemIdByName(
    "Bedroom (Clean) Teleport",
  ),
  COLLECTIBLE_BEDROOM_DIRTY_TELEPORT = Isaac.GetItemIdByName(
    "Bedroom (Dirty) Teleport",
  ),
  COLLECTIBLE_TREASURE_CHEST_ROOM_TELEPORT = Isaac.GetItemIdByName(
    "Treasure Chest Room Teleport",
  ),
  COLLECTIBLE_DICE_ROOM_TELEPORT = Isaac.GetItemIdByName("Dice Room Teleport"),

  // Racing+ items
  COLLECTIBLE_CHECKPOINT = Isaac.GetItemIdByName("Checkpoint"),
}
