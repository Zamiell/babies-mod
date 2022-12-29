import {
  CollectibleType,
  SeedEffect,
  TrinketType,
} from "isaac-typescript-definitions";
import { Baby } from "../classes/Baby";

export interface BabyDescription {
  // Mandatory properties
  name: string;
  description: string;
  sprite: string;

  // Optional properties
  blindfolded?: boolean;
  blindfolded2?: boolean;
  cooldown?: int;
  delay?: int;
  description2?: string;
  distance?: int;
  explosionImmunity?: boolean;
  flight?: boolean;
  item?: CollectibleType;
  item2?: CollectibleType;
  item3?: CollectibleType;
  itemNum?: int;
  max?: int;
  min?: int;
  mustHaveTears?: boolean;
  noEndFloors?: boolean;
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

  /** The associated class that provides the logic for the baby, if any. */
  class?: typeof Baby;
}
