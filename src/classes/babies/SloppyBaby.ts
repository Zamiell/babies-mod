import { CollectibleType, PlayerForm } from "isaac-typescript-definitions";
import { playerHasCollectible, playerHasForm } from "isaacscript-common";
import { Baby } from "../Baby";

const SYNERGY_COLLECTIBLE_TYPES = [
  CollectibleType.INNER_EYE, // 2
  CollectibleType.MUTANT_SPIDER, // 153
  CollectibleType.TWENTY_TWENTY, // 245
  CollectibleType.WIZ, // 358
] as const;

const SYNERGY_TRANSFORMATIONS = [
  PlayerForm.CONJOINED, // 7
  PlayerForm.BOOKWORM, // 10
] as const;

/** Starts with Epic Fetus (improved). */
export class SloppyBaby extends Baby {
  override isValid(player: EntityPlayer): boolean {
    return (
      !playerHasCollectible(player, ...SYNERGY_COLLECTIBLE_TYPES) &&
      !playerHasForm(player, ...SYNERGY_TRANSFORMATIONS)
    );
  }
}
