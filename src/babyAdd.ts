import babyAddFunctions from "./babyAddFunctions";
import g from "./globals";
import log from "./log";
import {
  getCurrentBaby,
  getItemConfig,
  getItemMaxCharges,
  giveItemAndRemoveFromPools,
  removeItemFromItemTracker,
} from "./misc";

export default function babyAdd(): void {
  const stage = g.l.GetStage();
  const soulHearts = g.p.GetSoulHearts();
  const blackHearts = g.p.GetBlackHearts();
  const coins = g.p.GetNumCoins();
  const bombs = g.p.GetNumBombs();
  const keys = g.p.GetNumKeys();
  const secondaryActiveItem = g.p.GetActiveItem(ActiveSlot.SLOT_SECONDARY);
  const [babyType, baby, valid] = getCurrentBaby();
  if (!valid) {
    return;
  }

  // Draw the kind of baby on the starting room
  g.run.drawIntro = true;

  // Put the baby description into the "save#.dat" file so that it can be shown on OBS
  if (g.babiesMod !== null) {
    Isaac.SaveModData(g.babiesMod, baby.description);
  }

  // Check if this is an item baby
  if (baby.item !== undefined) {
    // Check to see if it is an active item
    if (getItemConfig(baby.item).Type === ItemType.ITEM_ACTIVE) {
      // Find out how many charges it should have
      // By default, items are given with a maximum charge
      let itemCharges = getItemMaxCharges(baby.item);
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

    removeItemFromItemTracker(baby.item);
    g.itemPool.RemoveCollectible(baby.item);
  }

  // Check if this is a multiple item baby
  if (baby.item !== undefined && baby.itemNum !== undefined) {
    for (let i = 2; i <= baby.itemNum; i++) {
      g.p.AddCollectible(baby.item);
      removeItemFromItemTracker(baby.item);
    }
  }

  // Check if this is a baby that grants a second item
  // (this should always be a passive item; we explicitly check for this in "main.ts")
  if (baby.item2 !== undefined) {
    giveItemAndRemoveFromPools(baby.item2);
    removeItemFromItemTracker(baby.item2);
  }

  // Reset the soul hearts and black hearts to the way it was before we added the items
  const newSoulHearts = g.p.GetSoulHearts();
  const newBlackHearts = g.p.GetBlackHearts();
  if (newSoulHearts !== soulHearts || newBlackHearts !== blackHearts) {
    g.p.AddSoulHearts(-24);
    for (let i = 1; i <= soulHearts; i++) {
      const bitPosition = math.floor((i - 1) / 2);
      const bit = (blackHearts & (1 << bitPosition)) >>> bitPosition;
      if (bit === 0) {
        // Soul heart
        g.p.AddSoulHearts(1);
      } else {
        // Black heart
        g.p.AddBlackHearts(1);
      }
    }
  }

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

  // Don't grant extra pickups
  if (
    baby.item === CollectibleType.COLLECTIBLE_PHD || // 75
    baby.item2 === CollectibleType.COLLECTIBLE_PHD // 75
  ) {
    // Delete the starting pill
    const pills = Isaac.FindByType(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_PILL,
    );
    for (const pill of pills) {
      pill.Remove();
    }
  }
  if (
    baby.item === CollectibleType.COLLECTIBLE_STARTER_DECK || // 251
    baby.item2 === CollectibleType.COLLECTIBLE_STARTER_DECK // 251
  ) {
    // Delete the starting card
    const cards = Isaac.FindByType(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_TAROTCARD,
    );
    for (const card of cards) {
      card.Remove();
    }
  }
  if (
    baby.item === CollectibleType.COLLECTIBLE_LITTLE_BAGGY || // 252
    baby.item2 === CollectibleType.COLLECTIBLE_LITTLE_BAGGY // 252
  ) {
    // Delete the starting pill
    const pills = Isaac.FindByType(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_PILL,
    );
    for (const pill of pills) {
      pill.Remove();
    }
  }
  if (
    (baby.item === CollectibleType.COLLECTIBLE_CHAOS || // 402
      baby.item2 === CollectibleType.COLLECTIBLE_CHAOS) && // 402
    stage !== 11 // Don't delete the pickups on The Chest / Dark Room
  ) {
    // Delete the starting random pickups
    const pickups = Isaac.FindByType(EntityType.ENTITY_PICKUP);
    for (const pickup of pickups) {
      if (pickup.Variant !== PickupVariant.PICKUP_COLLECTIBLE) {
        pickup.Remove();
      }
    }
  }
  if (
    baby.item === CollectibleType.COLLECTIBLE_SACK_HEAD || // 424
    baby.item2 === CollectibleType.COLLECTIBLE_SACK_HEAD // 424
  ) {
    // Delete the starting sack
    const sacks = Isaac.FindByType(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_GRAB_BAG,
    );
    for (const sack of sacks) {
      sack.Remove();
    }
  }
  if (
    baby.item === CollectibleType.COLLECTIBLE_LIL_SPEWER || // 537
    baby.item2 === CollectibleType.COLLECTIBLE_LIL_SPEWER // 537
  ) {
    // Delete the starting pill
    const pills = Isaac.FindByType(
      EntityType.ENTITY_PICKUP,
      PickupVariant.PICKUP_PILL,
    );
    for (const pill of pills) {
      pill.Remove();
    }
  }

  // Add miscellaneous other effects
  const babyFunc = babyAddFunctions.get(babyType);
  if (babyFunc !== undefined) {
    babyFunc();
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
