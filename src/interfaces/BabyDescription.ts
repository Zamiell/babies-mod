import type {
  CollectibleType,
  SeedEffect,
  TrinketType,
} from "isaac-typescript-definitions";

export interface BabyDescription {
  // Mandatory properties
  readonly name: string;
  readonly description: string;
  readonly sprite: string;

  // Optional properties
  readonly blindfolded?: boolean;
  readonly description2?: string;
  readonly explosionImmunity?: boolean;
  readonly flight?: boolean;
  readonly collectible?: CollectibleType;
  readonly collectible2?: CollectibleType;
  readonly collectible3?: CollectibleType;
  readonly itemNum?: int;
  readonly uncharged?: boolean;
  readonly trinket?: TrinketType;
  readonly trinketNum?: int;
  readonly goldenBomb?: boolean;
  readonly num?: int;
  readonly seed?: SeedEffect;
  readonly softlockPreventionDestroyPoops?: boolean;
  readonly softlockPreventionIsland?: boolean;

  // Optional properties that specify selection restrictions.
  readonly requireTears?: boolean;
  readonly requireNoEndFloors?: boolean;
  readonly requireNumHits?: int;

  /** Requires that the player has at least 1 bomb. */
  readonly requireBombs?: boolean;

  /** Requires that the player has at least 1 coin. */
  readonly requireCoins?: boolean;

  /** Requires that the player has at least 1 key. */
  readonly requireKeys?: boolean;

  /**
   * The associated class that provides the logic for the baby, if any.
   *
   * (We cannot specify the type as `typeof Baby` since that would cause a dependency cycle.)
   */
  readonly class?: unknown;
}
