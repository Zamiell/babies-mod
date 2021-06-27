import { CollectibleTypeCustom } from "./enums";

export default interface BabyDescription {
  // Mandatory properties
  name: string;
  description: string;
  sprite: string; // This is not currently used

  // Optional properties
  blindfolded?: boolean;
  blindfolded2?: boolean;
  cooldown?: int;
  delay?: int;
  description2?: string;
  distance?: int;
  explosionImmunity?: boolean;
  flight?: boolean;
  item?: CollectibleType | CollectibleTypeCustom;
  item2?: CollectibleType | CollectibleTypeCustom;
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
}
