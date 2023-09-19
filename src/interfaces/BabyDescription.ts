import type {
  CollectibleType,
  ItemPoolType,
  SeedEffect,
  TrinketType,
} from "isaac-typescript-definitions";
import type { RandomBabyType } from "../enums/RandomBabyType";

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
  readonly collectibleNum?: int;
  readonly uncharged?: boolean;
  readonly trinket?: TrinketType;
  readonly trinketNum?: int;
  readonly goldenBomb?: boolean;
  readonly goldenKey?: boolean;
  readonly num?: int;
  readonly seed?: SeedEffect;
  readonly allCollectiblesFromPool?: ItemPoolType;

  /**
   * For some specific blindfolded babies. Fireplaces, poops, and TNT barrels can cause the player
   * to get softlocked in these types of situations.
   */
  readonly softlockPreventionRemoveFires?: boolean;

  /**
   * For babies that have limited range. Enemies on islands can cause the player to get softlocked
   * in these types of situations.
   */
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
   * (We cannot specify the type as `Baby` since that would cause a dependency cycle.)
   */
  readonly class?: new (
    babyType: RandomBabyType,
    baby: BabyDescription,
  ) => unknown;
}
