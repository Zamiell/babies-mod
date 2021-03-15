import { R7_SEASON_5 } from "../constants";
import g from "../globals";
import { CollectibleTypeCustom } from "../types/enums.custom";
import GlobalsRun from "../types/GlobalsRun";
import * as postNewLevel from "./postNewLevel";

export function main(isContinued: boolean): void {
  // Local variables
  const character = g.p.GetPlayerType();
  const challenge = Isaac.GetChallenge();
  const randomSeed = g.l.GetDungeonPlacementSeed();

  // Don't do anything if this is not a new run
  if (isContinued) {
    return;
  }

  // Reset variables
  g.run = new GlobalsRun(randomSeed);

  // Also reset the list of past babies that have been chosen
  // (but don't do this if we are in the middle of a multi-character custom challenge)
  let resetPastBabies = true;
  if (
    challenge === Isaac.GetChallengeIdByName(R7_SEASON_5) &&
    g.racingPlusEnabled &&
    RacingPlusSpeedrun.charNum >= 2
  ) {
    resetPastBabies = false;
  }
  if (resetPastBabies) {
    g.pastBabies = [];
  }

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
  if (character === Isaac.GetPlayerTypeByName("Random Baby")) {
    g.run.enabled = true;
  } else {
    return;
  }
  // (only do the following things if we are on the Random Baby character)

  // Random Baby always starts with the Schoolbag
  if (!g.racingPlusEnabled) {
    g.p.AddCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG, 0, false);
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG);
  } else {
    g.p.AddCollectible(
      CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
      0,
      false,
    );
    g.itemPool.RemoveCollectible(CollectibleType.COLLECTIBLE_SCHOOLBAG);
    g.itemPool.RemoveCollectible(
      CollectibleTypeCustom.COLLECTIBLE_SCHOOLBAG_CUSTOM,
    );
  }

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
