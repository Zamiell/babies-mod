import { CollectibleType, TrinketType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  ModFeature,
  anyPlayerIs,
  game,
} from "isaacscript-common";
import { PlayerTypeCustom } from "../../enums/PlayerTypeCustom";

const CHANGE_CHARACTER_COLLECTIBLE_TYPES = [
  CollectibleType.ANKH, // 161
  CollectibleType.JUDAS_SHADOW, // 311
  CollectibleType.LAZARUS_RAGS, // 332
  CollectibleType.CLICKER, // 482
] as const;

const REROLL_BUILD_COLLECTIBLE_TYPES = [
  CollectibleType.D100, // 283
  CollectibleType.D4, // 284
  CollectibleType.D_INFINITY, // 489
  CollectibleType.ESAU_JR, // 703
] as const;

const BANNED_COLLECTIBLES_WITH_RANDOM_BABY = [
  // Guillotine will not display properly because Random Baby does not have a head.
  CollectibleType.GUILLOTINE, // 206

  // Scissors will not display properly because Random Baby does not have a head.
  CollectibleType.SCISSORS, // 325

  ...CHANGE_CHARACTER_COLLECTIBLE_TYPES,
  ...REROLL_BUILD_COLLECTIBLE_TYPES,
] as const;

const CHANGE_CHARACTER_TRINKET_TYPES = [
  TrinketType.MISSING_POSTER, // 23
  TrinketType.MYSTERIOUS_PAPER, // 21
  TrinketType.BROKEN_ANKH, // 28
  TrinketType.ERROR, // 75
  // TrinketType.MODELING_CLAY (166) can never grant a revival collectible because no revival
  // collectibles have a type of "summonable".
] as const;

const REROLL_BUILD_TRINKET_TYPES = [
  TrinketType.DICE_BAG, // 154
] as const;

const BANNED_TRINKETS_WITH_RANDOM_BABY = [
  ...CHANGE_CHARACTER_TRINKET_TYPES,
  ...REROLL_BUILD_TRINKET_TYPES,
] as const;

/** This feature does not extend from `BabyModFeature` because we do not want any validation. */
export class BabyStartingItems extends ModFeature {
  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReordered(): void {
    if (!anyPlayerIs(PlayerTypeCustom.RANDOM_BABY)) {
      return;
    }

    const itemPool = game.GetItemPool();

    for (const collectibleType of BANNED_COLLECTIBLES_WITH_RANDOM_BABY) {
      itemPool.RemoveCollectible(collectibleType);
    }

    for (const trinketType of BANNED_TRINKETS_WITH_RANDOM_BABY) {
      itemPool.RemoveTrinket(trinketType);
    }

    // Racing+ has a custom version of Judas' Shadow.
    const judasShadowPlaceholder = Isaac.GetItemIdByName(
      "Judas' Shadow Placeholder",
    ) as CollectibleType | -1;
    if (judasShadowPlaceholder !== -1) {
      itemPool.RemoveCollectible(judasShadowPlaceholder);
    }
  }
}
