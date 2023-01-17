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
  uncharged?: boolean;
  trinket?: TrinketType;
  goldenBomb?: boolean;
  num?: int;
  max?: int;
  min?: int;
  seed?: SeedEffect;
  softlockPreventionDestroyPoops?: boolean;
  softlockPreventionIsland?: boolean;

  // Optional properties that specify selection restrictions.
  requireTears?: boolean;
  requireNoEndFloors?: boolean;
  requireNumHits?: int;
  /** Requires that the player has at least 1 bomb. */
  requireBombs?: boolean;
  /** Requires that the player has at least 1 coin. */
  requireCoins?: boolean;
  /** Requires that the player has at least 1 key. */
  requireKeys?: boolean;

  /**
   * The associated class that provides the logic for the baby, if any.
   *
   * (We cannot specify the type as `typeof Baby` since that would cause a dependency cycle.)
   */
  class?: unknown;
}
