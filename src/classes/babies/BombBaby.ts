import {
  CollectibleType,
  EntityType,
  LevelStage,
} from "isaac-typescript-definitions";
import {
  CallbackCustom,
  getEffectiveStage,
  getRandom,
  ModCallbackCustom,
  useActiveItemTemp,
} from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** 50% chance for bombs to have the D6 effect. */
export class BombBaby extends Baby {
  /** There are no items on Cathedral. */
  override isValid(): boolean {
    const effectiveStage = getEffectiveStage();
    return effectiveStage !== LevelStage.SHEOL_CATHEDRAL;
  }

  @CallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED)
  postBombExploded(bomb: EntityBomb): void {
    if (bomb.SpawnerType !== EntityType.PLAYER) {
      return;
    }

    const d6chance = getRandom(g.run.room.rng);
    if (d6chance <= 0.5) {
      useActiveItemTemp(g.p, CollectibleType.D6);
    }
  }
}
