import { getCollectibleItemType, getEffectiveStage } from "isaacscript-common";
import { BABIES } from "./babies";
import g from "./globals";
import { BabyDescription } from "./types/BabyDescription";

export function babyCheckValid(player: EntityPlayer, babyType: int): boolean {
  const baby = BABIES[babyType];
  if (baby === undefined) {
    error(`Baby ${babyType} was not found.`);
  }

  // Check to see if we already got this baby in this run / multi-character custom challenge
  if (g.pastBabies.includes(babyType)) {
    return false;
  }

  // Check for overlapping items
  if (baby.item !== undefined && player.HasCollectible(baby.item)) {
    return false;
  }
  if (baby.item2 !== undefined && player.HasCollectible(baby.item2)) {
    return false;
  }

  // If the player does not have a slot for an active item, do not give them an active item baby
  if (!checkActiveItem(player, baby)) {
    return false;
  }

  // Check for conflicting health values
  if (!checkHealth(player, baby)) {
    return false;
  }

  // Check for inventory restrictions
  if (!checkInventory(player, baby)) {
    return false;
  }

  // Check for conflicting items
  if (!checkItem(player, baby)) {
    return false;
  }

  // Check for conflicting trinkets
  if (
    baby.name === "Spike Baby" && // 166
    player.HasTrinket(TrinketType.TRINKET_LEFT_HAND) // 61
  ) {
    return false;
  }

  // Check to see if there are level restrictions
  if (!checkStage(baby)) {
    return false;
  }

  return true;
}

function checkActiveItem(player: EntityPlayer, baby: BabyDescription) {
  const activeItem = player.GetActiveItem();
  const secondaryActiveItem = player.GetActiveItem(ActiveSlot.SLOT_SECONDARY);

  if (
    baby.item !== undefined &&
    getCollectibleItemType(baby.item) === ItemType.ITEM_ACTIVE &&
    activeItem !== 0
  ) {
    const hasSchoolbag = player.HasCollectible(
      CollectibleType.COLLECTIBLE_SCHOOLBAG,
    );
    if (!hasSchoolbag) {
      // Since the player already has an active item, there is no room for another active item
      return false;
    }

    const hasItemInSchoolbag =
      hasSchoolbag && secondaryActiveItem !== CollectibleType.COLLECTIBLE_NULL;
    if (hasItemInSchoolbag) {
      // The player has both an active item and an item inside of the Schoolbag
      return false;
    }
  }

  return true;
}

function checkHealth(player: EntityPlayer, baby: BabyDescription) {
  const maxHearts = player.GetMaxHearts();
  const soulHearts = player.GetSoulHearts();
  const boneHearts = player.GetBoneHearts();
  const totalHealth = maxHearts + soulHearts + boneHearts;

  if (baby.numHits !== undefined && totalHealth < baby.numHits) {
    return false;
  }

  if (
    baby.item === CollectibleType.COLLECTIBLE_POTATO_PEELER &&
    maxHearts === 0
  ) {
    return false;
  }

  if (
    baby.name === "MeatBoy Baby" && // 210
    maxHearts === 0
  ) {
    // Potato Peeler effect on hit
    return false;
  }

  return true;
}

function checkInventory(player: EntityPlayer, baby: BabyDescription) {
  const coins = player.GetNumCoins();
  const bombs = player.GetNumBombs();
  const keys = player.GetNumKeys();

  if (baby.requireCoins === true && coins === 0) {
    return false;
  }

  if (
    baby.name === "Fancy Baby" && // 216
    coins < 10
  ) {
    return false;
  }

  if (
    baby.name === "Fate's Reward" && // 537
    coins < 15
  ) {
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_DOLLAR ||
      baby.item2 === CollectibleType.COLLECTIBLE_DOLLAR) &&
    coins >= 50
  ) {
    return false;
  }

  if (baby.requireBombs === true && bombs === 0) {
    return false;
  }

  if (baby.name === "Rage Baby" && bombs >= 50) {
    return false;
  }

  if (baby.requireKeys === true && keys === 0) {
    return false;
  }

  return true;
}

