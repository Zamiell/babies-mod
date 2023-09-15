import type {
  CollectibleType,
  ItemPoolType,
} from "isaac-typescript-definitions";
import { ModCallback } from "isaac-typescript-definitions";
import { Callback } from "isaacscript-common";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { BabyModFeature } from "../BabyModFeature";
import {
  getRandomCollectibleTypeFromPool,
  isGettingCollectible,
} from "./GetRandomCollectibleTypeFromPool";
import { getBabyType } from "./babySelection/v";

export class AllCollectiblesFromPool extends BabyModFeature {
  @Callback(ModCallback.PRE_GET_COLLECTIBLE)
  preGetCollectible(
    _itemPoolType: ItemPoolType,
    _decrease: boolean,
    seed: Seed,
  ): CollectibleType | undefined {
    if (isGettingCollectible()) {
      return undefined;
    }

    const babyType = getBabyType();
    if (babyType === undefined) {
      return undefined;
    }

    const baby = BABIES[babyType] as BabyDescription;
    if (baby.allCollectiblesFromPool === undefined) {
      return undefined;
    }

    return getRandomCollectibleTypeFromPool(baby.allCollectiblesFromPool, seed);
  }
}
