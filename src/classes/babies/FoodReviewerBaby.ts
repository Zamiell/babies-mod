import type { CollectibleType } from "isaac-typescript-definitions";
import { ItemConfigTag, ModCallback } from "isaac-typescript-definitions";
import { Callback, getRandomSetElement, newRNG } from "isaacscript-common";
import { mod } from "../../mod";
import { setInitialBabyRNG } from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** All items are food items. */
export class FoodReviewerBaby extends Baby {
  v = v;

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(): CollectibleType | undefined {
    return getRandomCollectibleTypeWithTag(ItemConfigTag.FOOD, v.run.rng);
  }
}

function getRandomCollectibleTypeWithTag(
  itemConfigTag: ItemConfigTag,
  rng: RNG,
): CollectibleType {
  const foodCollectibleTypesSet = mod.getCollectiblesWithTag(itemConfigTag);
  return getRandomSetElement(foodCollectibleTypesSet, rng);
}
