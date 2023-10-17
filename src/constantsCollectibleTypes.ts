import { CollectibleType } from "isaac-typescript-definitions";
import { ReadonlySet } from "isaacscript-common";

/** CollectibleType.DR_FETUS (52) */
export const DR_FETUS_ANTI_SYNERGIES = [
  CollectibleType.NUMBER_ONE, // 6
  CollectibleType.CHOCOLATE_MILK, // 69
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.BRIMSTONE, // 118
  CollectibleType.EPIC_FETUS, // 168
  CollectibleType.ANTI_GRAVITY, // 222
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.DEAD_EYE, // 373
  CollectibleType.KIDNEY_STONE, // 440
  CollectibleType.LEAD_PENCIL, // 444
  CollectibleType.SINUS_INFECTION, // 459
  CollectibleType.JACOBS_LADDER, // 494
  CollectibleType.POP, // 529
  CollectibleType.HAEMOLACRIA, // 531
  CollectibleType.LACHRYPHAGY, // 532
  CollectibleType.TRISAGION, // 533
  CollectibleType.SPIRIT_SWORD, // 579
  CollectibleType.NEPTUNUS, // 597
  CollectibleType.PLUTO, // 598
  CollectibleType.C_SECTION, // 678
] as const;

/** CollectibleType.TECHNOLOGY (68) */
export const TECHNOLOGY_ANTI_SYNERGIES = [
  CollectibleType.DR_FETUS, // 52
  CollectibleType.DEAD_EYE, // 373
  CollectibleType.EYE_OF_BELIAL, // 462
  CollectibleType.TECHNOLOGY_ZERO, // 524
  CollectibleType.TRISAGION, // 533
  CollectibleType.FLAT_STONE, // 540
  CollectibleType.NEPTUNUS, // 597
] as const;

/** CollectibleType.MOMS_KNIFE (114) */
export const MOMS_KNIFE_ANTI_SYNERGIES = [
  CollectibleType.CHOCOLATE_MILK, // 69
  CollectibleType.RUBBER_CEMENT, // 221
  CollectibleType.ANTI_GRAVITY, // 222
  CollectibleType.CRICKETS_BODY, // 224
  CollectibleType.TINY_PLANET, // 233
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.SOY_MILK, // 330
  CollectibleType.DEAD_EYE, // 373
  CollectibleType.KIDNEY_STONE, // 440
  CollectibleType.SINUS_INFECTION, // 459
  CollectibleType.EYE_OF_BELIAL, // 462
  CollectibleType.TECHNOLOGY_ZERO, // 524
  CollectibleType.LACHRYPHAGY, // 532
  CollectibleType.TRISAGION, // 533
  CollectibleType.NEPTUNUS, // 597
] as const;

/** CollectibleType.BRIMSTONE (118) */
export const BRIMSTONE_ANTI_SYNERGIES = [
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.DEAD_EYE, // 373
  CollectibleType.KIDNEY_STONE, // 440
  CollectibleType.EYE_OF_BELIAL, // 462
  CollectibleType.TECHNOLOGY_ZERO, // 524
  CollectibleType.TRISAGION, // 533
  CollectibleType.FLAT_STONE, // 540
  CollectibleType.SPIRIT_SWORD, // 579
  CollectibleType.NEPTUNUS, // 597
] as const;

/** CollectibleType.IPECAC (149) */
export const IPECAC_ANTI_SYNERGIES = [
  CollectibleType.CRICKETS_BODY, // 224
  CollectibleType.COMPOUND_FRACTURE, // 453
] as const;

/** CollectibleType.EPIC_FETUS (168) */
export const EPIC_FETUS_ANTI_SYNERGIES = [
  CollectibleType.CHOCOLATE_MILK, // 69
  CollectibleType.PARASITE, // 104
  CollectibleType.TECHNOLOGY_2, // 152
  CollectibleType.ANTI_GRAVITY, // 222
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.SOY_MILK, // 330
  CollectibleType.DEAD_EYE, // 373
  CollectibleType.KIDNEY_STONE, // 440
  CollectibleType.SINUS_INFECTION, // 459
  CollectibleType.EYE_OF_BELIAL, // 462
  CollectibleType.JACOBS_LADDER, // 494
  CollectibleType.TECHNOLOGY_ZERO, // 524
  CollectibleType.TRISAGION, // 533
  CollectibleType.FLAT_STONE, // 540
  CollectibleType.SPIRIT_SWORD, // 579
  CollectibleType.NEPTUNUS, // 597
  CollectibleType.C_SECTION, // 678
] as const;

/** CollectibleType.LUDOVICO_TECHNIQUE (329) */
export const LUDOVICO_TECHNIQUE_ANTI_SYNERGIES = [
  CollectibleType.CHOCOLATE_MILK, // 69
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.EPIC_FETUS, // 168
  CollectibleType.SACRED_HEART, // 182 (because of negative shot speed)
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.TECH_X, // 395
  CollectibleType.CROWN_OF_LIGHT, // 415 (because of negative shot speed)
  CollectibleType.KIDNEY_STONE, // 440
  CollectibleType.TECHNOLOGY_ZERO, // 524
  CollectibleType.HAEMOLACRIA, // 531
  CollectibleType.SPIRIT_SWORD, // 579
  CollectibleType.NEPTUNUS, // 597
  CollectibleType.C_SECTION, // 678
] as const;

