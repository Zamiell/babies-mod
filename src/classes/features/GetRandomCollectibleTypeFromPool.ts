import type {
  CollectibleType,
  ItemPoolType,
} from "isaac-typescript-definitions";
import { game, isRNG } from "isaacscript-common";
import { BabyModFeature } from "../BabyModFeature";

const v = {
  run: {
    gettingCollectible: false,
  },
};

export class GetRandomCollectibleTypeFromPool extends BabyModFeature {
  v = v;
}

export function getRandomCollectibleTypeFromPool(
  itemPoolType: ItemPoolType,
  seedOrRNG: Seed | RNG,
): CollectibleType {
  const itemPool = game.GetItemPool();
  const seed = isRNG(seedOrRNG) ? seedOrRNG.Next() : seedOrRNG;

  v.run.gettingCollectible = true;
  const collectibleType = itemPool.GetCollectible(itemPoolType, true, seed);
  v.run.gettingCollectible = false;

  return collectibleType;
}

export function isGettingCollectible(): boolean {
  return v.run.gettingCollectible;
}
