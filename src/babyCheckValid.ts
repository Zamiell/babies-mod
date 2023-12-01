import {
  ActiveSlot,
  CollectibleType,
  ItemType,
  LevelStage,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import type { AnyFunction } from "isaacscript-common";
import {
  MAPPING_COLLECTIBLES,
  getCollectibleItemType,
  getCollectibleMaxCharges,
  getEffectiveStage,
  hasAnyTrinket,
  hasCollectible,
  hasHoming,
  hasPiercing,
  isActiveCollectible,
  isActiveSlotEmpty,
  levelHasRoomType,
  onAscent,
  onEffectiveStage,
  onFirstFloor,
  onRepentanceStage,
  onStage,
  onStageOrHigher,
  onStageWithNaturalDevilRoom,
  onStageWithRandomBossCollectible,
  setHas,
} from "isaacscript-common";
import type { Baby } from "./classes/Baby";
import {
  BLINDFOLDED_ANTI_SYNERGY_COLLECTIBLE_TYPES,
  BRIMSTONE_ANTI_SYNERGIES,
  COLLECTIBLES_THAT_REMOVE_TEARS,
  COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS,
  C_SECTION_ANTI_SYNERGIES,
  DR_FETUS_ANTI_SYNERGIES,
  EPIC_FETUS_ANTI_SYNERGIES,
  EXPLOSIVE_COLLECTIBLE_TYPES,
  IPECAC_ANTI_SYNERGIES,
  LUDOVICO_TECHNIQUE_ANTI_SYNERGIES,
  MOMS_KNIFE_ANTI_SYNERGIES,
  MULTI_SHOT_COLLECTIBLE_TYPES,
  ON_HIT_ANTI_SYNERGY_COLLECTIBLE_TYPES,
  PIERCING_COLLECTIBLE_TYPES,
  SPIRIT_SWORD_ANTI_SYNERGIES,
  TECHNOLOGY_ANTI_SYNERGIES,
  TECH_X_ANTI_SYNERGIES,
} from "./constantsCollectibleTypes";
import {
  TRINKETS_THAT_OPERATE_ON_ACTIVE_ITEMS,
  TRINKETS_THAT_OPERATE_ON_ACTIVE_ITEMS_WITH_CHARGES,
  TRINKETS_THAT_SYNERGIZE_WITH_TEARS,
} from "./constantsTrinketTypes";
import { COLLECTIBLE_TYPE_TO_COLLECTIBLE_TYPE_CUSTOM_MAP } from "./customCollectibles";
import type { RandomBabyType } from "./enums/RandomBabyType";
import type { BabyDescription } from "./interfaces/BabyDescription";
import { BABY_CLASS_MAP } from "./objects/babyClassMap";
import {
  getBabyCollectiblesSet,
  hasPiercingOrPiercingLikeEffect,
  hasSpectralOrSpectralLikeEffect,
  onStageWithCollectibles,
} from "./utils";

export function babyCheckValid(
  player: EntityPlayer,
  babyType: RandomBabyType,
  baby: BabyDescription,
  pastBabies: ReadonlySet<RandomBabyType>,
): boolean {
  // Check to see if we already got this baby in this run / multi-character custom challenge.
  if (pastBabies.has(babyType)) {
    return false;
  }

  const babyCollectiblesSet = getBabyCollectiblesSet(baby);

  if (!checkCollectibles(player, baby, babyCollectiblesSet)) {
    return false;
  }

  if (!checkTrinkets(player, baby)) {
    return false;
  }

  if (!checkHealth(player, baby, babyCollectiblesSet)) {
    return false;
  }

  if (!checkCoins(player, baby)) {
    return false;
  }

  if (!checkBombs(player, baby)) {
    return false;
  }

  if (!checkKeys(player, baby)) {
    return false;
  }

  if (!checkStage(baby, babyCollectiblesSet)) {
    return false;
  }

  const babyClass = BABY_CLASS_MAP.get(babyType);
  if (babyClass !== undefined && !checkBabyClass(player, babyClass)) {
    return false;
  }

  return true;
}

function checkCollectibles(
  player: EntityPlayer,
  baby: BabyDescription,
  babyCollectiblesSet: ReadonlySet<CollectibleType>,
): boolean {
  // Check for overlapping collectibles.
  if (hasCollectible(player, ...babyCollectiblesSet)) {
    return false;
  }

  // Some collectibles are modified by Racing+.
  for (const [
    collectibleType,
    collectibleTypeCustom,
  ] of COLLECTIBLE_TYPE_TO_COLLECTIBLE_TYPE_CUSTOM_MAP) {
    if (
      babyCollectiblesSet.has(collectibleType) &&
      player.HasCollectible(collectibleTypeCustom)
    ) {
      return false;
    }
  }

  if (baby.requireTears === true && !playerHasTearBuild(player)) {
    return false;
  }

  if (
    baby.blindfolded === true &&
    hasCollectible(player, ...BLINDFOLDED_ANTI_SYNERGY_COLLECTIBLE_TYPES)
  ) {
    return false;
  }

  const babyCollectibles = [...babyCollectiblesSet.values()];
  const babyGrantsFamiliar = babyCollectibles.some(
    (collectibleType) =>
      getCollectibleItemType(collectibleType) === ItemType.FAMILIAR,
  );
  if (
    babyGrantsFamiliar &&
    player.HasCollectible(CollectibleType.SACRIFICIAL_ALTAR)
  ) {
    return false;
  }

  if (!checkActiveItem(player, babyCollectiblesSet)) {
    return false;
  }

  if (
    baby.description.includes("on hit") &&
    hasCollectible(player, ...ON_HIT_ANTI_SYNERGY_COLLECTIBLE_TYPES)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.SPOON_BENDER) && // 3
    hasHoming(player)
  ) {
    return false;
  }

  if (
    (babyCollectiblesSet.has(CollectibleType.COMPASS) || // 21
      babyCollectiblesSet.has(CollectibleType.TREASURE_MAP) || // 54
      babyCollectiblesSet.has(CollectibleType.BLUE_MAP)) && // 246
    player.HasCollectible(CollectibleType.MIND) // 333
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.CUPIDS_ARROW) && // 48
    hasPiercingOrPiercingLikeEffect(player)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.DR_FETUS) && // 52
    hasCollectible(player, ...DR_FETUS_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...DR_FETUS_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.DR_FETUS) // 52
  ) {
    return false;
  }

  // Dr. Fetus becomes more difficult to play with a piercing build.
  if (
    babyCollectiblesSet.has(CollectibleType.DR_FETUS) && // 52
    hasPiercing(player)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.DR_FETUS) && // 52
    player.HasCollectible(CollectibleType.CUBE_BABY)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.TECHNOLOGY) && // 68
    hasCollectible(player, ...TECHNOLOGY_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...TECHNOLOGY_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.TECHNOLOGY) // 68
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.D6) && // 105
    !onStageWithCollectibles()
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.MOMS_KNIFE) && // 114
    hasCollectible(player, ...MOMS_KNIFE_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...MOMS_KNIFE_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.MOMS_KNIFE) // 114
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.OUIJA_BOARD) && // 115
    hasSpectralOrSpectralLikeEffect(player)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.BRIMSTONE) && // 118
    hasCollectible(player, ...BRIMSTONE_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...BRIMSTONE_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.BRIMSTONE) // 118
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.IPECAC) && // 149
    hasCollectible(player, ...IPECAC_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...IPECAC_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.IPECAC) // 149
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.EPIC_FETUS) && // 168
    hasCollectible(player, ...EPIC_FETUS_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...EPIC_FETUS_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.EPIC_FETUS) // 168
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.MONSTROS_LUNG) && // 229
    hasCollectible(player, ...MULTI_SHOT_COLLECTIBLE_TYPES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...MULTI_SHOT_COLLECTIBLE_TYPES) &&
    player.HasCollectible(CollectibleType.MONSTROS_LUNG) // 229
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.FIRE_MIND) && // 257
    hasPiercing(player)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...PIERCING_COLLECTIBLE_TYPES) &&
    player.HasCollectible(CollectibleType.FIRE_MIND) // 257
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.ISAACS_TEARS) && // 323
    hasCollectible(player, ...EXPLOSIVE_COLLECTIBLE_TYPES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...EXPLOSIVE_COLLECTIBLE_TYPES) && // 323
    player.HasCollectible(CollectibleType.ISAACS_TEARS)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.LUDOVICO_TECHNIQUE) && // 329
    hasCollectible(player, ...LUDOVICO_TECHNIQUE_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...LUDOVICO_TECHNIQUE_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.LUDOVICO_TECHNIQUE) // 329
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.DEAD_ONION) && // 336
    hasPiercingOrPiercingLikeEffect(player) &&
    hasSpectralOrSpectralLikeEffect(player)
  ) {
    return false;
  }

  // Don't let the player duplicate a powerful collectible too early on in the run.
  if (
    babyCollectiblesSet.has(CollectibleType.DIPLOPIA) && // 347
    !onEffectiveStage(LevelStage.BASEMENT_1, LevelStage.BASEMENT_2)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.DEAD_EYE) && // 373
    player.HasCollectible(CollectibleType.TRISAGION)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.TECH_X) && // 395
    hasCollectible(player, ...TECH_X_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...TECH_X_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.TECH_X) // 395
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.EYE_OF_BELIAL) && // 462
    hasPiercingOrPiercingLikeEffect(player)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.SMELTER) && // 479
    !hasAnyTrinket(player)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.CAMO_UNDIES) && // 497
    hasCollectible(player, ...COLLECTIBLE_TYPES_THAT_GRANT_CHARGE_SHOTS)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.HAEMOLACRIA) && // 531
    hasCollectible(player, ...PIERCING_COLLECTIBLE_TYPES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...PIERCING_COLLECTIBLE_TYPES) &&
    player.HasCollectible(CollectibleType.HAEMOLACRIA) // 531
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.LACHRYPHAGY) && // 532
    hasCollectible(player, ...EXPLOSIVE_COLLECTIBLE_TYPES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...EXPLOSIVE_COLLECTIBLE_TYPES) &&
    player.HasCollectible(CollectibleType.LACHRYPHAGY) // 532
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.TRISAGION) && // 533
    player.HasCollectible(CollectibleType.DEAD_EYE)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.SPIRIT_SWORD) && // 579
    hasCollectible(player, ...SPIRIT_SWORD_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...SPIRIT_SWORD_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.SPIRIT_SWORD) // 579
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.ETERNAL_D6) && // 609
    !onStageWithCollectibles()
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.CUBE_BABY) && // 652
    player.HasCollectible(CollectibleType.DR_FETUS)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.C_SECTION) && // 678
    hasCollectible(player, ...C_SECTION_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...C_SECTION_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.C_SECTION) // 678
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.GLITCHED_CROWN) && // 689
    // Glitched Crown is too powerful for the first two floors.
    (onEffectiveStage(LevelStage.BASEMENT_1, LevelStage.BASEMENT_2) ||
      !onStageWithCollectibles())
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.SACRED_ORB) && // 691
    // Sacred Orb is almost useless on the first floor.
    (onFirstFloor() || !onStageWithCollectibles())
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.SPINDOWN_DICE) && // 723
    (!onStageWithCollectibles() ||
      // Spindown Dice can be used on Knife Piece 1 to break the game.
      (onStage(LevelStage.BASEMENT_2) && onRepentanceStage()))
  ) {
    return false;
  }

  // -------------------------------------
  // Synergies with 2 or more collectibles
  // -------------------------------------

  // Monstro's Lung removes explosion immunity from Dr.Fetus + Ipecac bombs, which also makes it
  // harder to bomb out of rooms.
  if (
    player.HasCollectible(CollectibleType.MONSTROS_LUNG) && // 229
    babyCollectiblesSet.has(CollectibleType.DR_FETUS) && // 52
    babyCollectiblesSet.has(CollectibleType.IPECAC) // 149
  ) {
    return false;
  }
  if (
    babyCollectiblesSet.has(CollectibleType.MONSTROS_LUNG) && // 229
    player.HasCollectible(CollectibleType.DR_FETUS) && // 52
    player.HasCollectible(CollectibleType.IPECAC) // 149
  ) {
    return false;
  }

  // Certain collectible combinations make the tear rate too low.
  if (
    babyCollectiblesSet.has(CollectibleType.BRIMSTONE) && // 118
    babyCollectiblesSet.has(CollectibleType.HAEMOLACRIA) && // 531
    player.HasCollectible(CollectibleType.C_SECTION)
  ) {
    return false;
  }
  if (
    player.HasCollectible(CollectibleType.BRIMSTONE) && // 118
    player.HasCollectible(CollectibleType.HAEMOLACRIA) && // 531
    babyCollectiblesSet.has(CollectibleType.C_SECTION)
  ) {
    return false;
  }

  // Immaculate Heart can cause unavoidable damage with the Ipecac + Trisagion synergy.
  if (
    babyCollectiblesSet.has(CollectibleType.IPECAC) && // 149
    babyCollectiblesSet.has(CollectibleType.TRISAGION) && // 533
    player.HasCollectible(CollectibleType.IMMACULATE_HEART) // 573
  ) {
    return false;
  }
  if (
    player.HasCollectible(CollectibleType.IPECAC) && // 149
    player.HasCollectible(CollectibleType.TRISAGION) && // 533
    babyCollectiblesSet.has(CollectibleType.IMMACULATE_HEART) // 573
  ) {
    return false;
  }

  return true;
}

