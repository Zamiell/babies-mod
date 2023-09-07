import type {
  CollectibleType,
  ItemPoolType,
} from "isaac-typescript-definitions";
import { ModFeature, game, isRNG } from "isaacscript-common";

const v = {
  run: {
    gettingCollectible: false,
  },
};

export class GetRandomCollectibleTypeFromPool extends ModFeature {
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
