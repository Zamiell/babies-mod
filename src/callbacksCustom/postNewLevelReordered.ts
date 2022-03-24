import {
  getRandomArrayIndex,
  log,
  ModCallbacksCustom,
  ModUpgraded,
  newRNG,
} from "isaacscript-common";
import { BABIES } from "../babies";
import { babyAdd } from "../babyAdd";
import { babyCheckValid } from "../babyCheckValid";
import { babyRemove } from "../babyRemove";
import g from "../globals";
import { GlobalsRunLevel } from "../types/GlobalsRunLevel";
import { getCurrentBaby } from "../utils";

export function init(mod: ModUpgraded): void {
  mod.AddCallbackCustom(ModCallbacksCustom.MC_POST_NEW_LEVEL_REORDERED, main);
}

function main() {
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();

  log(
    `MC_POST_NEW_LEVEL (Babies Mod) - ${stage}.${stageType} (game frame ${gameFrameCount})`,
  );

  // Reset floor-related variables
  g.run.level = new GlobalsRunLevel();

  // Birthright has the effect of keeping the current baby for the remainder of the run
  if (g.p.HasCollectible(CollectibleType.COLLECTIBLE_BIRTHRIGHT)) {
    return;
  }

  const oldBabyCounters = g.run.babyCounters;

  // Reset baby-specific variables
  g.run.babyBool = false;
  g.run.babyCounters = 0;
  // babyCountersRoom are reset in the PostNewRoom callback
  g.run.babyFrame = 0;
  // babyTears are reset in the PostNewRoom callback
  g.run.babyNPC = {
    type: 0,
    variant: 0,
    subType: 0,
  };
  g.run.babySprite = null;

  // Display text describing the new baby
  g.run.showIntroFrame = gameFrameCount + 60; // 2 seconds

  // Set the new baby
  babyRemove(g.p, oldBabyCounters);
  getNewBaby(g.p);
  babyAdd(g.p);
}

function getNewBaby(player: EntityPlayer) {
  const levelSeed = g.l.GetDungeonPlacementSeed();
  const rng = newRNG(levelSeed);

  // Don't get a new baby if we did not start the run as the Random Baby character
  if (!g.run.startedRunAsRandomBaby) {
    g.run.babyType = null;
    return;
  }

  // It will become impossible to find a new baby if the list of past babies grows too large
  // (when experimenting, it crashed upon reaching a size of 538,
  // so reset it when it gets over 500 just in case)
  if (g.pastBabies.length > 500) {
    g.pastBabies = [];
  }

  // Get a random co-op baby based on the seed of the floor
  // (but reroll the baby if they have any overlapping items)
  let babyType: int;
  let i = 0;
  do {
    i += 1;
    babyType = getRandomArrayIndex(BABIES, rng);

    // Don't randomly choose a co-op baby if we are choosing a specific one for debugging purposes
    if (g.debugBabyNum !== null) {
      babyType = g.debugBabyNum;
      break;
    }
  } while (!babyCheckValid(player, babyType));

  // Set the newly chosen baby type
  g.run.babyType = babyType;

  // Keep track of the babies that we choose so that we can avoid giving duplicates
  // on the same run / multi-character custom challenge
  g.pastBabies.push(babyType);

  const [, baby] = getCurrentBaby();
  log(`Randomly chose baby: ${babyType} - ${baby.name} - ${baby.description}`);
  log(`Tries: ${i}, total past babies: ${g.pastBabies.length}`);
}
