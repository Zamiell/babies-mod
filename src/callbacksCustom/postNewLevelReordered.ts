import { CollectibleType } from "isaac-typescript-definitions";
import {
  game,
  getPlayersOfType,
  getRandomEnumValue,
  log,
  ModCallbackCustom,
  newRNG,
} from "isaacscript-common";
import { babyAdd } from "../babyAdd";
import { babyCheckValid } from "../babyCheckValid";
import { babyRemove } from "../babyRemove";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import { PlayerTypeCustom } from "../types/PlayerTypeCustom";
import { getCurrentBaby } from "../utilsBaby";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED, main);
}

function main() {
  const gameFrameCount = game.GetFrameCount();
  const stage = g.l.GetStage();
  const stageType = g.l.GetStageType();
  const renderFrameCount = Isaac.GetFrameCount();

  log(
    `MC_POST_NEW_LEVEL_REORDERED (Babies Mod) - Stage: ${stage}.${stageType} - Game frame: ${gameFrameCount} - Render frame: ${renderFrameCount}`,
  );

  const randomBabies = getPlayersOfType(PlayerTypeCustom.RANDOM_BABY);
  for (const randomBaby of randomBabies) {
    setNewBaby(randomBaby);
  }
}

function setNewBaby(player: EntityPlayer) {
  const gameFrameCount = game.GetFrameCount();

  // Birthright has the effect of keeping the current baby for the remainder of the run.
  if (player.HasCollectible(CollectibleType.BIRTHRIGHT)) {
    return;
  }

  const oldBabyCounters = g.run.babyCounters;

  // Reset baby-specific variables
  g.run.babyBool = false;
  g.run.babyCounters = 0;
  g.run.babyFrame = 0;
  g.run.babySprite = null;

  // Display text describing the new baby.
  g.run.showIntroFrame = gameFrameCount + 60; // 2 seconds

  // Set the new baby.
  babyRemove(player, oldBabyCounters);
  getAndSetNewBabyInGlobals(player);
  babyAdd(player);
}

function getAndSetNewBabyInGlobals(player: EntityPlayer) {
  const levelSeed = g.l.GetDungeonPlacementSeed();
  const rng = newRNG(levelSeed);

  // Don't get a new baby if we did not start the run as the Random Baby character.
  if (!g.run.startedRunAsRandomBaby) {
    g.run.babyType = null;
    return;
  }

  // It will become impossible to find a new baby if the list of past babies grows too large. (When
  // experimenting, it crashed upon reaching a size of 538, so reset it when it gets over 500 just
  // in case.)
  if (g.pastBabies.length > 500) {
    g.pastBabies = [];
  }

  // Get a random co-op baby based on the seed of the floor (but reroll the baby if they have any
  // overlapping items).
  let babyType: RandomBabyType;
  let numTries = 0;
  do {
    numTries++;
    babyType = getRandomEnumValue(RandomBabyType, rng);

    // Don't randomly choose a co-op baby if we are choosing a specific one for debugging purposes.
    if (g.debugBabyNum !== undefined) {
      babyType = g.debugBabyNum;
      break;
    }
  } while (!babyCheckValid(player, babyType));

  // Set the newly chosen baby type.
  g.run.babyType = babyType;

  // Keep track of the babies that we choose so that we can avoid giving duplicates on the same run
  // / multi-character custom challenge.
  g.pastBabies.push(babyType);

  const [, baby] = getCurrentBaby();
  log(`Randomly chose baby: ${babyType} - ${baby.name} - ${baby.description}`);
  log(`Tries: ${numTries}, total past babies: ${g.pastBabies.length}`);
}
