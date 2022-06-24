import { validateCustomEnum } from "isaacscript-common";

export const CollectibleTypeCustom = {
  CLOCKWORK_ASSEMBLY: Isaac.GetItemIdByName("Clockwork Assembly"),
  FLOCK_OF_SUCCUBI: Isaac.GetItemIdByName("Flock of Succubi"),
  CHARGING_STATION: Isaac.GetItemIdByName("Charging Station"),

  SHOP_TELEPORT: Isaac.GetItemIdByName("Shop Teleport"),
  TREASURE_ROOM_TELEPORT: Isaac.GetItemIdByName("Treasure Room Teleport"),
  MINIBOSS_ROOM_TELEPORT: Isaac.GetItemIdByName("Mini-Boss Room Teleport"),
  ARCADE_TELEPORT: Isaac.GetItemIdByName("Arcade Teleport"),
  CURSE_ROOM_TELEPORT: Isaac.GetItemIdByName("Curse Room Teleport"),
  CHALLENGE_ROOM_TELEPORT: Isaac.GetItemIdByName("Challenge Room Teleport"),
  BOSS_CHALLENGE_ROOM_TELEPORT: Isaac.GetItemIdByName(
    "Boss Challenge Room Teleport",
  ),
  LIBRARY_TELEPORT: Isaac.GetItemIdByName("Library Teleport"),
  SACRIFICE_ROOM_TELEPORT: Isaac.GetItemIdByName("Sacrifice Room Teleport"),
  BEDROOM_CLEAN_TELEPORT: Isaac.GetItemIdByName("Bedroom (Clean) Teleport"),
  BEDROOM_DIRTY_TELEPORT: Isaac.GetItemIdByName("Bedroom (Dirty) Teleport"),
  TREASURE_CHEST_ROOM_TELEPORT: Isaac.GetItemIdByName(
    "Treasure Chest Room Teleport",
  ),
  DICE_ROOM_TELEPORT: Isaac.GetItemIdByName("Dice Room Teleport"),
  PLANETARIUM_TELEPORT: Isaac.GetItemIdByName("Planetarium Teleport"),

  // Racing+ items
  CHECKPOINT: Isaac.GetItemIdByName("Checkpoint"),
} as const;

validateCustomEnum("CollectibleTypeCustom", CollectibleTypeCustom);
