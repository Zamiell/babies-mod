import {
  ActiveSlot,
  CollectibleType,
  LevelStage,
  RoomType,
  TrinketType,
} from "isaac-typescript-definitions";
import type { AnyFunction } from "isaacscript-common";
import {
  MAPPING_COLLECTIBLES,
  getEffectiveStage,
  hasAnyTrinket,
  hasCollectible,
  hasPiercing,
  hasSpectral,
  isActiveCollectible,
  isActiveSlotEmpty,
  levelHasRoomType,
  onAscent,
  onFirstFloor,
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
  C_SECTION_ANTI_SYNERGIES,
  DR_FETUS_ANTI_SYNERGIES,
  EPIC_FETUS_ANTI_SYNERGIES,
  LUDOVICO_TECHNIQUE_ANTI_SYNERGIES,
  MOMS_KNIFE_ANTI_SYNERGIES,
  SPIRIT_SWORD_ANTI_SYNERGIES,
  TECHNOLOGY_ANTI_SYNERGIES,
  TECH_X_ANTI_SYNERGIES,
  TRINKETS_THAT_SYNERGIZE_WITH_TEARS,
} from "./constants";
import type { RandomBabyType } from "./enums/RandomBabyType";
import type { BabyDescription } from "./interfaces/BabyDescription";
import { BABY_CLASS_MAP } from "./objects/babyClassMap";

export function babyCheckValid(
  player: EntityPlayer,
  babyType: RandomBabyType,
  baby: BabyDescription,
  pastBabies: Set<RandomBabyType>,
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
  babyCollectiblesSet: Set<CollectibleType>,
): boolean {
  // Check for overlapping collectibles.
  for (const attribute of [
    "collectible",
    "collectible2",
    "collectible3",
  ] as const) {
    const collectibleType = baby[attribute];
    if (
      collectibleType !== undefined &&
      player.HasCollectible(collectibleType)
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

  if (!checkActiveItem(player, babyCollectiblesSet)) {
    return false;
  }

  if (!checkCollectibleAntiSynergyFromArray(player, babyCollectiblesSet)) {
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
    hasPiercing(player)
  ) {
    return false;
  }

  // Monstro's Lung removes explosion immunity from Dr.Fetus + Ipecac bombs.
  if (
    babyCollectiblesSet.has(CollectibleType.DR_FETUS) && // 52
    babyCollectiblesSet.has(CollectibleType.IPECAC) && // 149
    player.HasCollectible(CollectibleType.MONSTROS_LUNG) // 229
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.OUIJA_BOARD) && // 115
    hasSpectral(player)
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

  if (
    babyCollectiblesSet.has(CollectibleType.ISAACS_TEARS) && // 323
    player.HasCollectible(CollectibleType.IPECAC) // 149
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.DEAD_ONION) && // 336
    hasPiercing(player) &&
    hasSpectral(player)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.EYE_OF_BELIAL) && // 462
    hasPiercing(player)
  ) {
    return false;
  }

  if (
    babyCollectiblesSet.has(CollectibleType.SMELTER) && // 479
    !hasAnyTrinket(player)
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
  babyCollectiblesSet: Set<CollectibleType>,
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

/** Some collectible anti-synergies are hard-coded in arrays. */
function checkCollectibleAntiSynergyFromArray(
  player: EntityPlayer,
  babyCollectiblesSet: Set<CollectibleType>,
): boolean {
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

  return true;
}

function checkTrinkets(player: EntityPlayer, baby: BabyDescription): boolean {
  // Check for overlapping trinkets.
  if (baby.trinket !== undefined && player.HasTrinket(baby.trinket)) {
    return false;
  }

  if (
    baby.trinket !== undefined &&
    TRINKETS_THAT_SYNERGIZE_WITH_TEARS.has(baby.trinket) &&
    !playerHasTearBuild(player)
  ) {
    return false;
  }

  if (
    baby.trinket === TrinketType.BUTTER && // 479
    isActiveSlotEmpty(player)
  ) {
    return false;
  }

  return true;
}

function playerHasTearBuild(player: EntityPlayer): boolean {
  return !hasCollectible(player, ...COLLECTIBLES_THAT_REMOVE_TEARS);
}

function checkHealth(
  player: EntityPlayer,
  baby: BabyDescription,
  babyCollectiblesSet: Set<CollectibleType>,
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
  babyCollectiblesSet: Set<CollectibleType>,
): boolean {
  const effectiveStage = getEffectiveStage();

  if (
    baby.requireNoEndFloors === true &&
    onStageOrHigher(LevelStage.BLUE_WOMB)
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
    effectiveStage <= LevelStage.BASEMENT_2
  ) {
    // Undefined is not very useful on the first two floors.
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

export function getBabyCollectiblesSet(
  baby: BabyDescription,
): Set<CollectibleType> {
  const babyCollectiblesSet = new Set<CollectibleType>();
  if (baby.collectible !== undefined) {
    babyCollectiblesSet.add(baby.collectible);
  }
  if (baby.collectible2 !== undefined) {
    babyCollectiblesSet.add(baby.collectible2);
  }
  if (baby.collectible3 !== undefined) {
    babyCollectiblesSet.add(baby.collectible3);
  }

  return babyCollectiblesSet;
}
