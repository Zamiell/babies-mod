import {
  CollectibleType,
  ItemConfigTag,
  ModCallback,
} from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import { getRandomCollectibleTypeWithTag } from "../../utils";
import { Baby } from "../Baby";

/** All items are food items. */
export class FoodReviewerBaby extends Baby {
  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(): CollectibleType | undefined {
    return getRandomCollectibleTypeWithTag(ItemConfigTag.FOOD);
  }
}
