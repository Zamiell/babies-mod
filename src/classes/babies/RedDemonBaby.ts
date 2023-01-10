import { CollectibleType } from "isaac-typescript-definitions";
import { playerHasCollectible } from "isaacscript-common";
import { Baby } from "../Baby";

const COLLECTIBLE_TYPES_THAT_RUIN_THE_EFFECT = [
  CollectibleType.EPIC_FETUS, // 168
  CollectibleType.TECH_X, // 395
] as const;

/** Starts with Brimstone + Anti-Gravity. */
export class RedDemonBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return !playerHasCollectible(
      player,
      ...COLLECTIBLE_TYPES_THAT_RUIN_THE_EFFECT,
    );
  }
}
