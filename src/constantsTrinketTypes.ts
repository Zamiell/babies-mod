import { TrinketType } from "isaac-typescript-definitions";
import { ReadonlySet } from "isaacscript-common";

export const TRINKETS_THAT_SYNERGIZE_WITH_TEARS = new ReadonlySet([
  TrinketType.WIGGLE_WORM, // 10
  TrinketType.FLAT_WORM, // 12
  TrinketType.SUPER_MAGNET, // 68
]);

export const TRINKETS_THAT_OPERATE_ON_ACTIVE_ITEMS = new ReadonlySet([
  TrinketType.VIBRANT_BULB, // 100
  TrinketType.DIM_BULB, // 101
  TrinketType.BUTTER, // 122
]);

export const TRINKETS_THAT_OPERATE_ON_ACTIVE_ITEMS_WITH_CHARGES =
  new ReadonlySet([
    TrinketType.VIBRANT_BULB, // 100
    TrinketType.DIM_BULB, // 101
  ]);

export const CHEST_ANTI_SYNERGY_TRINKET_TYPES = [
  TrinketType.LEFT_HAND, // 61
  TrinketType.GILDED_KEY, // 159
] as const;
