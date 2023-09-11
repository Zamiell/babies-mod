import {
  CollectibleType,
  GridEntityXMLType,
  PickupVariant,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import { ReadonlySet, getHighestEnumValue } from "isaacscript-common";
import { RandomBabyType } from "./enums/RandomBabyType";

export const MOD_NAME = "The Babies Mod";

/** The version is updated automatically by IsaacScript. */
export const VERSION = "1.8.0";

export const IS_DEV = false as boolean;

export const MAX_BABY_TYPE = getHighestEnumValue(RandomBabyType);

export const FADED_BLUE = Color(0, 0, 1, 0.7);
export const FADED_RED = Color(1, 0, 0, 0.7);
export const FADED_YELLOW = Color(1, 1, 0, 0.7);

export const ROOM_TYPES_TO_NOT_TRANSFORM = new ReadonlySet<RoomType>([
  RoomType.DEFAULT, // 1
  // I AM ERROR rooms should not be converted so that they have a way to escape.
  RoomType.ERROR, // 3
  RoomType.BOSS, // 5
  // Devil Rooms and Angel Rooms should not be converted since they are outside of the gird.
  RoomType.DEVIL, // 14
  RoomType.ANGEL, // 15
  // Dungeons cannot be converted because they need to have the ladder.
  RoomType.DUNGEON, // 16
  // Big rooms should not be converted.
  RoomType.BOSS_RUSH, // 17
  RoomType.BLACK_MARKET, // 22
  // The mechanic should not interfere with progressing in Greed Mode.
  RoomType.GREED_EXIT, // 23
  // The mechanic should not interfere with getting to Repentance floors.
  RoomType.SECRET_EXIT, // 27
  // The mechanic should not apply to in-between battle rooms.
  RoomType.BLUE, // 28
]);

export const PICKUP_VARIANTS_IMMUNE_TO_BABY_EFFECTS =
  new ReadonlySet<PickupVariant>([
    PickupVariant.COLLECTIBLE, // 100
    PickupVariant.SHOP_ITEM, // 150
    PickupVariant.BIG_CHEST, // 340
    PickupVariant.TROPHY, // 370
    PickupVariant.BED, // 380
  ]);

export const GRID_ENTITY_REPLACEMENT_EXCEPTIONS =
  new ReadonlySet<GridEntityXMLType>([
    GridEntityXMLType.PRESSURE_PLATE,
    GridEntityXMLType.TRAPDOOR,
    GridEntityXMLType.CRAWL_SPACE,
  ]);

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
  CollectibleType.ANTI_GRAVITY, // 222
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
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.TECH_X, // 395
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

export const AZAZEL_ANTI_SYNERGIES = [
  CollectibleType.DR_FETUS, // 52
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.EPIC_FETUS, // 168
  CollectibleType.CURSED_EYE, // 316
  CollectibleType.GODHEAD, // 331
  CollectibleType.DEAD_EYE, // 373
  CollectibleType.KIDNEY_STONE, // 440
  CollectibleType.HAEMOLACRIA, // 531
  CollectibleType.TRISAGION, // 533
  CollectibleType.SPIRIT_SWORD, // 579
  CollectibleType.NEPTUNUS, // 597
] as const;

export const TRINKETS_THAT_SYNERGIZE_WITH_TEARS = new ReadonlySet([
  TrinketType.WIGGLE_WORM, // 10
  TrinketType.FLAT_WORM, // 12
  TrinketType.SUPER_MAGNET, // 68
]);

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
