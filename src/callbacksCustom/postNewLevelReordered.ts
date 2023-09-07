import { CollectibleType } from "isaac-typescript-definitions";
import {
  assertDefined,
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
import { PlayerTypeCustom } from "../enums/PlayerTypeCustom";
import { RandomBabyType } from "../enums/RandomBabyType";
import { g } from "../globals";
import { mod } from "../mod";
import { getCurrentBaby } from "../utilsBaby";

export function init(): void {
  mod.AddCallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED, main);
}

function main() {
  const gameFrameCount = game.GetFrameCount();
  const level = game.GetLevel();
  const stage = level.GetStage();
  const stageType = level.GetStageType();
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
  // Birthright has the effect of keeping the current baby for the remainder of the run.
  if (player.HasCollectible(CollectibleType.BIRTHRIGHT)) {
    return;
  }

  // Set the new baby.
  babyRemove(player);
  getAndSetNewBabyInGlobals(player);
  babyAdd(player);
}

function getAndSetNewBabyInGlobals(player: EntityPlayer) {
  const level = game.GetLevel();
  const seed = level.GetDungeonPlacementSeed();
  const rng = newRNG(seed);

  // It will become impossible to find a new baby if the list of past babies grows too large. (When
  // experimenting, it crashed upon reaching a size of 538, so reset it when it gets over 500 just
  // in case.)
  if (g.pastBabies.size > 500) {
    g.pastBabies.clear();
  }

  // Get a random co-op baby based on the seed of the floor, but reroll the baby if the baby is not
  // valid (e.g. if the player has any overlapping collectibles).
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

  // Keep track of the babies that we choose so that we can avoid giving duplicates on the same run.
  g.pastBabies.add(babyType);

  const currentBaby = getCurrentBaby();
  assertDefined(
    currentBaby,
    'Failed to get the current baby in the "getAndSetNewBabyInGlobals" function.',
  );
  const { baby } = currentBaby;

  log(`Randomly chose baby: ${babyType} - ${baby.name} - ${baby.description}`);
  log(`Tries: ${numTries}, total past babies: ${g.pastBabies.size}`);
}
