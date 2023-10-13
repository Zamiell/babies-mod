import { CollectibleType } from "isaac-typescript-definitions";
import { hasCollectible } from "isaacscript-common";
import { EXPLOSIVE_COLLECTIBLE_TYPES } from "../../constantsCollectibleTypes";
import { Baby } from "../Baby";

const ANTI_SYNERGY_COLLECTIBLES = [
  CollectibleType.DR_FETUS, // 52
] as const;

/** Starts with 3x Cain's Other Eye + Friendship Necklace. */
export class N3EyesBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(
      player,
      ...ANTI_SYNERGY_COLLECTIBLES,
      ...EXPLOSIVE_COLLECTIBLE_TYPES,
    );
  }
}
