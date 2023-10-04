import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  hasCollectible,
} from "isaacscript-common";
import { BLINDFOLDED_ANTI_SYNERGY_COLLECTIBLE_TYPES } from "../../constantsCollectibleTypes";
import { Baby } from "../Baby";

const COLLECTIBLES_THAT_BREAK_THE_BLINDFOLD_MECHANIC = [
  ...BLINDFOLDED_ANTI_SYNERGY_COLLECTIBLE_TYPES,
  // - CollectibleType.DR_FETUS (52) does not break the mechanic.
  // - CollectibleType.TECHNOLOGY (68) does not break the mechanic.
  CollectibleType.CHOCOLATE_MILK, // 69
  // - CollectibleType.BRIMSTONE (118) does not break the mechanic.
  // - CollectibleType.NOTCHED_AXE (147) does not break the mechanic.
  CollectibleType.TECHNOLOGY_2, // 152
  // - CollectibleType.EPIC_FETUS (168) does not break the mechanic.
  CollectibleType.MONSTROS_LUNG, // 229
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.LUDOVICO_TECHNIQUE, // 329
  CollectibleType.TECH_X, // 395
  // The blindfold will not prevent the big initial stone from Kidney Stone firing, but it does
  // prevent all of the smaller tears.
  CollectibleType.KIDNEY_STONE, // 440
  CollectibleType.METRONOME, // 488
  // - CollectibleType.SULFUR (556) does not break the mechanic (since it is the same as Brimstone).
  // - CollectibleType.SPIRIT_SWORD (579) does not break the mechanic.
  // - CollectibleType.NEPTUNUS (597) does not break the mechanic. (The charge bar appears, but no
  //   tears are actually produced.)
  CollectibleType.C_SECTION, // 678
  // - CollectibleType.BERSERK (704) does not break the mechanic.
] as const;

/** Starts with Rocket in a Jar + golden bomb + blindfolded. */
export class BulletBaby extends Baby {
  /** Some collectibles prevent the custom blindfold mechanic from working properly. */
  override isValid(player: EntityPlayer): boolean {
    return !hasCollectible(
      player,
      ...COLLECTIBLES_THAT_BREAK_THE_BLINDFOLD_MECHANIC,
    );
  }

  /** Prevent the player from shooting. (We cannot use the `blindfolded` property for this baby.) */
  @CallbackCustom(ModCallbackCustom.POST_PEFFECT_UPDATE_REORDERED)
  postPEffectUpdateReordered(player: EntityPlayer): void {
    player.FireDelay = 10;
  }
}
