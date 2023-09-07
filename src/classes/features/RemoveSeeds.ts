import { SeedEffect } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  ModFeature,
  filterMap,
  game,
} from "isaacscript-common";
import type { BabyDescription } from "../../interfaces/BabyDescription";
import { BABIES } from "../../objects/babies";

const BABY_SEED_EFFECTS: readonly SeedEffect[] = filterMap(
  Object.values(BABIES),
  (baby: BabyDescription) => baby.seed,
);

/** Some babies have their seed effects manually applied in the `POST_UPDATE` callback. */
const MANUAL_BABY_SEED_EFFECTS = [SeedEffect.OLD_TV] as const;

const ALL_BABY_SEED_EFFECTS = [
  ...BABY_SEED_EFFECTS,
  ...MANUAL_BABY_SEED_EFFECTS,
] as const;

/**
 * Easter Eggs from babies are normally removed upon going to the next floor. We also have to check
 * to see if they reset the game while on a baby with a custom Easter Egg effect.
 *
 * We do not extend from the `BabyModFeature` class because we do not want any validation. (For
 * example, it is possible to go from Random Baby to Isaac, and we would want the seeds to be
 * removed in that case.)
 */
export class RemoveSeeds extends ModFeature {
  @CallbackCustom(ModCallbackCustom.POST_GAME_STARTED_REORDERED, false)
  postGameStartedReordered(): void {
    const seeds = game.GetSeeds();

    for (const seed of ALL_BABY_SEED_EFFECTS) {
      seeds.RemoveSeedEffect(seed);
    }
  }
}
