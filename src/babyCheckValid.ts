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
  getEffectiveStage,
  hasCollectible,
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
import { g } from "./globals";
import { BABIES } from "./objects/babies";
import { BABY_CLASS_MAP } from "./objects/babyClassMap";
import type { BabyDescription } from "./types/BabyDescription";

export function babyCheckValid(
  player: EntityPlayer,
  babyType: RandomBabyType,
): boolean {
  const baby = BABIES[babyType] as BabyDescription;

  // Check to see if we already got this baby in this run / multi-character custom challenge.
  if (g.pastBabies.has(babyType)) {
    return false;
  }

  // Check for overlapping items.
  if (baby.item !== undefined && player.HasCollectible(baby.item)) {
    return false;
  }
  if (baby.item2 !== undefined && player.HasCollectible(baby.item2)) {
    return false;
  }
  if (baby.item3 !== undefined && player.HasCollectible(baby.item3)) {
    return false;
  }
  if (baby.trinket !== undefined && player.HasTrinket(baby.trinket)) {
    return false;
  }

  // If the player does not have a slot for an active item, do not give them an active item baby.
  if (!checkActiveItem(player, baby)) {
    return false;
  }

  if (!checkHealth(player, baby)) {
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

  if (!checkCollectibles(player, baby)) {
    return false;
  }

  if (!checkTrinkets(player, baby)) {
    return false;
  }

  if (!checkStage(baby)) {
    return false;
  }

  const babyClass = BABY_CLASS_MAP.get(babyType);
  if (babyClass !== undefined && !checkBabyClass(player, babyClass)) {
    return false;
  }

  return true;
}

function checkActiveItem(player: EntityPlayer, baby: BabyDescription): boolean {
  const activeItem = player.GetActiveItem();
  const secondaryActiveItem = player.GetActiveItem(ActiveSlot.SECONDARY);

  if (
    baby.item !== undefined &&
    getCollectibleItemType(baby.item) === ItemType.ACTIVE &&
    activeItem !== CollectibleType.NULL
  ) {
    const hasSchoolbag = player.HasCollectible(CollectibleType.SCHOOLBAG);
    if (!hasSchoolbag) {
      // Since the player already has an active item, there is no room for another active item.
      return false;
    }

    const hasItemInSchoolbag = secondaryActiveItem !== CollectibleType.NULL;
    if (hasItemInSchoolbag) {
      // The player has both an active item and an item inside of the Schoolbag.
      return false;
    }
  }

  return true;
}

function checkHealth(player: EntityPlayer, baby: BabyDescription): boolean {
  const maxHearts = player.GetMaxHearts();
  const soulHearts = player.GetSoulHearts();
  const boneHearts = player.GetBoneHearts();
  const totalHealth = maxHearts + soulHearts + boneHearts;
  const babyItemSet = getBabyItemsSet(baby);

  if (baby.requireNumHits !== undefined && totalHealth < baby.requireNumHits) {
    return false;
  }

  if (babyItemSet.has(CollectibleType.POTATO_PEELER) && maxHearts === 0) {
    return false;
  }

  return true;
}

function checkCoins(player: EntityPlayer, baby: BabyDescription): boolean {
  const coins = player.GetNumCoins();
  const babyItemsSet = getBabyItemsSet(baby);

  if (baby.requireCoins === true && coins === 0) {
    return false;
  }

  if (babyItemsSet.has(CollectibleType.DOLLAR) && coins >= 50) {
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

function checkCollectibles(
  player: EntityPlayer,
  baby: BabyDescription,
): boolean {
  if (baby.requireTears === true && !playerHasTears(player)) {
    return false;
  }

  const babyItemsSet = getBabyItemsSet(baby);

  // --------------------------
  // Array-based anti-synergies
  // --------------------------

  if (
    babyItemsSet.has(CollectibleType.DR_FETUS) && // 52
    hasCollectible(player, ...DR_FETUS_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyItemsSet, ...DR_FETUS_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.DR_FETUS) // 52
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.TECHNOLOGY) && // 68
    hasCollectible(player, ...TECHNOLOGY_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyItemsSet, ...TECHNOLOGY_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.TECHNOLOGY) // 68
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.MOMS_KNIFE) && // 114
    hasCollectible(player, ...MOMS_KNIFE_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyItemsSet, ...MOMS_KNIFE_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.MOMS_KNIFE) // 114
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.BRIMSTONE) && // 118
    hasCollectible(player, ...BRIMSTONE_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyItemsSet, ...BRIMSTONE_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.BRIMSTONE) // 118
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.EPIC_FETUS) && // 168
    hasCollectible(player, ...EPIC_FETUS_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyItemsSet, ...EPIC_FETUS_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.EPIC_FETUS) // 168
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.LUDOVICO_TECHNIQUE) && // 329
    hasCollectible(player, ...LUDOVICO_TECHNIQUE_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyItemsSet, ...LUDOVICO_TECHNIQUE_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.LUDOVICO_TECHNIQUE) // 329
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.TECH_X) && // 395
    hasCollectible(player, ...TECH_X_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyItemsSet, ...TECH_X_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.TECH_X) // 395
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.SPIRIT_SWORD) && // 579
    hasCollectible(player, ...SPIRIT_SWORD_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyItemsSet, ...SPIRIT_SWORD_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.SPIRIT_SWORD) // 579
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.C_SECTION) && // 678
    hasCollectible(player, ...C_SECTION_ANTI_SYNERGIES)
  ) {
    return false;
  }

  if (
    setHas(babyItemsSet, ...C_SECTION_ANTI_SYNERGIES) &&
    player.HasCollectible(CollectibleType.C_SECTION) // 678
  ) {
    return false;
  }

  // --------------------
  // Other anti-synergies
  // --------------------

  if (
    (babyItemsSet.has(CollectibleType.COMPASS) || // 21
      babyItemsSet.has(CollectibleType.TREASURE_MAP) || // 54
      babyItemsSet.has(CollectibleType.BLUE_MAP)) && // 246
    player.HasCollectible(CollectibleType.MIND) // 333
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.ISAACS_TEARS) && // 323
    player.HasCollectible(CollectibleType.IPECAC) // 149
  ) {
    return false;
  }

  // Monstro's Lung removes explosion immunity from Dr.Fetus + Ipecac bombs.
  if (
    babyItemsSet.has(CollectibleType.DR_FETUS) && // 52
    babyItemsSet.has(CollectibleType.IPECAC) && // 149
    player.HasCollectible(CollectibleType.MONSTROS_LUNG) // 229
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.MONSTROS_LUNG) && // 229
    player.HasCollectible(CollectibleType.DR_FETUS) && // 52
    player.HasCollectible(CollectibleType.IPECAC) // 149
  ) {
    return false;
  }

  return true;
}

