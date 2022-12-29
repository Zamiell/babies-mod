import { CollectibleType } from "isaac-typescript-definitions";
import { removeDeadEyeMultiplier, setBlindfold } from "isaacscript-common";
import { babyRemoveFunctionMap } from "./babyRemoveFunctionMap";
import g from "./globals";
import { BABY_CLASSES } from "./objects/babies";
import { getCurrentBaby } from "./utils";

export function babyRemove(player: EntityPlayer, oldBabyCounters: int): void {
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // If we are on an item baby, remove the item.
  if (baby.item !== undefined) {
    // If the item is in the Schoolbag, this will successfully remove it.
    player.RemoveCollectible(baby.item);
  }
  if (baby.item2 !== undefined) {
    // If the item is in the Schoolbag, this will successfully remove it.
    player.RemoveCollectible(baby.item2);
  }

  // If we are on a multiple item baby, remove the extra items.
  if (baby.item !== undefined && baby.itemNum !== undefined) {
    const numItemsToRemove = baby.itemNum - 1; // We already removed one item above
    for (let i = 0; i < numItemsToRemove; i++) {
      player.RemoveCollectible(baby.item);
    }
  }

  // If we are on a trinket baby, remove the trinket.
  if (baby.trinket !== undefined) {
    // It should be impossible for the player to have picked up another copy of the trinket, because
    // we removed it from pools. Thus, this should always remove the smelted trinket.
    player.TryRemoveTrinket(baby.trinket);
  }

  // Remove the Dead Eye multiplier.
  if (baby.item === CollectibleType.DEAD_EYE) {
    removeDeadEyeMultiplier(player);
  }

  // Remove the blindfold.
  if (baby.blindfolded === true) {
    setBlindfold(player, false, false);
  }

  // Remove easter eggs.
  if (baby.seed !== undefined) {
    g.seeds.RemoveSeedEffect(baby.seed);
  }

  // Remove miscellaneous effects.
  const babyClass = BABY_CLASSES.get(babyType);
  if (babyClass !== undefined) {
    babyClass.onRemove();
  }

  // TODO: Refactor old logic into class methods.
  const babyRemoveFunction = babyRemoveFunctionMap.get(babyType);
  if (babyRemoveFunction !== undefined) {
    babyRemoveFunction(oldBabyCounters);
  }
}