function checkItem(player: EntityPlayer, baby: BabyDescription) {
  if (
    (baby.mustHaveTears === true ||
      baby.item === CollectibleType.COLLECTIBLE_SOY_MILK || // 330
      baby.item2 === CollectibleType.COLLECTIBLE_SOY_MILK) && // 330
    (player.HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) || // 52
      player.HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY) || // 68
      player.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) || // 114
      player.HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) || // 118
      player.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) || // 168
      player.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) // 395
  ) {
    return false;
  }

  if (
    baby.item === CollectibleType.COLLECTIBLE_ISAACS_TEARS && // 323
    player.HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) // 149
  ) {
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_COMPASS || // 21
      baby.item2 === CollectibleType.COLLECTIBLE_COMPASS || // 21
      baby.item === CollectibleType.COLLECTIBLE_TREASURE_MAP || // 54
      baby.item2 === CollectibleType.COLLECTIBLE_TREASURE_MAP || // 54
      baby.item === CollectibleType.COLLECTIBLE_BLUE_MAP || // 246
      baby.item2 === CollectibleType.COLLECTIBLE_BLUE_MAP) && // 246
    player.HasCollectible(CollectibleType.COLLECTIBLE_MIND) // 333
  ) {
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_TECH_X || // 395
      baby.item2 === CollectibleType.COLLECTIBLE_TECH_X) && // 395
    player.HasCollectible(CollectibleType.COLLECTIBLE_DEAD_EYE) // 373
  ) {
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_DEAD_EYE || // 373
      baby.item2 === CollectibleType.COLLECTIBLE_DEAD_EYE) && // 373
    player.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) // 395
  ) {
    return false;
  }

  if (
    baby.name === "Belial Baby" && // 51
    player.HasCollectible(CollectibleType.COLLECTIBLE_MEGA_BLAST)
  ) {
    return false;
  }

  if (
    baby.name === "Goat Baby" && // 62
    (player.HasCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD) || // 215
      player.HasCollectible(CollectibleType.COLLECTIBLE_DUALITY)) // 498
  ) {
    return false;
  }

  if (
    baby.name === "Aether Baby" && // 106
    player.HasCollectible(CollectibleType.COLLECTIBLE_IPECAC)
  ) {
    return false;
  }

  if (
    baby.name === "Masked Baby" && // 115
    (player.HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) || // 69
      player.HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) || // 118
      player.HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) || // 229
      player.HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) || // 316
      player.HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_THE_VOID)) // 399
  ) {
    // Can't shoot while moving
    // This messes up with charge items
    return false;
  }

  if (
    baby.name === "Earwig Baby" && // 128
    (player.HasCollectible(CollectibleType.COLLECTIBLE_COMPASS) || // 21
      player.HasCollectible(CollectibleType.COLLECTIBLE_TREASURE_MAP) || // 54
      player.HasCollectible(CollectibleType.COLLECTIBLE_MIND)) // 333
  ) {
    // 3 rooms are already explored
    // If the player has mapping, this effect is largely useless
    // (but having the Blue Map is okay)
    return false;
  }

  if (
    baby.name === "Sloppy Baby" && // 146
    (player.HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) || // 2
      player.HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) || // 153
      player.HasCollectible(CollectibleType.COLLECTIBLE_20_20) || // 245
      player.HasCollectible(CollectibleType.COLLECTIBLE_THE_WIZ) || // 358
      player.HasPlayerForm(PlayerForm.PLAYERFORM_BABY) || // 7
      player.HasPlayerForm(PlayerForm.PLAYERFORM_BOOK_WORM)) // 10
  ) {
    return false;
  }

  if (
    baby.name === "Bawl Baby" && // 231
    player.HasCollectible(CollectibleType.COLLECTIBLE_IPECAC)
  ) {
    return false;
  }

  if (
    baby.name === "Tabby Baby" && // 269
    player.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE)
  ) {
    return false;
  }

  if (
    baby.name === "Red Demon Baby" && // 278
    (player.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) || // 168
      player.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) // 395
  ) {
    return false;
  }

  if (
    baby.name === "Fang Demon Baby" && // 281
    (player.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) || // 114
      player.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) || // 168
      player.HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) || // 229
      player.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) // 395
  ) {
    return false;
  }

  if (
    baby.name === "Lantern Baby" && // 292
    player.HasCollectible(CollectibleType.COLLECTIBLE_TRISAGION)
  ) {
    return false;
  }

  if (
    baby.name === "Cupcake Baby" && // 321
    player.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS)
  ) {
    // High shot speed
    return false;
  }

  if (
    baby.name === "Slicer Baby" && // 331
    player.HasCollectible(CollectibleType.COLLECTIBLE_IPECAC)
  ) {
    // Slice tears
    // Ipecac causes the tears to explode instantly, which causes unavoidable damage
    return false;
  }

  if (
    baby.name === "Mushroom Girl Baby" && // 361
    player.HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS)
  ) {
    return false;
  }

  if (
    baby.name === "Blue Ghost Baby" && // 370
    player.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE)
  ) {
    return false;
  }

  if (
    baby.name === "Yellow Princess Baby" && // 375
    player.HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE)
  ) {
    return false;
  }

  if (
    baby.name === "Dino Baby" && // 376
    player.HasCollectible(CollectibleType.COLLECTIBLE_BOBS_BRAIN)
  ) {
    return false;
  }

  if (
    baby.name === "Imp Baby" && // 386
    player.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS)
  ) {
    // Blender + flight + explosion immunity + blindfolded
    // Epic Fetus overwrites Mom's Knife, which makes the baby not work properly
    return false;
  }

  if (
    baby.name === "Dark Space Soldier Baby" && // 398
    player.HasCollectible(CollectibleType.COLLECTIBLE_IPECAC)
  ) {
    return false;
  }

  if (
    baby.name === "Blurred Baby" && // 407
    (player.HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) ||
      player.HasCollectible(CollectibleType.COLLECTIBLE_INCUBUS))
  ) {
    // Flat Stone is manually given, so we have to explicitly code a restriction
    // Incubus will not fire the Ludo tears, ruining the build
    return false;
  }

  if (
    baby.name === "Rojen Whitefox Baby" && // 446
    player.HasCollectible(CollectibleType.COLLECTIBLE_POLAROID) // 327
  ) {
    return false;
  }

  if (
    (baby.name === "Cursed Pillow Baby" || // 487
      baby.name === "Abel") && // 531
    (player.HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) || // 2
      player.HasCollectible(CollectibleType.COLLECTIBLE_CUPIDS_ARROW) || // 48
      player.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_EYE) || // 55
      player.HasCollectible(CollectibleType.COLLECTIBLE_LOKIS_HORNS) || // 87
      player.HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) || // 153
      player.HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS) || // 169
      player.HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) || // 229
      player.HasCollectible(CollectibleType.COLLECTIBLE_DEATHS_TOUCH) || // 237
      player.HasCollectible(CollectibleType.COLLECTIBLE_20_20) || // 245
      player.HasCollectible(CollectibleType.COLLECTIBLE_SAGITTARIUS) || // 306
      player.HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) || // 316
      player.HasCollectible(CollectibleType.COLLECTIBLE_DEAD_ONION) || // 336
      player.HasCollectible(CollectibleType.COLLECTIBLE_EYE_OF_BELIAL) || // 462
      player.HasCollectible(CollectibleType.COLLECTIBLE_LITTLE_HORN) || // 503
      player.HasCollectible(CollectibleType.COLLECTIBLE_TRISAGION) || // 533
      player.HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) || // 540
      player.HasPlayerForm(PlayerForm.PLAYERFORM_BABY) || // 7
      player.HasPlayerForm(PlayerForm.PLAYERFORM_BOOK_WORM)) // 10
  ) {
    // Missed tears cause damage and missed tears cause paralysis
    // Piercing, multiple shots, and Flat Stone causes this to mess up
    return false;
  }

  return true;
}

