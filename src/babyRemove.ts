import { CollectibleType } from "isaac-typescript-definitions";
import {
  game,
  removeDeadEyeMultiplier,
  repeat,
  setBlindfold,
} from "isaacscript-common";
import { BABY_CLASS_MAP } from "./objects/babyClassMap";
import { getCurrentBaby } from "./utilsBaby";

export function babyRemove(player: EntityPlayer, oldBabyCounters: int): void {
  const currentBaby = getCurrentBaby();
  if (currentBaby === undefined) {
    return;
  }
  const { babyType, baby } = currentBaby;

  // If we are on an item baby, remove the item.
  if (baby.collectible !== undefined) {
    // If the item is in the Schoolbag, this will successfully remove it.
    player.RemoveCollectible(baby.collectible);
  }
  if (baby.collectible2 !== undefined) {
    // If the item is in the Schoolbag, this will successfully remove it.
    player.RemoveCollectible(baby.collectible2);
  }

  // If we are on a multiple item baby, remove the extra items.
  if (baby.collectible !== undefined && baby.itemNum !== undefined) {
    const numItemsToRemove = baby.itemNum - 1; // We already removed one item above
    for (let i = 0; i < numItemsToRemove; i++) {
      player.RemoveCollectible(baby.collectible);
    }
  }

  // If we are on a trinket baby, remove the trinket.
  if (baby.trinket !== undefined) {
    const { trinket } = baby;
    const num = baby.num ?? 1;
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
    babyClass.onRemove(player, oldBabyCounters);
  }
}