function checkTrinkets(player: EntityPlayer, baby: BabyDescription): boolean {
  if (
    baby.trinket !== undefined &&
    TRINKETS_THAT_SYNERGIZE_WITH_TEARS.has(baby.trinket) &&
    !playerHasTears(player)
  ) {
    return false;
  }

  return true;
}

function playerHasTears(player: EntityPlayer): boolean {
  const hasCollectibleThatRemovesTears = hasCollectible(
    player,
    ...COLLECTIBLES_THAT_REMOVE_TEARS,
  );
  return !hasCollectibleThatRemovesTears;
}

function checkStage(baby: BabyDescription): boolean {
  const effectiveStage = getEffectiveStage();
  const babyItemsSet = getBabyItemsSet(baby);

  if (
    baby.requireNoEndFloors === true &&
    onStageOrHigher(LevelStage.BLUE_WOMB)
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.STEAM_SALE) &&
    !levelHasRoomType(RoomType.SHOP)
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.WE_NEED_TO_GO_DEEPER) &&
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
    babyItemsSet.has(CollectibleType.SCAPULAR) &&
    onStageOrHigher(LevelStage.WOMB_1)
  ) {
    // This is too powerful when combined with The Polaroid.
    return false;
  }

  if (
    setHas(babyItemsSet, ...MAPPING_COLLECTIBLES) &&
    effectiveStage <= LevelStage.BASEMENT_2
  ) {
    // Mapping is not very useful on the first two floors.
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.UNDEFINED) &&
    effectiveStage <= LevelStage.BASEMENT_2
  ) {
    // Undefined is not very useful on the first two floors.
    return false;
  }

  if (
    (babyItemsSet.has(CollectibleType.GOAT_HEAD) || // 215
      babyItemsSet.has(CollectibleType.DUALITY) || // 498
      babyItemsSet.has(CollectibleType.EUCHARIST)) && // 499
    !onStageWithNaturalDevilRoom()
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.THERES_OPTIONS) && // 249
    !levelHasRoomType(RoomType.BOSS) &&
    !onStageWithRandomBossCollectible() &&
    !onAscent()
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.MORE_OPTIONS) && // 414
    (!levelHasRoomType(RoomType.TREASURE) ||
      onFirstFloor() ||
      onStage(LevelStage.BLUE_WOMB))
  ) {
    // In a speedrun, we might have More Options on Basement 1. Additionally, More Options does not
    // work on Blue Womb.
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.SOL) && // 588
    (!levelHasRoomType(RoomType.BOSS) || onStage(LevelStage.BLUE_WOMB))
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.LUNA) && // 589
    !levelHasRoomType(RoomType.SECRET)
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.VANISHING_TWIN) && // 697
    !levelHasRoomType(RoomType.BOSS) &&
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
    // Players could be resetting for an item to start a speedrun and we do not want them to start
    // with a Devil Room item.
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

export function getBabyItemsSet(baby: BabyDescription): Set<CollectibleType> {
  const babyItemsSet = new Set<CollectibleType>();
  if (baby.item !== undefined) {
    babyItemsSet.add(baby.item);
  }
  if (baby.item2 !== undefined) {
    babyItemsSet.add(baby.item2);
  }
  if (baby.item3 !== undefined) {
    babyItemsSet.add(baby.item3);
  }

  return babyItemsSet;
}
