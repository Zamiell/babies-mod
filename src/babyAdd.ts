import {
  getCollectibleItemType,
  getCollectibleMaxCharges,
  getPickups,
  getPlayerHealth,
  isChest,
  log,
  removeCollectibleFromItemTracker,
  setPlayerHealth,
} from "isaacscript-common";
import { babyAddFunctionMap } from "./babyAddFunctionMap";
import g from "./globals";
import * as costumeProtector from "./lib/character_costume_protector";
import { NullItemIDCustom, PlayerTypeCustom } from "./types/enums";
import { getCurrentBaby, giveItemAndRemoveFromPools } from "./util";

const LAST_BABY_WITH_SPRITE_IN_PLAYER2_DIRECTORY = 521;

export function babyAdd(player: EntityPlayer): void {
  const coins = player.GetNumCoins();
  const bombs = player.GetNumBombs();
  const keys = player.GetNumKeys();
  const secondaryActiveItem = g.p.GetActiveItem(ActiveSlot.SLOT_SECONDARY);
  const playerHealth = getPlayerHealth(player);
  const [babyType, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Draw the kind of baby on the starting room
  g.run.drawIntro = true;

  // Put the baby description into the "save#.dat" file so that it can be shown on OBS
  if (g.babiesMod !== null) {
    g.babiesMod.SaveData(baby.description);
  }

  // Check if this is an item baby
  if (baby.item !== undefined) {
    // Check to see if it is an active item
    if (getCollectibleItemType(baby.item) === ItemType.ITEM_ACTIVE) {
      // Find out how many charges it should have
      // By default, items are given with a maximum charge
      let itemCharges = getCollectibleMaxCharges(baby.item);
      if (baby.uncharged !== undefined) {
        itemCharges = 0;
      }

      // Find out where to put it
      if (
        player.HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG) &&
        secondaryActiveItem !== CollectibleType.COLLECTIBLE_NULL
      ) {
        // There is room in the Schoolbag for it, so put it there
        // (getting new active items will automatically put the existing active item inside the
        // Schoolbag)
        player.AddCollectible(baby.item, itemCharges, false);
        player.SwapActiveItems();
      } else {
        // We don't have a Schoolbag, so just give the new active item
        player.AddCollectible(baby.item, itemCharges, false);
      }
    } else {
      // Give the passive item
      player.AddCollectible(baby.item);
      log(`Added the new baby passive item (${baby.item}).`);
    }

    removeCollectibleFromItemTracker(baby.item);
    g.itemPool.RemoveCollectible(baby.item);
  }

  // Check if this is a multiple item baby
  if (baby.item !== undefined && baby.itemNum !== undefined) {
    for (let i = 2; i <= baby.itemNum; i++) {
      player.AddCollectible(baby.item);
      removeCollectibleFromItemTracker(baby.item);
    }
  }

  // Check if this is a baby that grants a second item
  // (this should always be a passive item; we explicitly check for this in "main.ts")
  if (baby.item2 !== undefined) {
    giveItemAndRemoveFromPools(baby.item2);
    removeCollectibleFromItemTracker(baby.item2);
  }

  // Reset the player's health to the way it was before we added the items
  setPlayerHealth(player, playerHealth);

  // Reset the coin/bomb/key count to the way it was before we added the items
  player.AddCoins(-99);
  player.AddCoins(coins);
  player.AddBombs(-99);
  player.AddBombs(bombs);
  player.AddKeys(-99);
  player.AddKeys(keys);

  // Check if this is a trinket baby
  if (baby.trinket !== undefined) {
    player.AddTrinket(baby.trinket);
    g.itemPool.RemoveTrinket(baby.trinket);
  }

  // Some babies give Easter Eggs
  if (baby.seed !== undefined) {
    g.seeds.AddSeedEffect(baby.seed);
  }

  // Don't grant extra pickups (from e.g. PHD)
  for (const pickup of getPickups()) {
    if (
      pickup.FrameCount === 0 &&
      pickup.Variant !== PickupVariant.PICKUP_COLLECTIBLE &&
      !isChest(pickup)
    ) {
      pickup.Remove();
    }
  }

  // Add miscellaneous other effects
  const babyAddFunction = babyAddFunctionMap.get(babyType);
  if (babyAddFunction !== undefined) {
    babyAddFunction();
  }

  // Reset the player's size
  player.SpriteScale = Vector(1, 1);

  // Some babies grant extra stats or flight
  player.AddCacheFlags(CacheFlag.CACHE_ALL);
  player.EvaluateItems();

  // Set the new sprite
  const gfxDirectory =
    babyType <= LAST_BABY_WITH_SPRITE_IN_PLAYER2_DIRECTORY
      ? "gfx/characters/player2"
      : "gfx/familiar";
  const spritesheetPath = `${gfxDirectory}/${baby.sprite}`;
  const flightCostume =
    baby.name === "Butterfly Baby 2" ? undefined : NullItemIDCustom.BABY_FLYING;
  costumeProtector.UpdatePlayer(
    player,
    PlayerTypeCustom.PLAYER_RANDOM_BABY,
    false,
    spritesheetPath,
    flightCostume,
  );
  costumeProtector.initPlayerCostume(player); // Needed according to Sanio in order to fix some bugs

  log(`Applied baby: ${babyType} - ${baby.name}`);
}
