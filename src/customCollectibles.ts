import { CollectibleType } from "isaac-typescript-definitions";
import { ReadonlyMap } from "isaacscript-common";

/** Some collectibles are modified by Racing+. */
export const COLLECTIBLE_TYPE_TO_COLLECTIBLE_TYPE_CUSTOM_MAP = new ReadonlyMap([
  [CollectibleType.FLIP, Isaac.GetItemIdByName("Flip (Custom)")],
  [CollectibleType.SOL, Isaac.GetItemIdByName("Sol (Custom)")],
]);
