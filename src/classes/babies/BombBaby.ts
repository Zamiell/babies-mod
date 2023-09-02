import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  game,
  getPlayerFromEntity,
  getRandom,
  newRNG,
  onStage,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

const v = {
  run: {
    rng: newRNG(),
  },
};

/** 50% chance for bombs to have the D6 effect. */
export class BombBaby extends Baby {
  v = v;

  override onAdd(): void {
    const seeds = game.GetSeeds();
    const startSeed = seeds.GetStartSeed();
    v.run.rng = newRNG(startSeed);
  }

  /** There are no collectibles on Sheol/Cathedral. */
  override isValid(): boolean {
    return !onStage(LevelStage.SHEOL_CATHEDRAL);
  }

  @CallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED)
  postBombExploded(bomb: EntityBomb): void {
    const player = getPlayerFromEntity(bomb);
    if (player === undefined) {
      return;
    }

    const d6chance = getRandom(v.run.rng);
    if (d6chance <= 0.5) {
      useActiveItemTemp(player, CollectibleType.D6);
    }
  }
}
