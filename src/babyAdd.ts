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
import { getCurrentBaby, giveItemAndRemoveFromPools } from "./util";

export function babyAdd(): void {
  const coins = g.p.GetNumCoins();
  const bombs = g.p.GetNumBombs();
  const keys = g.p.GetNumKeys();
  const secondaryActiveItem = g.p.GetActiveItem(ActiveSlot.SLOT_SECONDARY);
  const playerHealth = getPlayerHealth(g.p);
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
        g.p.HasCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG) &&
        secondaryActiveItem !== CollectibleType.COLLECTIBLE_NULL
      ) {
        // There is room in the Schoolbag for it, so put it there
        // (getting new active items will automatically put the existing active item inside the
        // Schoolbag)
        g.p.AddCollectible(baby.item, itemCharges, false);
        g.p.SwapActiveItems();
      } else {
        // We don't have a Schoolbag, so just give the new active item
        g.p.AddCollectible(baby.item, itemCharges, false);
      }
    } else {
      // Give the passive item
      g.p.AddCollectible(baby.item);
      log(`Added the new baby passive item (${baby.item}).`);
    }

    removeCollectibleFromItemTracker(baby.item);
    g.itemPool.RemoveCollectible(baby.item);
  }

  // Check if this is a multiple item baby
  if (baby.item !== undefined && baby.itemNum !== undefined) {
    for (let i = 2; i <= baby.itemNum; i++) {
      g.p.AddCollectible(baby.item);
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
  setPlayerHealth(g.p, playerHealth);

  // Reset the coin/bomb/key count to the way it was before we added the items
  g.p.AddCoins(-99);
  g.p.AddCoins(coins);
  g.p.AddBombs(-99);
  g.p.AddBombs(bombs);
  g.p.AddKeys(-99);
  g.p.AddKeys(keys);

  // Check if this is a trinket baby
  if (baby.trinket !== undefined) {
    g.p.AddTrinket(baby.trinket);
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
  g.p.SpriteScale = Vector(1, 1);

  // Some babies grant extra stats or flight
  g.p.AddCacheFlags(CacheFlag.CACHE_ALL);
  g.p.EvaluateItems();

  // We don't have to set the sprite now,
  // because it will be set later on in the PostNewRoom callback
  log(`Applied baby: ${babyType} - ${baby.name}`);
}
