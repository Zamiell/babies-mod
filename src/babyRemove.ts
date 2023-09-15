import { CollectibleType } from "isaac-typescript-definitions";
import {
  game,
  removeDeadEyeMultiplier,
  repeat,
  setBlindfold,
} from "isaacscript-common";
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
  if (babyCollectiblesSet.has(CollectibleType.FLIP)) {
    const flipCustom = Isaac.GetItemIdByName("Flip (Custom)") as
      | CollectibleType
      | -1;
    if (flipCustom !== -1 && player.HasCollectible(flipCustom)) {
      player.RemoveCollectible(flipCustom, undefined, undefined, false);
    }
  }
  if (babyCollectiblesSet.has(CollectibleType.SOL)) {
    const solCustom = Isaac.GetItemIdByName("Sol (Custom)") as
      | CollectibleType
      | -1;
    if (solCustom !== -1 && player.HasCollectible(solCustom)) {
      player.RemoveCollectible(solCustom, undefined, undefined, false);
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
