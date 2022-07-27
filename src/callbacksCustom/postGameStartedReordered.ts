import { CollectibleType, SeedEffect } from "isaac-typescript-definitions";
import {
  isCharacter,
  log,
  ModCallbackCustom,
  ModUpgraded,
} from "isaacscript-common";
import g from "../globals";
import { BABIES } from "../objects/babies";
import { GlobalsRun } from "../types/GlobalsRun";
import { PlayerTypeCustom } from "../types/PlayerTypeCustom";
import { giveItemAndRemoveFromPools } from "../utils";

const ALL_BABY_SEED_EFFECTS: SeedEffect[] = [];
for (const baby of Object.values(BABIES)) {
  if (baby.seed !== undefined) {
    ALL_BABY_SEED_EFFECTS.push(baby.seed);
  }
}

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, main);
}

function main(isContinued: boolean) {
  const startSeed = g.seeds.GetStartSeed();
  const startSeedString = g.seeds.GetStartSeedString();
  const isaacFrameCount = Isaac.GetFrameCount();

  log(
    `MC_POST_GAME_STARTED (Babies Mod) - Seed: ${startSeedString} - IsaacFrame: ${isaacFrameCount}`,
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
    g.seeds.RemoveSeedEffect(seed);
  }

  // Also remove seeds that are turned on manually in the `POST_UPDATE` callback.
  if (g.seeds.HasSeedEffect(SeedEffect.OLD_TV)) {
    g.seeds.RemoveSeedEffect(SeedEffect.OLD_TV);
  }

  // We want to keep track that we started the run as the "Random Baby" character, in case the
  // player changes their character later through Judas' Shadow, etc.
  if (isCharacter(g.p, PlayerTypeCustom.RANDOM_BABY)) {
    g.run.startedRunAsRandomBaby = true;
  } else {
    // Early return if we are on the Random Baby character.
    return;
  }

  // Random Baby always starts with the Schoolbag.
  giveItemAndRemoveFromPools(CollectibleType.SCHOOLBAG);

  // Remove some items from pools Guillotine not display properly because Random Baby does not have
  // a head.
  g.itemPool.RemoveCollectible(CollectibleType.GUILLOTINE); // 206
  // Scissors will not display properly because Random Baby does not have a head.
  g.itemPool.RemoveCollectible(CollectibleType.SCISSORS); // 325
  // Clicker can cause bugs that are too painful to work around.
  g.itemPool.RemoveCollectible(CollectibleType.CLICKER); // 482
}
