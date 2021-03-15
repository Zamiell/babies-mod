import babyAdd from "../babyAdd";
import babyCheckValid from "../babyCheckValid";
import babyRemove from "../babyRemove";
import { R7_SEASON_5 } from "../constants";
import g from "../globals";
import * as misc from "../misc";
import GlobalsRunLevel from "../types/GlobalsRunLevel";
import * as postNewRoom from "./postNewRoom";

export function main(): void {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();

  // Make sure the callbacks run in the right order
  // (naturally, PostNewLevel gets called before the PostGameStarted callbacks)
  if (gameFrameCount === 0) {
    return;
  }

  newLevel();
}

export function newLevel(): void {
  // Local variables
  const gameFrameCount = g.g.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const challenge = Isaac.GetChallenge();

  // Racing+ has a feature to remove duplicate rooms,
  // so it may reseed the floor immediately upon reaching it
  // If so, we don't want to do anything, since this isn't really a new level
  if (gameFrameCount !== 0 && gameFrameCount === g.run.level.stageFrame) {
    return;
  }

  // Reset floor-related variables
  g.run.level = new GlobalsRunLevel(stage, stageType, gameFrameCount);

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

  // Racing+ removes all curses
  // If we are in the R+7 Season 5 custom challenge,
  // then all curses are disabled except for Curse of the Unknown
  // Thus, we might naturally get this curse inside the challenge, so make sure it is disabled
  if (challenge === Isaac.GetChallengeIdByName(R7_SEASON_5)) {
    g.l.RemoveCurse(LevelCurse.CURSE_OF_THE_UNKNOWN);
  }

  // Set the new baby
  babyRemove();
  getNewBaby();
  babyAdd();

  // Call PostNewRoom manually (they get naturally called out of order)
  postNewRoom.newRoom();
}

function getNewBaby() {
  // Local variables
  let seed = g.l.GetDungeonPlacementSeed();

  // Don't get a new baby if we did not start the run as the Random Baby character
  if (!g.run.enabled) {
    g.run.babyType = 0;
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
    seed = misc.incrementRNG(seed);
    math.randomseed(seed);

    // Get a random index for the "babies" array
    // We have a null element at position 0
    // We do not have to do "g.babies.length - 1" because then the transpiled range would be invalid
    // for a Lua array
    babyType = math.random(1, g.babies.length);

    // Don't randomly choose a co-op baby if we are choosing a specific one for debugging purposes
    if (g.debugBabyNum !== null) {
      babyType = g.debugBabyNum;
      break;
    }
  } while (!babyCheckValid(babyType));

  // Set the newly chosen baby type
  g.run.babyType = babyType;

  // Keep track of the babies that we choose so that we can avoid giving duplicates
  // on the same run / multi-character custom challenge
  g.pastBabies.push(babyType);

  const [, baby] = misc.getCurrentBaby();
  Isaac.DebugString(
    `Randomly chose co-op baby. ${babyType} - ${baby.name} - ${baby.description}`,
  );
  Isaac.DebugString(`Tries: ${i}, total past babies: ${g.pastBabies.length}`);
}
