import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getEffectiveStage,
  getPlayerFromEntity,
  getRandom,
  ModCallbackCustom,
  newRNG,
  useActiveItemTemp,
} from "isaacscript-common";
import { RandomBabyType } from "../../enums/RandomBabyType";
import { g } from "../../globals";
import { BabyDescription } from "../../types/BabyDescription";
import { Baby } from "../Baby";

/** 50% chance for bombs to have the D6 effect. */
export class BombBaby extends Baby {
  v = {
    run: {
      rng: newRNG(),
    },
  };

  constructor(babyType: RandomBabyType, baby: BabyDescription) {
    super(babyType, baby);
    this.saveDataManager(this);
  }

  override onAdd(): void {
    const startSeed = g.seeds.GetStartSeed();
    this.v.run.rng = newRNG(startSeed);
  }

  /** There are no items on Cathedral. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage !== LevelStage.SHEOL_CATHEDRAL;
  }

  @CallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED)
  postBombExploded(bomb: EntityBomb): void {
    const player = getPlayerFromEntity(bomb);
    if (player === undefined) {
      return;
    }

    const d6chance = getRandom(this.v.run.rng);
    if (d6chance <= 0.5) {
      useActiveItemTemp(player, CollectibleType.D6);
    }
  }
}