function checkStage(baby: BabyDescription) {
  const stageType = g.l.GetStageType();
  const effectiveStage = getEffectiveStage();

  if (baby.noEndFloors === true && effectiveStage >= 9) {
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_STEAM_SALE ||
      baby.item2 === CollectibleType.COLLECTIBLE_STEAM_SALE) &&
    effectiveStage >= 7
  ) {
    // Only valid for floors with shops
    return false;
  }

  if (
    baby.item === CollectibleType.COLLECTIBLE_WE_NEED_TO_GO_DEEPER &&
    (effectiveStage <= 2 || effectiveStage >= 8)
  ) {
    // Only valid for floors that the shovel will work on
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_SCAPULAR ||
      baby.item2 === CollectibleType.COLLECTIBLE_SCAPULAR) &&
    effectiveStage >= 7
  ) {
    return false;
  }

  if (
    baby.item === CollectibleType.COLLECTIBLE_CRYSTAL_BALL &&
    effectiveStage <= 2
  ) {
    return false;
  }

  if (
    baby.item === CollectibleType.COLLECTIBLE_UNDEFINED &&
    effectiveStage <= 2
  ) {
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_GOAT_HEAD || // 215
      baby.item2 === CollectibleType.COLLECTIBLE_GOAT_HEAD || // 215
      baby.item === CollectibleType.COLLECTIBLE_DUALITY || // 498
      baby.item2 === CollectibleType.COLLECTIBLE_DUALITY || // 498
      baby.item === CollectibleType.COLLECTIBLE_EUCHARIST || // 499
      baby.item2 === CollectibleType.COLLECTIBLE_EUCHARIST) && // 499
    (effectiveStage === 1 || effectiveStage >= 9)
  ) {
    // Only valid for floors with Devil Rooms
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_THERES_OPTIONS ||
      baby.item2 === CollectibleType.COLLECTIBLE_THERES_OPTIONS) &&
    (effectiveStage === 6 || effectiveStage >= 8)
  ) {
    // There won't be a boss item on floor 6 or floor 8 and beyond
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_MORE_OPTIONS ||
      baby.item2 === CollectibleType.COLLECTIBLE_MORE_OPTIONS) &&
    (effectiveStage === 1 || effectiveStage >= 7)
  ) {
    // We always have More Options on Basement 1
    // There are no Treasure Rooms on floors 7 and beyond
    return false;
  }

  if (
    baby.name === "Shadow Baby" && // 13
    (effectiveStage === 1 || effectiveStage >= 8)
  ) {
    // Devil Rooms / Angel Rooms go to the Black Market instead
    // Only valid for floors with Devil Rooms
    // Not valid for floor 8 just in case the Black Market does not have a beam of light to the
    // Cathedral
    return false;
  }

  if (
    baby.name === "Goat Baby" && // 62
    (effectiveStage <= 2 || effectiveStage >= 9)
  ) {
    // Only valid for floors with Devil Rooms
    // Also, we are guaranteed a Devil Room on Basement 2, so we don't want to have it there either
    return false;
  }

  if (
    baby.name === "Bomb Baby" && // 75
    effectiveStage === 10
  ) {
    // 50% chance for bombs to have the D6 effect
    return false;
  }

  if (
    baby.name === "Pubic Baby" && // 110
    effectiveStage === 11
  ) {
    // Must full clear
    // Full clearing The Chest is too punishing
    return false;
  }

  if (
    baby.name === "Earwig Baby" && // 128
    effectiveStage === 1
  ) {
    // 3 rooms are already explored
    // This can make resetting slower, so don't have this baby on Basement 1
    return false;
  }

  if (
    baby.name === "Tears Baby" && // 136
    effectiveStage === 2
  ) {
    // Starts with the Soul Jar
    // Getting this on Basement 2 would cause a missed devil deal
    return false;
  }

  if (
    baby.name === "Twin Baby" && // 141
    effectiveStage === 8
  ) {
    // If they mess up and go past the Boss Room, they can get the wrong path
    return false;
  }

  if (
    baby.name === "Chompers Baby" && // 143
    effectiveStage === 11
  ) {
    // Everything is Red Poop
    // There are almost no grid entities on The Chest
    return false;
  }

  if (
    baby.name === "Ate Poop Baby" && // 173
    effectiveStage === 11
  ) {
    // Destroying poops spawns random pickups
    // There are hardly any poops on The Chest
    return false;
  }

  if (
    baby.name === "Shopkeeper Baby" && // 215
    effectiveStage >= 7
  ) {
    // Free shop items
    return false;
  }

  if (
    baby.name === "Gem Baby" && // 237
    effectiveStage >= 7
  ) {
    // Pennies spawn as nickels
    // Money is useless past Depths 2
    return false;
  }

  if (
    baby.name === "Puzzle Baby" && // 315
    effectiveStage === 10
  ) {
    // The D6 effect on hit
    return false;
  }

  if (
    baby.name === "Scary Baby" && // 317
    effectiveStage === 6
  ) {
    // Items cost hearts
    // The player may not be able to take The Polaroid (when playing a normal run)
    return false;
  }

  if (
    baby.name === "Red Wrestler Baby" && // 389
    effectiveStage === 11
  ) {
    // Everything is TNT
    // There are almost no grid entities on The Chest / Dark Room
    return false;
  }

  if (
    baby.name === "Rich Baby" && // 424
    effectiveStage >= 7
  ) {
    // Starts with 99 cents
    // Money is useless past Depths
    return false;
  }

  if (
    baby.name === "Folder Baby" && // 430
    (effectiveStage === 1 || effectiveStage === 10)
  ) {
    return false;
  }

  if (
    baby.name === "Hooligan Baby" && // 514
    effectiveStage === 10 &&
    stageType === 0 // Sheol
  ) {
    return false;
  }

  if (
    baby.name === "Baggy Cap Baby" && // 519
    effectiveStage === 11
  ) {
    return false;
  }

  if (
    baby.name === "Demon Baby" && // 527
    (effectiveStage === 1 || effectiveStage >= 9)
  ) {
    // Only valid for floors with Devil Rooms
    return false;
  }

  if (
    baby.name === "Ghost Baby" && // 528
    effectiveStage === 2
  ) {
    // All items from the Shop pool
    // On stage 2, they will miss a Devil Deal, which is not fair
    return false;
  }

  if (
    baby.name === "Fate's Reward" && // 537
    (effectiveStage <= 2 || effectiveStage === 6 || effectiveStage >= 10)
  ) {
    // Items cost money
    // On stage 1, the player does not have 15 cents
    // On stage 2, they will miss a Devil Deal, which is not fair
    // On stage 6, they might not be able to buy the Polaroid (when playing on a normal run)
    // On stage 10 and 11, there are no items
    return false;
  }

  return true;
}
