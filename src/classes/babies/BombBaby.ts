import { CollectibleType } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getRandom,
  newRNG,
  useActiveItemTemp,
} from "isaacscript-common";
import {
  getBabyPlayerFromEntity,
  onStageWithCollectibles,
  setInitialBabyRNG,
} from "../../utils";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** N% chance for bombs to have the D6 effect. */
export class BombBaby extends Baby {
  v = v;

  override isValid(): boolean {
    return onStageWithCollectibles();
  }

  override onAdd(): void {
    setInitialBabyRNG(v.run.rng);
  }

  @CallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED)
  postBombExploded(bomb: EntityBomb): void {
    const player = getBabyPlayerFromEntity(bomb);
    if (player === undefined) {
      return;
    }

    // We don't want the chance to be based on the bomb's `InitSeed` because then the effect would
    // be essentially unseeded in a seeded race.
    const d6chance = getRandom(v.run.rng);
    const num = this.getAttribute("num");

    if (d6chance < num) {
      useActiveItemTemp(player, CollectibleType.D6);
    }
  }
}
