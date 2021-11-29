import { getCollectibleItemType } from "isaacscript-common";
import { BABIES } from "./babies";
import g from "./globals";
import { BabyDescription } from "./types/BabyDescription";

export function babyCheckValid(babyType: int): boolean {
  const baby = BABIES[babyType];
  if (baby === undefined) {
    error(`Baby ${babyType} was not found.`);
  }

  // Check to see if we already got this baby in this run / multi-character custom challenge
  if (g.pastBabies.includes(babyType)) {
    return false;
  }

  // Check for overlapping items
  if (baby.item !== undefined && g.p.HasCollectible(baby.item)) {
    return false;
  }
  if (baby.item2 !== undefined && g.p.HasCollectible(baby.item2)) {
    return false;
  }

  // If the player does not have a slot for an active item, do not give them an active item baby
  if (!checkActiveItem(baby)) {
    return false;
  }

  // If the player already has a trinket, do not give them a trinket baby
  if (baby.trinket !== undefined && g.p.GetTrinket(TrinketSlot.SLOT_1) !== 0) {
    return false;
  }

  // Check for conflicting health values
  if (!checkHealth(baby)) {
    return false;
  }

  // Check for inventory restrictions
  if (!checkInventory(baby)) {
    return false;
  }

  // Check for conflicting items
  if (!checkItem(baby)) {
    return false;
  }

  // Check for conflicting trinkets
  if (
    baby.name === "Spike Baby" && // 166
    g.p.HasTrinket(TrinketType.TRINKET_LEFT_HAND) // 61
  ) {
    return false;
  }

  // Check to see if there are level restrictions
  if (!checkStage(baby)) {
    return false;
  }

  return true;
}

