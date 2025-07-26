import type { Challenge } from "isaac-typescript-definitions";
import { CollectibleType, ModCallback } from "isaac-typescript-definitions";
import {
  Callback,
  CallbackCustom,
  ModCallbackCustom,
  ModFeature,
  game,
  getRandomEnumValue,
  inStartingRoom,
  isCharacter,
  log,
  newRNG,
  onChallenge,
  rebirthItemTrackerWriteToFile,
} from "isaacscript-common";
import { babyAdd } from "../../babyAdd";
import { babyCheckValid } from "../../babyCheckValid";
import { babyRemove } from "../../babyRemove";
import { PlayerTypeCustom } from "../../enums/PlayerTypeCustom";
import { RandomBabyType } from "../../enums/RandomBabyType";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { setInitialBabyRNG } from "../../utils";
import { v } from "./babySelection/v";

declare const RacingPlusIsOnFirstCharacter: (() => boolean) | undefined;

/** We expose a global variable so that other mods can detect what the current baby is. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let BabiesModBabyType: RandomBabyType | undefined;

/** This does not extend from `BabyModFeature` because that class uses this feature's variables. */
export class BabySelection extends ModFeature {
  v = v;

  /**
   * Handle setting the baby when Glowing Hour Glass is used in the starting room of a new floor.
   */
  @Callback(ModCallback.POST_USE_ITEM, CollectibleType.GLOWING_HOUR_GLASS)
  postUseItemGlowingHourGlass(): boolean | undefined {
    const room = game.GetRoom();
    const isFirstVisit = room.IsFirstVisit();

    if (inStartingRoom() && isFirstVisit) {
      v.run.usedGlowingHourGlassInStartingRoom = true;
    }

    return undefined;
  }

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    if (this.shouldClearPastBabiesOnNewRun()) {
      v.persistent.pastBabies.clear();
    }
  }

  /**
   * In most cases, we clear the list of past babies at the beginning of every new run. The
   * exception is during the Racing+ custom challenge. In that case, we only want to clear it on the
   * first character.
   */
  shouldClearPastBabiesOnNewRun(): boolean {
    const season5 = Isaac.GetChallengeIdByName("R+7 Season 5") as
      | Challenge
      | -1;

    if (season5 !== -1 && onChallenge(season5)) {
      return (
        RacingPlusIsOnFirstCharacter === undefined
        || RacingPlusIsOnFirstCharacter()
      );
    }

    return true;
  }

  @CallbackCustom(ModCallbackCustom.POST_NEW_LEVEL_REORDERED)
  postNewLevelReordered(): void {
    const player = Isaac.GetPlayer();
    if (isCharacter(player, PlayerTypeCustom.RANDOM_BABY)) {
      this.setNewBaby(player);
    }
  }

  setNewBaby(player: EntityPlayer): void {
    // Birthright has the effect of keeping the current baby for the remainder of the run.
    if (player.HasCollectible(CollectibleType.BIRTHRIGHT)) {
      return;
    }

    const oldBabyType = v.run.babyType;
    if (oldBabyType !== null) {
      const oldBaby = BABIES[oldBabyType];
      babyRemove(player, oldBabyType, oldBaby);
    }

    // We must update the `v` variables before we add the baby so that e.g. the `EVALUATE_CACHE`
    // callback works properly.
    const { babyType, baby } = this.getNewRandomBaby(player);
    v.run.pastBabyType = v.run.babyType;
    v.run.babyType = babyType;
    v.persistent.pastBabies.add(babyType);
    BabiesModBabyType = babyType;

    // Write the baby description to a file to allow streamers to capture the text file in Open
    // Broadcaster Software (OBS) to show to the stream.
    const description =
      baby.description2 === undefined
        ? baby.description
        : `${baby.description} ${baby.description2}`;
    rebirthItemTrackerWriteToFile(
      `${baby.name} (#${babyType}) - ${description}`,
    );

    babyAdd(player, babyType, baby);
  }

  getNewRandomBaby(player: EntityPlayer): {
    babyType: RandomBabyType;
    baby: BabyDescription;
  } {
    if (
      v.run.usedGlowingHourGlassInStartingRoom
      && v.run.pastBabyType !== null
    ) {
      v.run.usedGlowingHourGlassInStartingRoom = false;

      return {
        babyType: v.run.pastBabyType,
        baby: BABIES[v.run.pastBabyType],
      };
    }

    const rng = newRNG();
    setInitialBabyRNG(rng);
    log(`Getting a random baby with seed: ${rng.GetSeed()}`);

    // It will become impossible to find a new baby if the list of past babies grows too large.
    // (When experimenting, it crashed upon reaching a size of 538, so reset it when it gets over
    // 500 just in case.)
    if (v.persistent.pastBabies.size > 500) {
      v.persistent.pastBabies.clear();
    }

    // Get a random co-op baby based on the seed of the floor, but reroll the baby if the baby is
    // not valid (e.g. if the player has any overlapping collectibles).
    let babyType: RandomBabyType;
    let baby: BabyDescription;
    let numTries = 0;
    do {
      // Don't randomly choose a co-op baby if we are choosing a specific one for debugging
      // purposes.
      if (v.persistent.debugBabyType !== null) {
        babyType = v.persistent.debugBabyType;
        baby = BABIES[babyType];
        break;
      }

      numTries++;
      babyType = getRandomEnumValue(RandomBabyType, rng);
      baby = BABIES[babyType];
      log(
        `Checking to see if the following baby is valid: ${babyType} - ${baby.name} - ${baby.description}`,
      );
    } while (!babyCheckValid(player, babyType, baby, v.persistent.pastBabies));

    log(`Chose baby: ${babyType} - ${baby.name} - ${baby.description}`);
    log(
      `Tries: ${numTries}, total past babies: ${v.persistent.pastBabies.size}`,
    );

    return {
      babyType,
      baby,
    };
  }
}
