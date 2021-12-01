import { log } from "isaacscript-common";
import { BABIES } from "../babies";
import g from "../globals";
import { PlayerTypeCustom } from "../types/enums";
import { GlobalsRun } from "../types/GlobalsRun";
import { giveItemAndRemoveFromPools } from "../util";

export function main(isContinued: boolean): void {
  const startSeed = g.seeds.GetStartSeed();
  const startSeedString = g.seeds.GetStartSeedString();
  const character = g.p.GetPlayerType();
  const isaacFrameCount = Isaac.GetFrameCount();

  log(
    `MC_POST_GAME_STARTED (Babies Mod) - Seed: ${startSeedString} - IsaacFrame: ${isaacFrameCount}`,
  );

  // Don't do anything if this is not a new run
  if (isContinued) {
    return;
  }

  // Reset variables
  g.run = new GlobalsRun(startSeed);

  // Also reset the list of past babies that have been chosen
  g.pastBabies = [];

  // Easter Eggs from babies are normally removed upon going to the next floor
  // We also have to check to see if they reset the game while on a baby with a custom Easter Egg
  // effect
  for (const baby of BABIES) {
    if (baby.seed !== undefined) {
      if (g.seeds.HasSeedEffect(baby.seed)) {
        g.seeds.RemoveSeedEffect(baby.seed);
      }
    }
  }

  // Also remove seeds that are turned on manually in the PostUpdate callback
  if (g.seeds.HasSeedEffect(SeedEffect.SEED_OLD_TV)) {
    g.seeds.RemoveSeedEffect(SeedEffect.SEED_OLD_TV);
  }

  // We want to keep track that we started the run as the "Random Baby" character,
  // in case the player changes their character later through Judas' Shadow, etc.
  if (character === PlayerTypeCustom.PLAYER_RANDOM_BABY) {
    g.run.enabled = true;
  } else {
    return;
  }
  // (only do the following things if we are on the Random Baby character)

  // Random Baby always starts with the Schoolbag
  giveItemAndRemoveFromPools(CollectibleType.COLLECTIBLE_SCHOOLBAG);

  // Remove some items from pools
  // Guillotine not display properly because Random Baby does not have a head
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_GUILLOTINE); // 206
  // Scissors will not display properly because Random Baby does not have a head
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SCISSORS); // 325
  // Clicker can cause bugs that are too painful to work around
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_CLICKER); // 482
}