function checkActiveItem(baby: BabyDescription) {
  const activeItem = g.p.GetActiveItem();
  const secondaryActiveItem = g.p.GetActiveItem(ActiveSlot.SLOT_SECONDARY);

  if (
    baby.item !== undefined &&
    getCollectibleItemType(baby.item) === ItemType.ITEM_ACTIVE &&
    activeItem !== 0
  ) {
    const hasSchoolbag = g.p.HasCollectible(
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

function checkHealth(baby: BabyDescription) {
  const maxHearts = g.p.GetMaxHearts();
  const soulHearts = g.p.GetSoulHearts();
  const boneHearts = g.p.GetBoneHearts();
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

function checkInventory(baby: BabyDescription) {
  const coins = g.p.GetNumCoins();
  const bombs = g.p.GetNumBombs();
  const keys = g.p.GetNumKeys();

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

function checkItem(baby: BabyDescription) {
  if (
    baby.blindfolded === true &&
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) || // 69
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECH_5) || // 244
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_LIBRA)) // 304
  ) {
    // Even with very high tear delay, you can still spam tears with Chocolate Milk
    // With Libra, the extra tear delay from the blindfold is redistributed,
    // so the player will be able to shoot after saving and quitting
    // With Tech.5, the player is still able to shoot while blindfolded
    return false;
  }

  if (
    (baby.mustHaveTears === true ||
      baby.item === CollectibleType.COLLECTIBLE_SOY_MILK || // 330
      baby.item2 === CollectibleType.COLLECTIBLE_SOY_MILK) && // 330
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS) || // 52
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY) || // 68
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) || // 114
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) || // 118
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) || // 168
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) // 395
  ) {
    return false;
  }

  if (
    baby.item === CollectibleType.COLLECTIBLE_ISAACS_TEARS && // 323
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_IPECAC) // 149
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
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_MIND) // 333
  ) {
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_TECH_X || // 395
      baby.item2 === CollectibleType.COLLECTIBLE_TECH_X) && // 395
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_DEAD_EYE) // 373
  ) {
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_DEAD_EYE || // 373
      baby.item2 === CollectibleType.COLLECTIBLE_DEAD_EYE) && // 373
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X) // 395
  ) {
    return false;
  }

  if (
    baby.name === "Belial Baby" && // 51
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_MEGA_BLAST)
  ) {
    return false;
  }

  if (
    baby.name === "Goat Baby" && // 62
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_GOAT_HEAD) || // 215
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_DUALITY)) // 498
  ) {
    return false;
  }

  if (
    baby.name === "Aether Baby" && // 106
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_IPECAC)
  ) {
    return false;
  }

  if (
    baby.name === "Masked Baby" && // 115
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_CHOCOLATE_MILK) || // 69
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_BRIMSTONE) || // 118
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) || // 229
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) || // 316
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MAW_OF_THE_VOID)) // 399
  ) {
    // Can't shoot while moving
    // This messes up with charge items
    return false;
  }

  if (
    baby.name === "Earwig Baby" && // 128
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_COMPASS) || // 21
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_TREASURE_MAP) || // 54
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MIND)) // 333
  ) {
    // 3 rooms are already explored
    // If the player has mapping, this effect is largely useless
    // (but having the Blue Map is okay)
    return false;
  }

  if (
    baby.name === "Sloppy Baby" && // 146
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) || // 2
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) || // 153
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_20_20) || // 245
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_THE_WIZ) || // 358
      g.p.HasPlayerForm(PlayerForm.PLAYERFORM_BABY) || // 7
      g.p.HasPlayerForm(PlayerForm.PLAYERFORM_BOOK_WORM)) // 10
  ) {
    return false;
  }

  if (
    baby.name === "Blindfold Baby" && // 202
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECHNOLOGY_2) || // 152
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG)) // 229
  ) {
    return false;
  }

  if (
    baby.name === "Bawl Baby" && // 231
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_IPECAC)
  ) {
    return false;
  }

  if (
    baby.name === "Tabby Baby" && // 269
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE)
  ) {
    return false;
  }

  if (
    baby.name === "Red Demon Baby" && // 278
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) || // 168
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) // 395
  ) {
    return false;
  }

  if (
    baby.name === "Fang Demon Baby" && // 281
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE) || // 114
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS) || // 168
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) || // 229
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_TECH_X)) // 395
  ) {
    return false;
  }

  if (
    baby.name === "Lantern Baby" && // 292
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_TRISAGION)
  ) {
    return false;
  }

  if (
    baby.name === "Cupcake Baby" && // 321
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS)
  ) {
    // High shot speed
    return false;
  }

  if (
    baby.name === "Slicer Baby" && // 331
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_IPECAC)
  ) {
    // Slice tears
    // Ipecac causes the tears to explode instantly, which causes unavoidable damage
    return false;
  }

  if (
    baby.name === "Mushroom Girl Baby" && // 361
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_DR_FETUS)
  ) {
    return false;
  }

  if (
    baby.name === "Blue Ghost Baby" && // 370
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_KNIFE)
  ) {
    return false;
  }

  if (
    baby.name === "Yellow Princess Baby" && // 375
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE)
  ) {
    return false;
  }

  if (
    baby.name === "Dino Baby" && // 376
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_BOBS_BRAIN)
  ) {
    return false;
  }

  if (
    baby.name === "Imp Baby" && // 386
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_EPIC_FETUS)
  ) {
    // Blender + flight + explosion immunity + blindfolded
    // Epic Fetus overwrites Mom's Knife, which makes the baby not work properly
    return false;
  }

  if (
    baby.name === "Dark Space Soldier Baby" && // 398
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_IPECAC)
  ) {
    return false;
  }

  if (
    baby.name === "Blurred Baby" && // 407
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) ||
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_INCUBUS))
  ) {
    // Flat Stone is manually given, so we have to explicitly code a restriction
    // Incubus will not fire the Ludo tears, ruining the build
    return false;
  }

  if (
    baby.name === "Rojen Whitefox Baby" && // 446
    g.p.HasCollectible(CollectibleType.COLLECTIBLE_POLAROID) // 327
  ) {
    return false;
  }

  if (
    (baby.name === "Cursed Pillow Baby" || // 487
      baby.name === "Abel") && // 531
    (g.p.HasCollectible(CollectibleType.COLLECTIBLE_INNER_EYE) || // 2
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_CUPIDS_ARROW) || // 48
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MOMS_EYE) || // 55
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_LOKIS_HORNS) || // 87
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MUTANT_SPIDER) || // 153
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_POLYPHEMUS) || // 169
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_MONSTROS_LUNG) || // 229
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_DEATHS_TOUCH) || // 237
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_20_20) || // 245
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_SAGITTARIUS) || // 306
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_CURSED_EYE) || // 316
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_DEAD_ONION) || // 336
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_EYE_OF_BELIAL) || // 462
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_LITTLE_HORN) || // 503
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_TRISAGION) || // 533
      g.p.HasCollectible(CollectibleType.COLLECTIBLE_FLAT_STONE) || // 540
      g.p.HasPlayerForm(PlayerForm.PLAYERFORM_BABY) || // 7
      g.p.HasPlayerForm(PlayerForm.PLAYERFORM_BOOK_WORM)) // 10
  ) {
    // Missed tears cause damage and missed tears cause paralysis
    // Piercing, multiple shots, and Flat Stone causes this to mess up
    return false;
  }

  return true;
}