/**
 * If the player does not have a slot for an active item, do not give them an active item baby.
 *
 * There are no babies that grant 2 or more active items. (Lowface Baby technically starts with Book
 * of Virtues + Unicorn Stump, but only one active slot is needed for this combo.) Thus, this
 * function only checks to see if there is one empty active slot available.
 */
function checkActiveItem(
  player: EntityPlayer,
  babyCollectiblesSet: ReadonlySet<CollectibleType>,
): boolean {
  const babyActiveItems = [...babyCollectiblesSet].filter((collectibleType) =>
    isActiveCollectible(collectibleType),
  );
  if (babyActiveItems.length === 0) {
    return true;
  }

  const activeItem = player.GetActiveItem(ActiveSlot.PRIMARY);
  if (activeItem === CollectibleType.NULL) {
    return true;
  }

  const secondaryActiveItem = player.GetActiveItem(ActiveSlot.SECONDARY);
  const hasSchoolbag = player.HasCollectible(CollectibleType.SCHOOLBAG);
  if (secondaryActiveItem === CollectibleType.NULL && hasSchoolbag) {
    return true;
  }

  return false;
}

function checkTrinkets(player: EntityPlayer, baby: BabyDescription): boolean {
  if (baby.trinket === undefined) {
    return true;
  }

  // Check for overlapping trinkets.
  if (player.HasTrinket(baby.trinket)) {
    return false;
  }

  if (
    TRINKETS_THAT_SYNERGIZE_WITH_TEARS.has(baby.trinket) &&
    !playerHasTearBuild(player)
  ) {
    return false;
  }

  if (
    TRINKETS_THAT_OPERATE_ON_ACTIVE_ITEMS.has(baby.trinket) &&
    isActiveSlotEmpty(player)
  ) {
    return false;
  }

  if (TRINKETS_THAT_OPERATE_ON_ACTIVE_ITEMS_WITH_CHARGES.has(baby.trinket)) {
    const activeItem = player.GetActiveItem();
    if (activeItem !== CollectibleType.NULL) {
      const maxCharges = getCollectibleMaxCharges(activeItem);
      if (maxCharges === 0) {
        return false;
      }
    }
  }

  return true;
}

