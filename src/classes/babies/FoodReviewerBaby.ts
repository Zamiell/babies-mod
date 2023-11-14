import type { CollectibleType } from "isaac-typescript-definitions";
import {
  ItemConfigTag,
  LevelStage,
  ModCallback,
} from "isaac-typescript-definitions";
import {
  Callback,
  getRandomArrayElement,
  newRNG,
  onEffectiveStage,
} from "isaacscript-common";
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

  /**
   * We don't want this to affect the player's first devil deal. Additionally, we do not want the
   * mechanic to affect resetting for a starting item.
   */
  override isValid(): boolean {
    return (
      !onEffectiveStage(LevelStage.BASEMENT_1) &&
      !onEffectiveStage(LevelStage.BASEMENT_2)
    );
  }

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
  const foodCollectibleTypes = mod.getCollectibleTypesWithTag(itemConfigTag);
  return getRandomArrayElement(foodCollectibleTypes, rng);
}
