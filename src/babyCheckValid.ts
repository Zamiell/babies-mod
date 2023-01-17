import {
  ActiveSlot,
  CollectibleType,
  ItemType,
  LevelStage,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  AnyFunction,
  getCollectibleItemType,
  getEffectiveStage,
  onStageWithNaturalDevilRoom,
  playerHasCollectible,
} from "isaacscript-common";
import { Baby } from "./classes/Baby";
import { RandomBabyType } from "./enums/RandomBabyType";
import { g } from "./globals";
import { BABIES } from "./objects/babies";
import { BABY_CLASS_MAP } from "./objects/babyClassMap";
import { BabyDescription } from "./types/BabyDescription";

const COLLECTIBLES_THAT_REMOVE_TEARS = [
  CollectibleType.DR_FETUS, // 52
  CollectibleType.TECHNOLOGY, // 68
  CollectibleType.MOMS_KNIFE, // 114
  CollectibleType.BRIMSTONE, // 118
  CollectibleType.EPIC_FETUS, // 168
  CollectibleType.TECH_X, // 395
  CollectibleType.SPIRIT_SWORD, // 579
  CollectibleType.C_SECTION, // 678
  CollectibleType.BERSERK, // 704
] as const;

export function babyCheckValid(
  player: EntityPlayer,
  babyType: RandomBabyType,
): boolean {
  const baby = BABIES[babyType];

  // Check to see if we already got this baby in this run / multi-character custom challenge.
  if (g.pastBabies.includes(babyType)) {
    return false;
  }

  // Check for overlapping items.
  if ("item" in baby && player.HasCollectible(baby.item)) {
    return false;
  }
  if ("item2" in baby && player.HasCollectible(baby.item2)) {
    return false;
  }
  if ("item3" in baby && player.HasCollectible(baby.item3)) {
    return false;
  }
  if ("trinket" in baby && player.HasTrinket(baby.trinket)) {
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

  if (!checkStage(baby)) {
    return false;
  }

  const babyClass = BABY_CLASS_MAP.get(babyType);
  if (babyClass !== undefined) {
    if (!checkBabyClass(player, babyClass)) {
      return false;
    }
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
  const babyItemsSet = getBabyItemsSet(baby);

  if (
    (baby.requireTears === true ||
      babyItemsSet.has(CollectibleType.SOY_MILK)) &&
    !playerHasTears(player)
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.ISAACS_TEARS) && // 323
    player.HasCollectible(CollectibleType.IPECAC) // 149
  ) {
    return false;
  }

  if (
    (babyItemsSet.has(CollectibleType.COMPASS) || // 21
      babyItemsSet.has(CollectibleType.TREASURE_MAP) || // 54
      babyItemsSet.has(CollectibleType.BLUE_MAP)) && // 246
    player.HasCollectible(CollectibleType.MIND) // 333
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.TECH_X) && // 395
    player.HasCollectible(CollectibleType.DEAD_EYE) // 373
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.DEAD_EYE) && // 373
    player.HasCollectible(CollectibleType.TECH_X) // 395
  ) {
    return false;
  }

  return true;
}

function playerHasTears(player: EntityPlayer): boolean {
  const hasCollectibleThatRemovesTears = playerHasCollectible(
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
    effectiveStage >= LevelStage.BLUE_WOMB
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.STEAM_SALE) &&
    effectiveStage >= LevelStage.WOMB_1
  ) {
    // Only valid for floors with shops.
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.WE_NEED_TO_GO_DEEPER) &&
    (effectiveStage <= LevelStage.BASEMENT_2 ||
      effectiveStage >= LevelStage.WOMB_2)
  ) {
    // Only valid for floors that the shovel will work on.
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.SCAPULAR) &&
    effectiveStage >= LevelStage.WOMB_1
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.CRYSTAL_BALL) &&
    effectiveStage <= LevelStage.BASEMENT_2
  ) {
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.UNDEFINED) &&
    effectiveStage <= LevelStage.BASEMENT_2
  ) {
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
    (effectiveStage === LevelStage.DEPTHS_2 ||
      effectiveStage >= LevelStage.WOMB_2)
  ) {
    // There won't be a boss item on floor 6 or floor 8+.
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.MORE_OPTIONS) && // 414
    (effectiveStage === LevelStage.BASEMENT_1 ||
      effectiveStage > LevelStage.DEPTHS_2)
  ) {
    // We always have More Options on Basement 1 There are no Treasure Rooms on floors 7 and beyond.
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.VANISHING_TWIN) && // 697
    (effectiveStage === LevelStage.DEPTHS_2 ||
      effectiveStage >= LevelStage.WOMB_2)
  ) {
    // Some floors have bosses that cannot be doubled.
    return false;
  }

  if (
    baby.trinket === TrinketType.DEVILS_CROWN &&
    (effectiveStage === LevelStage.BASEMENT_1 ||
      effectiveStage > LevelStage.DEPTHS_2)
  ) {
    // Devil's Crown doesn't do anything on floors that do not have Treasure Rooms.
    return false;
  }

  return true;
}

function checkBabyClass(player: EntityPlayer, babyClass: Baby): boolean {
  const effectiveStage = getEffectiveStage();

  // Racing+ gets collectibles on run start to check for a fully-unlocked save file. Thus, we
  // disable any baby that has to do with collectibles on the first floor. (These kind of babies
  // could also mess with resetting.)
  const castedBabyClass = babyClass as unknown as Record<
    string,
    AnyFunction | undefined
  >;
  const babyPreGetCollectibleMethod = castedBabyClass["preGetCollectible"];
  if (
    babyPreGetCollectibleMethod !== undefined &&
    effectiveStage === LevelStage.BASEMENT_1
  ) {
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
