import {
  ActiveSlot,
  CacheFlag,
  CollectibleType,
  ItemType,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  getCollectibleItemType,
  getCollectibleMaxCharges,
  getPickups,
  getPlayerHealth,
  isChest,
  log,
  removeCollectibleFromItemTracker,
  setBlindfold,
  setPlayerHealth,
  smeltTrinket,
} from "isaacscript-common";
import { babyAddFunctionMap } from "./babyAddFunctionMap";
import { setBabyANM2, updatePlayerWithCostumeProtector } from "./costumes";
import g from "./globals";
import { getCurrentBaby, giveItemAndRemoveFromPools } from "./utils";

export function babyAdd(player: EntityPlayer): void {
  const coins = player.GetNumCoins();
  const bombs = player.GetNumBombs();
  const keys = player.GetNumKeys();
  const secondaryActiveItem = g.p.GetActiveItem(ActiveSlot.SECONDARY);
  const playerHealth = getPlayerHealth(player);
  const [babyType, baby] = getCurrentBaby();
  if (babyType === -1) {
    return;
  }

  // Draw the kind of baby on the starting room.
  g.run.drawIntro = true;

  // Put the baby description into the "save#.dat" file so that it can be shown on OBS.
  if (g.babiesMod !== null) {
    g.babiesMod.SaveData(baby.description);
  }

  // Check if this is an item baby.
  if (baby.item !== undefined) {
    // Check to see if it is an active item.
    if (getCollectibleItemType(baby.item) === ItemType.ACTIVE) {
      // Find out how many charges it should have By default, items are given with a maximum charge.
      let itemCharges = getCollectibleMaxCharges(baby.item);
      if (baby.uncharged !== undefined) {
        itemCharges = 0;
      }

      // Find out where to put it.
      if (
        player.HasCollectible(CollectibleType.SCHOOLBAG) &&
        secondaryActiveItem !== CollectibleType.NULL
      ) {
        // There is room in the Schoolbag for it, so put it there. (Getting new active items will
        // automatically put the existing active item inside the Schoolbag.)
        player.AddCollectible(baby.item, itemCharges, false);
        player.SwapActiveItems();
      } else {
        // We don't have a Schoolbag, so just give the new active item.
        player.AddCollectible(baby.item, itemCharges, false);
      }
    } else {
      // Give the passive item.
      player.AddCollectible(baby.item, 0, false);
      log(`Added the new baby passive item: ${baby.item}`);
    }

    removeCollectibleFromItemTracker(baby.item);
    g.itemPool.RemoveCollectible(baby.item);
  }

  // Check if this is a multiple item baby.
  if (baby.item !== undefined && baby.itemNum !== undefined) {
    const numItemsToAdd = baby.itemNum - 1; // We already added the first item above
    for (let i = 0; i < numItemsToAdd; i++) {
      player.AddCollectible(baby.item, 0, false);
      removeCollectibleFromItemTracker(baby.item);
    }
  }

  // Check if this is a baby that grants a second item. (This should always be a passive item; we
  // explicitly check for this on startup.)
  if (baby.item2 !== undefined) {
    giveItemAndRemoveFromPools(baby.item2);
    removeCollectibleFromItemTracker(baby.item2);
  }

  // Check if this is a baby that grants a third item. (This should always be a passive item; we
  // explicitly check for this on startup.)
  if (baby.item3 !== undefined) {
    giveItemAndRemoveFromPools(baby.item3);
    removeCollectibleFromItemTracker(baby.item3);
  }

  // Check if this is a trinket baby.
  if (baby.trinket !== undefined) {
    smeltTrinket(player, baby.trinket);
    g.itemPool.RemoveTrinket(baby.trinket);
  }

  // Reset the player's health to the way it was before we added the items.
  setPlayerHealth(player, playerHealth);

  // Reset the coin/bomb/key count to the way it was before we added the items.
  player.AddCoins(-99);
  player.AddCoins(coins);
  player.AddBombs(-99);
  player.AddBombs(bombs);
  player.AddKeys(-99);
  player.AddKeys(keys);

  // Some babies are blindfolded.
  if (baby.blindfolded === true) {
    setBlindfold(player, true, false);

    // Setting a blindfold changes the player type, which resets the ANM2 Manually set it back.
    setBabyANM2(player);
  }

  // Some babies give Easter Eggs.
  if (baby.seed !== undefined) {
    g.seeds.AddSeedEffect(baby.seed);
  }

  // Don't grant extra pickups (from e.g. PHD)
  for (const pickup of getPickups()) {
    if (
      pickup.FrameCount === 0 &&
      pickup.Variant !== PickupVariant.COLLECTIBLE &&
      !isChest(pickup)
    ) {
      pickup.Remove();
    }
  }

  // Add miscellaneous other effects.
  const babyAddFunction = babyAddFunctionMap.get(babyType);
  if (babyAddFunction !== undefined) {
    babyAddFunction();
  }

  // Reset the player's size.
  player.SpriteScale = Vector(1, 1);

  // Some babies grant extra stats or flight.
  player.AddCacheFlags(CacheFlag.ALL);
  player.EvaluateItems();

  updatePlayerWithCostumeProtector(player);

  log(`Applied baby: ${babyType} - ${baby.name}`);
}