/** CollectibleType.TECH_X (395) */
export const TECH_X_ANTI_SYNERGIES = [
  CollectibleType.CHOCOLATE_MILK, // 69
  CollectibleType.PARASITE, // 104
  CollectibleType.ANTI_GRAVITY, // 222
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.DEAD_EYE, // 373
  CollectibleType.EYE_OF_BELIAL, // 462
  CollectibleType.TECHNOLOGY_ZERO, // 524
  CollectibleType.TRISAGION, // 533
  CollectibleType.FLAT_STONE, // 540
  CollectibleType.SPIRIT_SWORD, // 579
  CollectibleType.NEPTUNUS, // 597
] as const;

/** CollectibleType.SPIRIT_SWORD (579) */
export const SPIRIT_SWORD_ANTI_SYNERGIES = [
  CollectibleType.MONSTROS_LUNG, // 229
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.SOY_MILK, // 330
  CollectibleType.KIDNEY_STONE, // 440
  CollectibleType.TECHNOLOGY_ZERO, // 524
  CollectibleType.NEPTUNUS, // 597
] as const;

/** CollectibleType.C_SECTION (678) */
export const C_SECTION_ANTI_SYNERGIES = [
  CollectibleType.CHOCOLATE_MILK, // 69
  CollectibleType.MONSTROS_LUNG, // 229
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.TRISAGION, // 533
  CollectibleType.NEPTUNUS, // 597
] as const;

export const COLLECTIBLES_THAT_REMOVE_TEARS = [
  CollectibleType.DR_FETUS, // 52
  CollectibleType.TECHNOLOGY, // 68
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.BRIMSTONE, // 118
  CollectibleType.EPIC_FETUS, // 168
  CollectibleType.TECH_X, // 395
  CollectibleType.SPIRIT_SWORD, // 579
  CollectibleType.BERSERK, // 704
] as const;

export const BLINDFOLDED_ANTI_SYNERGY_COLLECTIBLE_TYPES = [
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.CAINS_OTHER_EYE, // 319
  CollectibleType.INCUBUS, // 360
  CollectibleType.FATES_REWARD, // 361
  CollectibleType.MAW_OF_THE_VOID, // 399
  CollectibleType.REVELATION, // 643
  CollectibleType.MONTEZUMAS_REVENGE, // 680
  CollectibleType.TWISTED_PAIR, // 698
] as const;

export const COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS = [
  CollectibleType.CHOCOLATE_MILK, // 69
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.BRIMSTONE, // 118
  CollectibleType.MONSTROS_LUNG, // 229
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.TECH_X, // 395
  CollectibleType.MAW_OF_THE_VOID, // 399
] as const;

export const COLLECTIBLE_REROLL_COLLECTIBLE_TYPES_SET = new ReadonlySet([
  CollectibleType.D6, // 105
  // Moving Box is not technically a reroll but it allows players to move the collectibles and
  // potentially reroll them later.
  CollectibleType.MOVING_BOX, // 523
  CollectibleType.ETERNAL_D6, // 609
  CollectibleType.SPINDOWN_DICE, // 723
]);

export const TRINKET_REROLL_COLLECTIBLE_TYPES_SET = new ReadonlySet([
  CollectibleType.D20, // 105
]);

export const BAD_MISSED_TEARS_COLLECTIBLE_TYPES = [
  CollectibleType.INNER_EYE, // 2
  CollectibleType.CUPIDS_ARROW, // 48
  CollectibleType.MOMS_EYE, // 55
  CollectibleType.LOKIS_HORNS, // 87
  CollectibleType.IPECAC, // 149 (it is anti-synergy with bombing through rooms)
  CollectibleType.MUTANT_SPIDER, // 153
  CollectibleType.POLYPHEMUS, // 169
  CollectibleType.MONSTROS_LUNG, // 229
  CollectibleType.DEATHS_TOUCH, // 237
  CollectibleType.TWENTY_TWENTY, // 245
  CollectibleType.SAGITTARIUS, // 306
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.SOY_MILK, // 330
  CollectibleType.DEAD_ONION, // 336
  CollectibleType.MAW_OF_THE_VOID, // 399
  CollectibleType.EYE_OF_BELIAL, // 462
  CollectibleType.LITTLE_HORN, // 503
  CollectibleType.HAEMOLACRIA, // 531 (it is hard to aim properly with this)
  CollectibleType.TRISAGION, // 533
  CollectibleType.FLAT_STONE, // 540
  CollectibleType.ALMOND_MILK, // 561
  CollectibleType.REVELATION, // 643
  CollectibleType.C_SECTION, // 678
] as const;

export const EXPLOSIVE_COLLECTIBLE_TYPES = [
  CollectibleType.IPECAC, // 149
  CollectibleType.FIRE_MIND, // 257
] as const;

export const MULTI_SHOT_COLLECTIBLE_TYPES = [
  CollectibleType.INNER_EYE, // 2
  CollectibleType.TWENTY_TWENTY, // 245
  CollectibleType.MUTANT_SPIDER, // 153
  CollectibleType.MONSTROS_LUNG, // 229
  CollectibleType.SATURNUS, // 595
] as const;

export const PIERCING_COLLECTIBLE_TYPES = [
  CollectibleType.CUPIDS_ARROW, // 48
  CollectibleType.DEATHS_TOUCH, // 237
  CollectibleType.SAGITTARIUS, // 306
  CollectibleType.DEAD_ONION, // 336
  CollectibleType.EYE_OF_BELIAL, // 462
] as const;

export const ON_HIT_ANTI_SYNERGY_COLLECTIBLE_TYPES = [
  CollectibleType.WHORE_OF_BABYLON, // 122
  CollectibleType.CROWN_OF_LIGHT, // 415
  CollectibleType.DARK_PRINCES_CROWN, // 442
] as const;
