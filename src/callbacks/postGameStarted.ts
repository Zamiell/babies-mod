import g from "../globals";
import log from "../log";
import { giveItemAndRemoveFromPools } from "../misc";
import { PlayerTypeCustom } from "../types/enums";
import GlobalsRun from "../types/GlobalsRun";
import * as postNewLevel from "./postNewLevel";

export function main(isContinued: boolean): void {
  const startSeedString = g.seeds.GetStartSeedString();
  const randomSeed = g.l.GetDungeonPlacementSeed();
  const character = g.p.GetPlayerType();
  const isaacFrameCount = Isaac.GetFrameCount();

  log(
    `MC_POST_GAME_STARTED - Seed: ${startSeedString} - IsaacFrame: ${isaacFrameCount}`,
  );

  // Don't do anything if this is not a new run
  if (isContinued) {
    return;
  }

  // Reset variables
  g.run = new GlobalsRun(randomSeed);

  // Also reset the list of past babies that have been chosen
  g.pastBabies = [];

  // Easter Eggs from babies are normally removed upon going to the next floor
  // We also have to check to see if they reset the game while on a baby with a custom Easter Egg
  // effect
  for (const baby of g.babies) {
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
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_GUILLOTINE); // 206
  // (this item will not properly display and there is no good way to fix it)
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SCISSORS); // 325
  // (this item will not properly display and there is no good way to fix it)
  g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_CLICKER); // 482
  // (there is no way to know which character that you Clicker to, so just remove this item)
  g.itemPool.RemoveTrinket(TrinketType.TRINKET_BAT_WING); // 118
  // (Bat Wing causes graphical bugs which are annoying to fix, so just remove this trinket)

  // Call PostNewLevel manually (they get naturally called out of order)
  postNewLevel.newLevel();
}
