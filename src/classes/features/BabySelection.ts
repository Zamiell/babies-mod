import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  ModFeature,
  game,
  getRandomEnumValue,
  isCharacter,
  log,
  newRNG,
} from "isaacscript-common";
import { babyAdd } from "../../babyAdd";
import { babyCheckValid } from "../../babyCheckValid";
import { babyRemove } from "../../babyRemove";
import { PlayerTypeCustom } from "../../enums/PlayerTypeCustom";
import { RandomBabyType } from "../../enums/RandomBabyType";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";
import { v } from "./babySelection/v";

/** This does not extend from `BabyModFeature` because that class uses this feature's variables. */
export class BabySelection extends ModFeature {
  v = v;

  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReorderedFalse(): void {
    // TODO: challenge logic
    v.persistent.pastBabies.clear();
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

    const { babyType, baby } = this.getNewRandomBaby(player);
    babyAdd(player, babyType, baby);

    v.run.babyType = babyType;
    v.persistent.pastBabies.add(babyType);
  }

  getNewRandomBaby(player: EntityPlayer): {
    babyType: RandomBabyType;
    baby: BabyDescription;
  } {
    const level = game.GetLevel();
    const seed = level.GetDungeonPlacementSeed();
    const rng = newRNG(seed);

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
    } while (!babyCheckValid(player, babyType, baby, v.persistent.pastBabies));

    log(
      `Randomly chose baby: ${babyType} - ${baby.name} - ${baby.description}`,
    );
    log(
      `Tries: ${numTries}, total past babies: ${v.persistent.pastBabies.size}`,
    );

    return {
      babyType,
      baby,
    };
  }
}