function playerHasTearBuild(player: EntityPlayer): boolean {
  return !hasCollectible(player, ...COLLECTIBLES_THAT_REMOVE_TEARS);
}

function checkHealth(
  player: EntityPlayer,
  baby: BabyDescription,
  babyCollectiblesSet: ReadonlySet<CollectibleType>,
): boolean {
  const maxHearts = player.GetMaxHearts();
  const soulHearts = player.GetSoulHearts();
  const boneHearts = player.GetBoneHearts();
  const totalHealth = maxHearts + soulHearts + boneHearts;

  if (baby.requireNumHits !== undefined && totalHealth < baby.requireNumHits) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.POTATO_PEELER) &&
    maxHearts === 0
  ) {
    return false;
  }

  return true;
}

function checkCoins(player: EntityPlayer, baby: BabyDescription): boolean {
  const coins = player.GetNumCoins();
  const babyCollectiblesSet = getBabyCollectiblesSet(baby);

  if (baby.requireCoins === true && coins === 0) {
    return false;
  }

  if (babyCollectiblesSet.has(CollectibleType.DOLLAR) && coins >= 50) {
    return false;
  }

  return true;
}

function checkBombs(player: EntityPlayer, baby: BabyDescription): boolean {
  const bombs = player.GetNumBombs();

  if (baby.requireBombs === true && bombs === 0) {
    return false;
  }

  return true;
}

