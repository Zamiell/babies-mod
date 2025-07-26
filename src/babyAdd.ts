import {
  ActiveSlot,
  CacheFlag,
  CollectibleType,
  ItemType,
  PickupVariant,
} from "isaac-typescript-definitions";
import {
  ReadonlySet,
  VectorOne,
  asCollectibleType,
  game,
  getCollectibleItemType,
  getCollectibleMaxCharges,
  getCollectibleName,
  getPickups,
  getPlayerHealth,
  isChest,
  log,
  rebirthItemTrackerRemoveCollectible,
  repeat,
  setBlindfold,
  setPlayerHealth,
  smeltTrinket,
} from "isaacscript-common";
import {
  setBabyANM2,
  updatePlayerWithCostumeProtector,
} from "./classes/features/CostumeProtector";
import type { RandomBabyType } from "./enums/RandomBabyType";
import type { BabyDescription } from "./interfaces/BabyDescription";
import { BABY_CLASS_MAP } from "./objects/babyClassMap";
import {
  getBabyCollectiblesSet,
  giveCollectibleAndRemoveFromPools,
} from "./utils";

/**
 * Some passive items that are not part of a transformation set will not grant their effect if we
 * set the third parameter of the `Player.AddCollectible` method to false.
 */
const FIRST_TIME_PICKING_UP_BUGGED_COLLECTIBLES = new ReadonlySet([
  CollectibleType.RED_STEW, // 621
]);

/** e.g. Swallowed Penny is ID 2001. */
const REBIRTH_ITEM_TRACKER_TRINKET_MODIFIER = 2000;

export function babyAdd(
  player: EntityPlayer,
  babyType: RandomBabyType,
  baby: BabyDescription,
): void {
  const itemPool = game.GetItemPool();
  const seeds = game.GetSeeds();
  const coins = player.GetNumCoins();
  const bombs = player.GetNumBombs();
  const keys = player.GetNumKeys();
  const secondaryActiveItem = player.GetActiveItem(ActiveSlot.SECONDARY);
  const playerHealth = getPlayerHealth(player);

  // Check if this is an collectible baby.
  if (baby.collectible !== undefined) {
    // Check to see if it is an active item.
    if (getCollectibleItemType(baby.collectible) === ItemType.ACTIVE) {
      // Find out how many charges it should have By default, collectibles are given with a maximum
      // charge.
      let collectibleCharges = getCollectibleMaxCharges(baby.collectible);
      if (baby.uncharged !== undefined) {
        collectibleCharges = 0;
      }

      // Find out where to put it.
      if (
        player.HasCollectible(CollectibleType.SCHOOLBAG)
        && secondaryActiveItem !== CollectibleType.NULL
      ) {
        // There is room in the Schoolbag for it, so put it there. (Getting new active items will
        // automatically put the existing active item inside the Schoolbag.)
        player.AddCollectible(baby.collectible, collectibleCharges, false);
        player.SwapActiveItems();
      } else {
        // We don't have a Schoolbag, so just give the new active item.
        player.AddCollectible(baby.collectible, collectibleCharges, false);
      }
    } else {
      // Give the passive collectible.
      if (FIRST_TIME_PICKING_UP_BUGGED_COLLECTIBLES.has(baby.collectible)) {
        player.AddCollectible(baby.collectible, 0, true);
      } else {
        player.AddCollectible(baby.collectible, 0, false);
      }

      const collectibleName = getCollectibleName(baby.collectible);
      log(
        `Added the new baby passive collectible: ${collectibleName} (#${baby.collectible})`,
      );
    }

    rebirthItemTrackerRemoveCollectible(baby.collectible);
    itemPool.RemoveCollectible(baby.collectible);
  }

  // Check if this is a multiple collectible baby.
  if (baby.collectible !== undefined && baby.collectibleNum !== undefined) {
    const { collectible } = baby;
    const num = baby.collectibleNum - 1; // We already added the first collectible above.
    repeat(num, () => {
      player.AddCollectible(collectible, 0, false);
      rebirthItemTrackerRemoveCollectible(collectible);
    });
  }

  // Check if this is a baby that grants a second collectible. (This should always be a passive
  // collectible; we explicitly check for this on startup.)
  if (baby.collectible2 !== undefined) {
    giveCollectibleAndRemoveFromPools(player, baby.collectible2);
    rebirthItemTrackerRemoveCollectible(baby.collectible2);
  }

  // Check if this is a baby that grants a third collectible. (This should always be a passive
  // collectible; we explicitly check for this on startup.)
  if (baby.collectible3 !== undefined) {
    giveCollectibleAndRemoveFromPools(player, baby.collectible3);
    rebirthItemTrackerRemoveCollectible(baby.collectible3);
  }

  // If this baby grants a familiar, prevent the player from finding Sacrificial Altar.
  const babyCollectiblesSet = getBabyCollectiblesSet(baby);
  const babyCollectibles = [...babyCollectiblesSet.values()];
  const babyGrantsFamiliar = babyCollectibles.some(
    (collectibleType) =>
      getCollectibleItemType(collectibleType) === ItemType.FAMILIAR,
  );
  if (babyGrantsFamiliar) {
    itemPool.RemoveCollectible(CollectibleType.SACRIFICIAL_ALTAR);
  }

  // Check if this is a trinket baby.
  if (baby.trinket !== undefined) {
    const { trinket } = baby;
    const num = baby.trinketNum ?? 1;
    repeat(num, () => {
      smeltTrinket(player, trinket);

      const itemTrackerTrinketID = asCollectibleType(
        trinket + REBIRTH_ITEM_TRACKER_TRINKET_MODIFIER,
      );
      rebirthItemTrackerRemoveCollectible(itemTrackerTrinketID);
    });
    itemPool.RemoveTrinket(baby.trinket);
  }

  // Reset the player's health to the way it was before we added the items.
  setPlayerHealth(player, playerHealth);

  // Reset the coin/bomb/key count to the way it was before we added the items.
  player.AddCoins(-999);
  player.AddCoins(coins);
  player.AddBombs(-99);
  player.AddBombs(bombs);
  player.AddKeys(-99);
  player.AddKeys(keys);

  // Some babies are blindfolded.
  if (baby.blindfolded === true) {
    setBlindfold(player, true, false);

    // Setting a blindfold changes the player type, which resets the ANM2. Manually set it back.
    setBabyANM2(player);
  }

  // Some babies grant a golden bomb.
  if (baby.goldenBomb === true) {
    player.AddGoldenBomb();
  }

  // Some babies grant a golden key.
  if (baby.goldenKey === true) {
    player.AddGoldenKey();
  }

  // Some babies give Easter Eggs.
  if (baby.seed !== undefined) {
    seeds.AddSeedEffect(baby.seed);
  }

  // Don't grant extra pickups (from e.g. PHD)
  for (const pickup of getPickups()) {
    if (
      pickup.FrameCount === 0
      && pickup.Variant !== PickupVariant.COLLECTIBLE
      && !isChest(pickup)
    ) {
      pickup.Remove();
    }
  }

  // Add miscellaneous other effects.
  const babyClass = BABY_CLASS_MAP.get(babyType);
  if (babyClass !== undefined) {
    babyClass.onAdd(player);
  }

  // Reset the player's size.
  player.SpriteScale = VectorOne;

  // Some babies grant extra stats or flight.
  player.AddCacheFlags(CacheFlag.ALL);
  player.EvaluateItems();

  updatePlayerWithCostumeProtector(player, babyType, baby);

  log(
    `The Babies Mod - Applied baby: ${baby.name} (#${babyType}) - ${baby.description}`,
  );
}
