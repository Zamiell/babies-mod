import {
  CollectibleType,
  SeedEffect,
  TrinketType,
} from "isaac-typescript-definitions";

export interface BabyDescription {
  // Mandatory properties
  name: string;
  description: string;
  sprite: string;

  // Optional properties
  blindfolded?: boolean;
  description2?: string;
  explosionImmunity?: boolean;
  flight?: boolean;
  item?: CollectibleType;
  item2?: CollectibleType;
  item3?: CollectibleType;
  itemNum?: int;
  max?: int;
  min?: int;
  num?: int;
  numHits?: int;
  requireBombs?: boolean;
  requireCoins?: boolean;
  requireKeys?: boolean;
  seed?: SeedEffect;
  softlockPreventionDestroyPoops?: boolean;
  softlockPreventionIsland?: boolean;
  time?: int;
  trinket?: TrinketType;
  uncharged?: boolean;

  // Optional properties that specify selection restrictions.
  mustHaveTears?: boolean;
  noEndFloors?: boolean;

  /**
   * The associated class that provides the logic for the baby, if any.
   *
   * (We cannot specify the type as `typeof Baby` since that would cause a dependency cycle.)
   */
  class?: unknown;
}