function checkKeys(player: EntityPlayer, baby: BabyDescription): boolean {
  const keys = player.GetNumKeys();

  if (baby.requireKeys === true && keys === 0) {
    return false;
  }

  return true;
}

function checkStage(
  baby: BabyDescription,
  babyCollectiblesSet: ReadonlySet<CollectibleType>,
): boolean {
  const effectiveStage = getEffectiveStage();

  if (baby.requireNoEndFloors === true && onStageOrHigher(LevelStage.WOMB_2)) {
    return false;
  }

  if (
    baby.allCollectiblesFromPool !== undefined &&
    (onEffectiveStage(
      // We don't want pool replacements to affect resetting for a starting item.
      LevelStage.BASEMENT_1,
      // We don't want pool replacements to affect resetting the player's first devil deal.
      LevelStage.BASEMENT_2,
    ) ||
      !onStageWithCollectibles())
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.STEAM_SALE) &&
    !levelHasRoomType(RoomType.SHOP)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.WE_NEED_TO_GO_DEEPER) &&
    (effectiveStage <= LevelStage.BASEMENT_2 ||
      onStageOrHigher(LevelStage.WOMB_2))
  ) {
    // - Only valid for floors that the shovel will work on.
    // - Don't grant it on Basement 1 since the floor is so short.
    // - Don't grant it on Basement 2 since they will need the devil deal.
    // - Don't grant it on Womb 2 since they might need to go to The Chest.
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.SCAPULAR) &&
    onStageOrHigher(LevelStage.WOMB_1)
  ) {
    // This is too powerful when combined with The Polaroid.
    return false;
  }

  if (
    setHas(babyCollectiblesSet, ...MAPPING_COLLECTIBLES) &&
    effectiveStage <= LevelStage.BASEMENT_2
  ) {
    // Mapping is not very useful on the first two floors.
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.UNDEFINED) &&
    (effectiveStage <= LevelStage.BASEMENT_2 || onStage(LevelStage.WOMB_2))
  ) {
    // - Undefined is not very useful on the first two floors.
    // - Players will generally not use Undefined on Womb 2 (since it can take you in the wrong
    //   direction).
    return false;
  }

  if (
    (babyCollectiblesSet.has(CollectibleType.GOAT_HEAD) || // 215
      babyCollectiblesSet.has(CollectibleType.DUALITY) || // 498
      babyCollectiblesSet.has(CollectibleType.EUCHARIST)) && // 499
    !onStageWithNaturalDevilRoom()
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.THERES_OPTIONS) && // 249
    !levelHasRoomType(RoomType.BOSS) &&
    !onStageWithRandomBossCollectible() &&
    !onAscent()
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.MORE_OPTIONS) && // 414
    (!levelHasRoomType(RoomType.TREASURE) ||
      onFirstFloor() ||
      onStage(LevelStage.BLUE_WOMB))
  ) {
    // In a speedrun, we might have More Options on Basement 1. Additionally, More Options does not
    // work on Blue Womb.
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.SOL) && // 588
    (!levelHasRoomType(RoomType.BOSS) || onStage(LevelStage.BLUE_WOMB))
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.LUNA) && // 589
    !levelHasRoomType(RoomType.SECRET)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.VOODOO_HEAD) && // 599
    !levelHasRoomType(RoomType.CURSE)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.VANISHING_TWIN) && // 697
    !onStageWithRandomBossCollectible() &&
    !onAscent()
  ) {
    // Some floors have bosses that cannot be doubled.
    return false;
  }

  if (
    baby.trinket === TrinketType.STORE_CREDIT &&
    !levelHasRoomType(RoomType.SHOP)
  ) {
    return false;
  }

  if (
    baby.trinket === TrinketType.DEVILS_CROWN &&
    (!levelHasRoomType(RoomType.TREASURE) || onFirstFloor())
  ) {
    // Players could be resetting for an collectible to start a speedrun and we do not want them to
    // start with a Devil Room collectible.
    return false;
  }

  return true;
}

function checkBabyClass(player: EntityPlayer, babyClass: Baby): boolean {
  // Racing+ gets collectibles on run start to check for a fully-unlocked save file. Thus, we
  // disable any baby that has to do with collectibles on the first floor. (These kind of babies
  // could also mess with resetting.)
  const castedBabyClass = babyClass as unknown as Record<
    string,
    AnyFunction | undefined
  >;
  const babyPreGetCollectibleMethod = castedBabyClass["preGetCollectible"];
  if (babyPreGetCollectibleMethod !== undefined && onFirstFloor()) {
    return false;
  }

  return babyClass.isValid(player);
}
