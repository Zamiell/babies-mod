import { CollectibleType } from "isaac-typescript-definitions";
import {
  game,
  removeDeadEyeMultiplier,
  repeat,
  setBlindfold,
} from "isaacscript-common";
import { COLLECTIBLE_TYPE_TO_COLLECTIBLE_TYPE_CUSTOM_MAP } from "./customCollectibles";
import type { RandomBabyType } from "./enums/RandomBabyType";
import type { BabyDescription } from "./interfaces/BabyDescription";
import { BABY_CLASS_MAP } from "./objects/babyClassMap";
import { getBabyCollectiblesSet } from "./utils";

export function babyRemove(
  player: EntityPlayer,
  babyType: RandomBabyType,
  baby: BabyDescription,
): void {
  // If we are on an collectible baby, remove the collectible.
  if (baby.collectible !== undefined) {
    // If the collectible is in the Schoolbag, this will successfully remove it.
    player.RemoveCollectible(baby.collectible, undefined, undefined, false);
  }

  if (baby.collectible2 !== undefined) {
    // If the collectible is in the Schoolbag, this will successfully remove it.
    player.RemoveCollectible(baby.collectible2, undefined, undefined, false);
  }

  if (baby.collectible3 !== undefined) {
    // If the collectible is in the Schoolbag, this will successfully remove it.
    player.RemoveCollectible(baby.collectible3, undefined, undefined, false);
  }

  // If we are on a multiple collectible baby, remove the extra collectibles.
  if (baby.collectible !== undefined && baby.collectibleNum !== undefined) {
    const num = baby.collectibleNum - 1; // We already removed one collectible above.
    for (let i = 0; i < num; i++) {
      player.RemoveCollectible(baby.collectible, undefined, undefined, false);
    }
  }

  // Some collectibles are modified by Racing+.
  const babyCollectiblesSet = getBabyCollectiblesSet(baby);
  for (const [
    collectibleType,
    collectibleTypeCustom,
  ] of COLLECTIBLE_TYPE_TO_COLLECTIBLE_TYPE_CUSTOM_MAP) {
    if (
      babyCollectiblesSet.has(collectibleType) &&
      player.HasCollectible(collectibleTypeCustom)
    ) {
      player.RemoveCollectible(
        collectibleTypeCustom,
        undefined,
        undefined,
        false,
      );
    }
  }

  // If we are on a trinket baby, remove the trinket.
  if (baby.trinket !== undefined) {
    const { trinket } = baby;
    const num = baby.trinketNum ?? 1;
    repeat(num, () => {
      // It should be impossible for the player to have picked up another copy of the trinket,
      // because we removed it from pools. Thus, this should always remove the smelted trinket.
      player.TryRemoveTrinket(trinket);
    });
  }

  // Remove the Dead Eye multiplier.
  if (baby.collectible === CollectibleType.DEAD_EYE) {
    removeDeadEyeMultiplier(player);
  }

  // Remove the blindfold.
  if (baby.blindfolded === true) {
    setBlindfold(player, false, false);
  }

  // Remove easter eggs.
  if (baby.seed !== undefined) {
    const seeds = game.GetSeeds();
    seeds.RemoveSeedEffect(baby.seed);
  }

  // Remove miscellaneous effects.
  const babyClass = BABY_CLASS_MAP.get(babyType);
  if (babyClass !== undefined) {
    babyClass.onRemove(player);
  }
}
