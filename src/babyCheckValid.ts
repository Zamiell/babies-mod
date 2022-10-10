import {
  ActiveSlot,
  CollectibleType,
  ItemType,
  LevelCurse,
  PlayerForm,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  getCollectibleItemType,
  getEffectiveStage,
  hasFlag,
  onRepentanceStage,
} from "isaacscript-common";
import { RandomBabyType } from "./enums/RandomBabyType";
import g from "./globals";
import { BABIES } from "./objects/babies";
import { BabyDescription } from "./types/BabyDescription";

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
  if (baby.item !== undefined && player.HasCollectible(baby.item)) {
    return false;
  }
  if (baby.item2 !== undefined && player.HasCollectible(baby.item2)) {
    return false;
  }
  if (baby.item3 !== undefined && player.HasCollectible(baby.item3)) {
    return false;
  }

  // If the player does not have a slot for an active item, do not give them an active item baby.
  if (!checkActiveItem(player, baby)) {
    return false;
  }

  if (!checkHealth(player, babyType, baby)) {
    return false;
  }

  if (!checkCoins(player, babyType, baby)) {
    return false;
  }

  if (!checkBombs(player, babyType, baby)) {
    return false;
  }

  if (!checkKeys(player, baby)) {
    return false;
  }

  if (!checkCollectibles(player, babyType, baby)) {
    return false;
  }

  if (!checkTrinkets(player, babyType)) {
    return false;
  }

  if (!checkStage(babyType, baby)) {
    return false;
  }

  if (!checkCurses(babyType)) {
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

function checkHealth(
  player: EntityPlayer,
  babyType: RandomBabyType,
  baby: BabyDescription,
): boolean {
  const maxHearts = player.GetMaxHearts();
  const soulHearts = player.GetSoulHearts();
  const boneHearts = player.GetBoneHearts();
  const totalHealth = maxHearts + soulHearts + boneHearts;
  const babyItemSet = getBabyItemsSet(baby);

  if (baby.numHits !== undefined && totalHealth < baby.numHits) {
    return false;
  }

  if (babyItemSet.has(CollectibleType.POTATO_PEELER) && maxHearts === 0) {
    return false;
  }

  // 210
  if (babyType === RandomBabyType.MEATBOY && maxHearts === 0) {
    // Potato Peeler effect on hit.
    return false;
  }

  return true;
}

function checkCoins(
  player: EntityPlayer,
  babyType: RandomBabyType,
  baby: BabyDescription,
): boolean {
  const coins = player.GetNumCoins();
  const babyItemsSet = getBabyItemsSet(baby);

  if (baby.requireCoins === true && coins === 0) {
    return false;
  }

  // 216
  if (babyType === RandomBabyType.FANCY && coins < 10) {
    return false;
  }

  // 576
  if (babyType === RandomBabyType.FATES_REWARD && coins < 15) {
    return false;
  }

  if (babyItemsSet.has(CollectibleType.DOLLAR) && coins >= 50) {
    return false;
  }

  return true;
}

function checkBombs(
  player: EntityPlayer,
  babyType: RandomBabyType,
  baby: BabyDescription,
): boolean {
  const bombs = player.GetNumBombs();

  if (baby.requireBombs === true && bombs === 0) {
    return false;
  }

  if (
    (babyType === RandomBabyType.RAGE || babyType === RandomBabyType.BULLET) &&
    bombs >= 50
  ) {
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
  babyType: RandomBabyType,
  baby: BabyDescription,
): boolean {
  const babyItemsSet = getBabyItemsSet(baby);

  if (
    (baby.mustHaveTears === true ||
      babyItemsSet.has(CollectibleType.SOY_MILK)) &&
    (player.HasCollectible(CollectibleType.DR_FETUS) || // 52
      player.HasCollectible(CollectibleType.TECHNOLOGY) || // 68
      player.HasCollectible(CollectibleType.MOMS_KNIFE) || // 114
      player.HasCollectible(CollectibleType.BRIMSTONE) || // 118
      player.HasCollectible(CollectibleType.EPIC_FETUS) || // 168
      player.HasCollectible(CollectibleType.TECH_X)) // 395
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

  if (
    babyType === RandomBabyType.BELIAL && // 51
    player.HasCollectible(CollectibleType.MEGA_BLAST)
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.GOAT && // 62
    (player.HasCollectible(CollectibleType.GOAT_HEAD) || // 215
      player.HasCollectible(CollectibleType.DUALITY)) // 498
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.AETHER && // 106
    player.HasCollectible(CollectibleType.IPECAC)
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.MASKED && // 115
    (player.HasCollectible(CollectibleType.CHOCOLATE_MILK) || // 69
      player.HasCollectible(CollectibleType.BRIMSTONE) || // 118
      player.HasCollectible(CollectibleType.MONSTROS_LUNG) || // 229
      player.HasCollectible(CollectibleType.CURSED_EYE) || // 316
      player.HasCollectible(CollectibleType.MAW_OF_THE_VOID)) // 399
  ) {
    // Can't shoot while moving This messes up with charge items.
    return false;
  }

  if (
    babyType === RandomBabyType.EARWIG && // 128
    (player.HasCollectible(CollectibleType.COMPASS) || // 21
      player.HasCollectible(CollectibleType.TREASURE_MAP) || // 54
      player.HasCollectible(CollectibleType.MIND)) // 333
  ) {
    // 3 rooms are already explored. If the player has mapping, this effect is largely useless (but
    // having the Blue Map is okay).
    return false;
  }

  if (
    babyType === RandomBabyType.SLOPPY && // 146
    (player.HasCollectible(CollectibleType.INNER_EYE) || // 2
      player.HasCollectible(CollectibleType.MUTANT_SPIDER) || // 153
      player.HasCollectible(CollectibleType.TWENTY_TWENTY) || // 245
      player.HasCollectible(CollectibleType.WIZ) || // 358
      player.HasPlayerForm(PlayerForm.CONJOINED) || // 7
      player.HasPlayerForm(PlayerForm.BOOKWORM)) // 10
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.BAWL && // 231
    player.HasCollectible(CollectibleType.IPECAC)
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.TABBY && // 269
    player.HasCollectible(CollectibleType.MOMS_KNIFE)
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.RED_DEMON && // 278
    (player.HasCollectible(CollectibleType.EPIC_FETUS) || // 168
      player.HasCollectible(CollectibleType.TECH_X)) // 395
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.FANG_DEMON && // 281
    (player.HasCollectible(CollectibleType.MOMS_KNIFE) || // 114
      player.HasCollectible(CollectibleType.EPIC_FETUS) || // 168
      player.HasCollectible(CollectibleType.MONSTROS_LUNG) || // 229
      player.HasCollectible(CollectibleType.TECH_X)) // 395
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.LANTERN && // 292
    player.HasCollectible(CollectibleType.TRISAGION)
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.CUPCAKE && // 321
    player.HasCollectible(CollectibleType.EPIC_FETUS)
  ) {
    // High shot speed
    return false;
  }

  if (
    babyType === RandomBabyType.SLICER && // 331
    player.HasCollectible(CollectibleType.IPECAC)
  ) {
    // Slice tears Ipecac causes the tears to explode instantly, which causes unavoidable damage.
    return false;
  }

  if (
    babyType === RandomBabyType.MUSHROOM_GIRL && // 361
    player.HasCollectible(CollectibleType.DR_FETUS)
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.BLUE_GHOST && // 370
    player.HasCollectible(CollectibleType.MOMS_KNIFE)
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.YELLOW_PRINCESS && // 375
    player.HasCollectible(CollectibleType.FLAT_STONE)
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.DINO && // 376
    player.HasCollectible(CollectibleType.BOBS_BRAIN)
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.ORANGE_PIG && // 381
    (player.HasCollectible(CollectibleType.DAMOCLES) ||
      player.HasCollectible(CollectibleType.DAMOCLES_PASSIVE))
  ) {
    // Double items Damocles does not work properly with this mechanic.
    return false;
  }

  if (
    babyType === RandomBabyType.IMP && // 386
    player.HasCollectible(CollectibleType.EPIC_FETUS)
  ) {
    // Blender + flight + explosion immunity + blindfolded. Epic Fetus overwrites Mom's Knife, which
    // makes the baby not work properly.
    return false;
  }

  if (
    babyType === RandomBabyType.DARK_SPACE_SOLDIER && // 398
    player.HasCollectible(CollectibleType.IPECAC)
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.BLURRED && // 407
    (player.HasCollectible(CollectibleType.FLAT_STONE) ||
      player.HasCollectible(CollectibleType.INCUBUS))
  ) {
    // Flat Stone is manually given, so we have to explicitly code a restriction. Incubus will not
    // fire the Ludo tears, ruining the build.
    return false;
  }

  if (
    babyType === RandomBabyType.ROJEN_WHITEFOX && // 446
    player.HasCollectible(CollectibleType.POLAROID) // 327
  ) {
    return false;
  }

  if (
    (babyType === RandomBabyType.CURSED_PILLOW || // 487
      babyType === RandomBabyType.ABEL) && // 570
    (player.HasCollectible(CollectibleType.INNER_EYE) || // 2
      player.HasCollectible(CollectibleType.CUPIDS_ARROW) || // 48
      player.HasCollectible(CollectibleType.MOMS_EYE) || // 55
      player.HasCollectible(CollectibleType.LOKIS_HORNS) || // 87
      player.HasCollectible(CollectibleType.MUTANT_SPIDER) || // 153
      player.HasCollectible(CollectibleType.POLYPHEMUS) || // 169
      player.HasCollectible(CollectibleType.MONSTROS_LUNG) || // 229
      player.HasCollectible(CollectibleType.DEATHS_TOUCH) || // 237
      player.HasCollectible(CollectibleType.TWENTY_TWENTY) || // 245
      player.HasCollectible(CollectibleType.SAGITTARIUS) || // 306
      player.HasCollectible(CollectibleType.CURSED_EYE) || // 316
      player.HasCollectible(CollectibleType.DEAD_ONION) || // 336
      player.HasCollectible(CollectibleType.EYE_OF_BELIAL) || // 462
      player.HasCollectible(CollectibleType.LITTLE_HORN) || // 503
      player.HasCollectible(CollectibleType.TRISAGION) || // 533
      player.HasCollectible(CollectibleType.FLAT_STONE) || // 540
      player.HasPlayerForm(PlayerForm.CONJOINED) || // 7
      player.HasPlayerForm(PlayerForm.BOOKWORM)) // 10
  ) {
    // Missed tears cause damage and missed tears cause paralysis. Piercing, multiple shots, and
    // Flat Stone causes this to mess up.
    return false;
  }

  return true;
}

function checkTrinkets(
  player: EntityPlayer,
  babyType: RandomBabyType,
): boolean {
  if (
    babyType === RandomBabyType.SPIKE && // 166
    player.HasTrinket(TrinketType.LEFT_HAND) // 61
  ) {
    return false;
  }

  return true;
}

function checkStage(babyType: RandomBabyType, baby: BabyDescription): boolean {
  const effectiveStage = getEffectiveStage();
  const babyItemsSet = getBabyItemsSet(baby);

  if (baby.noEndFloors === true && effectiveStage >= 9) {
    return false;
  }

  if (babyItemsSet.has(CollectibleType.STEAM_SALE) && effectiveStage >= 7) {
    // Only valid for floors with shops.
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.WE_NEED_TO_GO_DEEPER) &&
    (effectiveStage <= 2 || effectiveStage >= 8)
  ) {
    // Only valid for floors that the shovel will work on.
    return false;
  }

  if (babyItemsSet.has(CollectibleType.SCAPULAR) && effectiveStage >= 7) {
    return false;
  }

  if (babyItemsSet.has(CollectibleType.CRYSTAL_BALL) && effectiveStage <= 2) {
    return false;
  }

  if (babyItemsSet.has(CollectibleType.UNDEFINED) && effectiveStage <= 2) {
    return false;
  }

  if (
    (babyItemsSet.has(CollectibleType.GOAT_HEAD) || // 215
      babyItemsSet.has(CollectibleType.DUALITY) || // 498
      babyItemsSet.has(CollectibleType.EUCHARIST)) && // 499
    (effectiveStage === 1 || effectiveStage >= 9)
  ) {
    // Only valid for floors with Devil Rooms.
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.THERES_OPTIONS) && // 249
    (effectiveStage === 6 || effectiveStage >= 8)
  ) {
    // There won't be a boss item on floor 6 or floor 8 and beyond.
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.MORE_OPTIONS) && // 414
    (effectiveStage === 1 || effectiveStage >= 7)
  ) {
    // We always have More Options on Basement 1 There are no Treasure Rooms on floors 7 and beyond.
    return false;
  }

  if (
    babyItemsSet.has(CollectibleType.VANISHING_TWIN) && // 697
    (effectiveStage === 6 || effectiveStage >= 8)
  ) {
    // Some floors have bosses that cannot be doubled.
    return false;
  }

  if (baby.trinket === TrinketType.DEVILS_CROWN && effectiveStage > 6) {
    // Devil's Crown doesn't do anything on floors that do not have Treasure Rooms.
    return false;
  }

  if (
    babyType === RandomBabyType.SHADOW && // 13
    (effectiveStage === 1 || effectiveStage >= 8)
  ) {
    // Devil Rooms / Angel Rooms go to the Black Market instead. Only valid for floors with Devil
    // Rooms. Not valid for floor 8 just in case the Black Market does not have a beam of light to
    // the Cathedral.
    return false;
  }

  if (
    babyType === RandomBabyType.ZERO && // 24
    effectiveStage === 5
  ) {
    // -0- Baby cannot open the door to Mausoleum (since it requires health to be sacrificed).
    return false;
  }

  if (
    babyType === RandomBabyType.GOAT && // 62
    (effectiveStage <= 2 || effectiveStage >= 9)
  ) {
    // Only valid for floors with Devil Rooms. Also, we are guaranteed a Devil Room on Basement 2,
    // so we don't want to have it there either.
    return false;
  }

  if (
    babyType === RandomBabyType.BOMB && // 75
    effectiveStage === 10
  ) {
    // 50% chance for bombs to have the D6 effect.
    return false;
  }

  if (
    babyType === RandomBabyType.NOSFERATU && // 109
    effectiveStage >= 8
  ) {
    // Enemies have homing projectiles This makes end-game floors too difficult.
    return false;
  }

  if (
    babyType === RandomBabyType.PUBIC && // 110
    effectiveStage === 11
  ) {
    // Must full clear Full clearing The Chest is too punishing.
    return false;
  }

  if (
    babyType === RandomBabyType.EARWIG && // 128
    effectiveStage === 1
  ) {
    // 3 rooms are already explored. This can make resetting slower, so don't have this baby on
    // Basement 1.
    return false;
  }

  if (
    babyType === RandomBabyType.TEARS && // 136
    effectiveStage === 2
  ) {
    // Starts with the Soul Jar. Getting this on Basement 2 would cause a missed devil deal.
    return false;
  }

  if (
    babyType === RandomBabyType.TWIN && // 141
    effectiveStage === 8
  ) {
    // If they mess up and go past the Boss Room, they can get the wrong path.
    return false;
  }

  if (
    babyType === RandomBabyType.CHOMPERS && // 143
    effectiveStage === 11
  ) {
    // Everything is Red Poop. There are almost no grid entities on The Chest.
    return false;
  }

  if (
    babyType === RandomBabyType.ATE_POOP && // 173
    effectiveStage === 11
  ) {
    // Destroying poops spawns random pickups. There are hardly any poops on The Chest.
    return false;
  }

  if (
    babyType === RandomBabyType.SHOPKEEPER && // 215
    effectiveStage >= 7
  ) {
    // Free shop items
    return false;
  }

  if (
    babyType === RandomBabyType.GEM && // 237
    effectiveStage >= 7
  ) {
    // Pennies spawn as nickels. Money is useless past Depths 2.
    return false;
  }

  if (
    babyType === RandomBabyType.PUZZLE && // 315
    effectiveStage === 10
  ) {
    // The D6 effect on hit.
    return false;
  }

  if (
    babyType === RandomBabyType.SCARY && // 317
    effectiveStage === 6
  ) {
    // Items cost hearts. The player may not be able to take The Polaroid (when playing a normal
    // run).
    return false;
  }

  if (
    babyType === RandomBabyType.RED_WRESTLER && // 389
    effectiveStage === 11
  ) {
    // Everything is TNT. There are almost no grid entities on The Chest / Dark Room.
    return false;
  }

  if (
    babyType === RandomBabyType.RICH && // 424
    effectiveStage >= 7
  ) {
    // Starts with 99 cents. Money is useless past Depths.
    return false;
  }

  if (
    babyType === RandomBabyType.FOLDER && // 430
    (effectiveStage === 1 || effectiveStage === 10)
  ) {
    // Swaps item/shop pools + devil/angel pools.
    return false;
  }

  if (
    babyType === RandomBabyType.BREADMEAT_HOODIEBREAD &&
    effectiveStage >= 8
  ) {
    // Everything is sped up.
    return false;
  }

  if (
    babyType === RandomBabyType.HOOLIGAN && // 514
    (effectiveStage === 6 || effectiveStage >= 8)
  ) {
    // Double enemies. Mom cannot be doubled, so don't give this baby on stage 6. It Lives cannot be
    // doubled, so don't give this baby on stage 8. Furthermore, double enemies would be too hard on
    // the final stages.
    return false;
  }

  if (
    babyType === RandomBabyType.BAGGY_CAP && // 519
    effectiveStage === 11
  ) {
    return false;
  }

  if (
    babyType === RandomBabyType.EYEBAT && // 535
    (effectiveStage === 6 || effectiveStage >= 8 || onRepentanceStage())
  ) {
    // Floors are reversed. We don't want to have this on any end floors so that we can simply the
    // logic and always spawn a trapdoor.
    return false;
  }

  if (
    babyType === RandomBabyType.DEMON && // 566
    (effectiveStage === 1 || effectiveStage >= 9)
  ) {
    // Only valid for floors with Devil Rooms.
    return false;
  }

  if (
    babyType === RandomBabyType.GHOST && // 567
    effectiveStage === 2
  ) {
    // All items from the shop pool. On stage 2, they will miss a Devil Deal, which is not fair.
    return false;
  }

  if (
    babyType === RandomBabyType.FATES_REWARD && // 576
    (effectiveStage <= 2 || effectiveStage === 6 || effectiveStage >= 10)
  ) {
    // Items cost money. On stage 1, the player does not have 15 cents. On stage 2, they will miss a
    // Devil Deal, which is not fair. On stage 6, they might not be able to buy the Polaroid (when
    // playing on a normal run). On stage 10 and 11, there are no items.
    return false;
  }

  return true;
}

function checkCurses(babyType: RandomBabyType): boolean {
  const curses = g.l.GetCurses();

  if (
    babyType === RandomBabyType.EYEBAT && // 535
    hasFlag(curses, LevelCurse.LABYRINTH)
  ) {
    // Floors are reversed.
    return false;
  }

  return true;
}

function getBabyItemsSet(baby: BabyDescription): Set<CollectibleType> {
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
