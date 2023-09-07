import {
  CollectibleType,
  SeedEffect,
  TrinketType,
} from "isaac-typescript-definitions";
import {
  ModCallbackCustom,
  anyPlayerIs,
  game,
  getCharacterName,
  getPlayersOfType,
  log,
} from "isaacscript-common";
import { PlayerTypeCustom } from "../enums/PlayerTypeCustom";
import type { BabyDescription } from "../interfaces/BabyDescription";
import { mod } from "../mod";
import { BABIES } from "../objects/babies";
import { giveCollectibleAndRemoveFromPools } from "../utils";

const ALL_BABY_SEED_EFFECTS: readonly SeedEffect[] = (() => {
  const seedEffects: SeedEffect[] = [];

  for (const babyRaw of Object.values(BABIES)) {
    const baby = babyRaw as BabyDescription;

    if (baby.seed !== undefined) {
      seedEffects.push(baby.seed);
    }
  }

  return seedEffects;
})();

const CHANGE_CHARACTER_COLLECTIBLE_TYPES = [
  CollectibleType.ANKH, // 161
  CollectibleType.JUDAS_SHADOW, // 311
  CollectibleType.LAZARUS_RAGS, // 332
  CollectibleType.CLICKER, // 482
] as const;

const BANNED_COLLECTIBLES_WITH_RANDOM_BABY = [
  // Guillotine will not display properly because Random Baby does not have a head.
  CollectibleType.GUILLOTINE, // 206

  // Scissors will not display properly because Random Baby does not have a head.
  CollectibleType.SCISSORS, // 325

  ...CHANGE_CHARACTER_COLLECTIBLE_TYPES,
] as const;

const CHANGE_CHARACTER_TRINKET_TYPES = [
  TrinketType.MISSING_POSTER, // 23
  TrinketType.MYSTERIOUS_PAPER, // 21
  TrinketType.BROKEN_ANKH, // 28
  TrinketType.ERROR, // 75
  // TrinketType.MODELING_CLAY (166) can never grant a revival collectible because no revival
  // collectibles have a type of "summonable".
] as const;

const BANNED_TRINKETS_WITH_RANDOM_BABY = [
  ...CHANGE_CHARACTER_TRINKET_TYPES,
] as const;

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    main,
    undefined,
  );
}

function main(isContinued: boolean) {
  const seeds = game.GetSeeds();
  const startSeedString = seeds.GetStartSeedString();
  const renderFrameCount = Isaac.GetFrameCount();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();
  const characterName = getCharacterName(character);

  log(
    `MC_POST_GAME_STARTED_REORDERED (Babies Mod) - Seed: ${startSeedString} - Render frame: ${renderFrameCount} - Continued: ${isContinued} - Character: ${characterName} (${character})`,
  );

  // Don't do anything if this is not a new run.
  if (isContinued) {
    return;
  }

  // Easter Eggs from babies are normally removed upon going to the next floor. We also have to
  // check to see if they reset the game while on a baby with a custom Easter Egg effect.
  for (const seed of ALL_BABY_SEED_EFFECTS) {
    seeds.RemoveSeedEffect(seed);
  }

  // Also remove seeds that are turned on manually in the `POST_UPDATE` callback.
  if (seeds.HasSeedEffect(SeedEffect.OLD_TV)) {
    seeds.RemoveSeedEffect(SeedEffect.OLD_TV);
  }

  if (anyPlayerIs(PlayerTypeCustom.RANDOM_BABY)) {
    postGameStartedRandomBaby();
  }
}

function postGameStartedRandomBaby() {
  const itemPool = game.GetItemPool();

  // Random Baby always starts with the Schoolbag so that the babies with active items have more of
  // a chance to be selected.
  const randomBabies = getPlayersOfType(PlayerTypeCustom.RANDOM_BABY);
  for (const randomBaby of randomBabies) {
    giveCollectibleAndRemoveFromPools(randomBaby, CollectibleType.SCHOOLBAG);
  }

  for (const collectibleType of BANNED_COLLECTIBLES_WITH_RANDOM_BABY) {
    itemPool.RemoveCollectible(collectibleType);
  }

  for (const trinketType of BANNED_TRINKETS_WITH_RANDOM_BABY) {
    itemPool.RemoveTrinket(trinketType);
  }
}