function checkStage(baby: BabyDescription) {
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  if (baby.noEndFloors === true && stage >= 9) {
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_STEAM_SALE ||
      baby.item2 === CollectibleType.COLLECTIBLE_STEAM_SALE) &&
    stage >= 7
  ) {
    // Only valid for floors with shops
    return false;
  }

  if (
    baby.item === CollectibleType.COLLECTIBLE_WE_NEED_TO_GO_DEEPER &&
    (stage <= 2 || stage >= 8)
  ) {
    // Only valid for floors that the shovel will work on
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_SCAPULAR ||
      baby.item2 === CollectibleType.COLLECTIBLE_SCAPULAR) &&
    stage >= 7
  ) {
    return false;
  }

  if (baby.item === CollectibleType.COLLECTIBLE_CRYSTAL_BALL && stage <= 2) {
    return false;
  }

  if (baby.item === CollectibleType.COLLECTIBLE_UNDEFINED && stage <= 2) {
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_GOAT_HEAD || // 215
      baby.item2 === CollectibleType.COLLECTIBLE_GOAT_HEAD || // 215
      baby.item === CollectibleType.COLLECTIBLE_DUALITY || // 498
      baby.item2 === CollectibleType.COLLECTIBLE_DUALITY || // 498
      baby.item === CollectibleType.COLLECTIBLE_EUCHARIST || // 499
      baby.item2 === CollectibleType.COLLECTIBLE_EUCHARIST) && // 499
    (stage === 1 || stage >= 9)
  ) {
    // Only valid for floors with Devil Rooms
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_THERES_OPTIONS ||
      baby.item2 === CollectibleType.COLLECTIBLE_THERES_OPTIONS) &&
    (stage === 6 || stage >= 8)
  ) {
    // There won't be a boss item on floor 6 or floor 8 and beyond
    return false;
  }

  if (
    (baby.item === CollectibleType.COLLECTIBLE_MORE_OPTIONS ||
      baby.item2 === CollectibleType.COLLECTIBLE_MORE_OPTIONS) &&
    (stage === 1 || stage >= 7)
  ) {
    // We always have More Options on Basement 1
    // There are no Treasure Rooms on floors 7 and beyond
    return false;
  }

  if (
    baby.name === "Shadow Baby" && // 13
    (stage === 1 || stage >= 8)
  ) {
    // Devil Rooms / Angel Rooms go to the Black Market instead
    // Only valid for floors with Devil Rooms
    // Not valid for floor 8 just in case the Black Market does not have a beam of light to the
    // Cathedral
    return false;
  }

  if (
    baby.name === "Goat Baby" && // 62
    (stage <= 2 || stage >= 9)
  ) {
    // Only valid for floors with Devil Rooms
    // Also, we are guaranteed a Devil Room on Basement 2, so we don't want to have it there either
    return false;
  }

  if (
    baby.name === "Bomb Baby" && // 75
    stage === 10
  ) {
    // 50% chance for bombs to have the D6 effect
    return false;
  }

  if (
    baby.name === "Pubic Baby" && // 110
    stage === 11
  ) {
    // Must full clear
    // Full clearing The Chest is too punishing
    return false;
  }

  if (
    baby.name === "Earwig Baby" && // 128
    stage === 1
  ) {
    // 3 rooms are already explored
    // This can make resetting slower, so don't have this baby on Basement 1
    return false;
  }

  if (
    baby.name === "Tears Baby" && // 136
    stage === 2
  ) {
    // Starts with the Soul Jar
    // Getting this on Basement 2 would cause a missed devil deal
    return false;
  }

  if (
    baby.name === "Twin Baby" && // 141
    stage === 8
  ) {
    // If they mess up and go past the Boss Room, they can get the wrong path
    return false;
  }

  if (
    baby.name === "Chompers Baby" && // 143
    stage === 11
  ) {
    // Everything is Red Poop
    // There are almost no grid entities on The Chest
    return false;
  }

  if (
    baby.name === "Ate Poop Baby" && // 173
    stage === 11
  ) {
    // Destroying poops spawns random pickups
    // There are hardly any poops on The Chest
    return false;
  }

  if (
    baby.name === "Shopkeeper Baby" && // 215
    stage >= 7
  ) {
    // Free shop items
    return false;
  }

  if (
    baby.name === "Gem Baby" && // 237
    stage >= 7 &&
    !g.p.HasCollectible(CollectibleType.COLLECTIBLE_MONEY_EQUALS_POWER)
  ) {
    // Pennies spawn as nickels
    // Money is useless past Depths 2 (unless you have Money Equals Power)
    return false;
  }

  if (
    baby.name === "Monk Baby" && // 313
    (stage === 6 || stage === 8)
  ) {
    // PAC1F1CM
    // If a Devil Room or Angel Room spawns after the Mom fight,
    // the Mom doors will cover up the Devil/Angel Room door
    // On floor 8, the exits will not spawn correctly
    // (On floor 11, the end of the run seems to spawn correctly)
    return false;
  }

  if (
    baby.name === "Puzzle Baby" && // 315
    stage === 10
  ) {
    // The D6 effect on hit
    return false;
  }

  if (
    baby.name === "Scary Baby" && // 317
    stage === 6
  ) {
    // Items cost hearts
    // The player may not be able to take The Polaroid (when playing a normal run)
    return false;
  }

  if (
    baby.name === "Red Wrestler Baby" && // 389
    stage === 11
  ) {
    // Everything is TNT
    // There are almost no grid entities on The Chest / Dark Room
    return false;
  }

  if (
    baby.name === "Rich Baby" && // 424
    stage >= 7
  ) {
    // Starts with 99 cents
    // Money is useless past Depths
    return false;
  }

  if (
    baby.name === "Folder Baby" && // 430
    (stage === 1 || stage === 10)
  ) {
    return false;
  }

  if (
    baby.name === "Hooligan Baby" && // 514
    stage === 10 &&
    stageType === 0 // Sheol
  ) {
    return false;
  }

  if (
    baby.name === "Baggy Cap Baby" && // 519
    stage === 11
  ) {
    return false;
  }

  if (
    baby.name === "Demon Baby" && // 527
    (stage === 1 || stage >= 9)
  ) {
    // Only valid for floors with Devil Rooms
    return false;
  }

  if (
    baby.name === "Ghost Baby" && // 528
    stage === 2
  ) {
    // All items from the Shop pool
    // On stage 2, they will miss a Devil Deal, which is not fair
    return false;
  }

  if (
    baby.name === "Fate's Reward" && // 537
    (stage <= 2 || stage === 6 || stage >= 10)
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
