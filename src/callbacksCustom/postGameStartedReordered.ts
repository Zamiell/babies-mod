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
import { g } from "../globals";
import { mod } from "../mod";
import { BABIES } from "../objects/babies";
import { GlobalsRun } from "../types/GlobalsRun";
import { PlayerTypeCustom } from "../types/PlayerTypeCustom";
import { giveItemAndRemoveFromPools } from "../utils";

const ALL_BABY_SEED_EFFECTS: readonly SeedEffect[] = (() => {
  const seedEffects: SeedEffect[] = [];

  for (const baby of Object.values(BABIES)) {
    if ("seed" in baby) {
      seedEffects.push(baby.seed);
    }
  }

  return seedEffects;
})();

const REVIVAL_COLLECTIBLE_TYPES = [
  CollectibleType.ANKH, // 161
  CollectibleType.JUDAS_SHADOW, // 311
  CollectibleType.LAZARUS_RAGS, // 332
] as const;

const BANNED_COLLECTIBLES_WITH_RANDOM_BABY = [
  // Guillotine will not display properly because Random Baby does not have a head.
  CollectibleType.GUILLOTINE, // 206

  // Scissors will not display properly because Random Baby does not have a head.
  CollectibleType.SCISSORS, // 325

  // Changing characters is banned on Random Baby.
  CollectibleType.CLICKER, // 482
  ...REVIVAL_COLLECTIBLE_TYPES,
] as const;

const REVIVAL_TRINKETS = [
  TrinketType.MISSING_POSTER, // 23
  TrinketType.MYSTERIOUS_PAPER, // 21
  TrinketType.BROKEN_ANKH, // 28
  TrinketType.ERROR, // 75
] as const;

const BANNED_TRINKETS_WITH_RANDOM_BABY = [...REVIVAL_TRINKETS] as const;

export function init(): void {
  mod.AddCallbackCustom(
    ModCallbackCustom.POST_GAME_STARTED_REORDERED,
    main,
    undefined,
  );
}

function main(isContinued: boolean) {
  const seeds = game.GetSeeds();
  const startSeed = seeds.GetStartSeed();
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

  // Reset variables
  g.run = new GlobalsRun(startSeed);

  // Also reset the list of past babies that have been chosen.
  g.pastBabies = [];

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

  // Random Baby always starts with the Schoolbag.
  const randomBabies = getPlayersOfType(PlayerTypeCustom.RANDOM_BABY);
  for (const randomBaby of randomBabies) {
    giveItemAndRemoveFromPools(randomBaby, CollectibleType.SCHOOLBAG);
  }

  for (const collectibleType of BANNED_COLLECTIBLES_WITH_RANDOM_BABY) {
    itemPool.RemoveCollectible(collectibleType);
  }

  for (const trinketType of BANNED_TRINKETS_WITH_RANDOM_BABY) {
    itemPool.RemoveTrinket(trinketType);
  }
}
