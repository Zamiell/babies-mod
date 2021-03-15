import babyRemoveFunctions from "./babyRemoveFunctions";
import g from "./globals";
import * as misc from "./misc";
import { CollectibleTypeCustom } from "./types/enums.custom";

export default function babyRemove(): void {
  // Local variables
  const [babyType, baby, valid] = misc.getCurrentBaby();
  if (!valid) {
    return;
  }

  // If we are on an item baby, remove the item
  if (baby.item !== undefined) {
    // If the item is in the vanilla Schoolbag, this will successfully remove it
    g.p.RemoveCollectible(baby.item);

    // We have to handle the Racing+ Schoolbag explicitly
    if (
      g.racingPlusEnabled &&
      g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM) &&
      RacingPlusGlobals.run.schoolbag.item === baby.item
    ) {
      RacingPlusSchoolbag.Remove();
    }
  }
  if (baby.item2 !== undefined) {
    // If the item is in the vanilla Schoolbag, this will successfully remove it
    g.p.RemoveCollectible(baby.item2);

    // We have to handle the Racing+ Schoolbag explicitly
    if (
      g.racingPlusEnabled &&
      g.p.HasCollectible(CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM) &&
      RacingPlusGlobals.run.schoolbag.item === baby.item2
    ) {
      RacingPlusSchoolbag.Remove();
    }
  }

  // If we are on a multiple item baby, remove the extra items
  if (baby.item !== undefined && baby.itemNum !== undefined) {
    for (let i = 1; i <= baby.itemNum; i++) {
      g.p.RemoveCollectible(baby.item);
    }
  }

  // If we are on a trinket baby, remove the trinket
  if (baby.trinket !== undefined) {
    g.p.TryRemoveTrinket(baby.trinket);
  }

  // Remove the Dead Eye multiplier
  if (baby.item === CollectibleType.COLLECTIBLE_DEAD_EYE) {
    for (let i = 0; i < 100; i++) {
      // Each time this function is called, it only has a chance of working,
      // so just call it 100 times to be safe
      g.p.ClearDeadEyeCharge();
    }
  }

  // Remove easter eggs
  if (baby.seed !== undefined) {
    g.seeds.RemoveSeedEffect(baby.seed);
  }

  // Remove miscellaneous effects
  const babyFunc = babyRemoveFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc();
  }
}
