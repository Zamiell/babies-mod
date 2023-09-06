import { CollectibleType, LevelStage } from "isaac-typescript-definitions";
import {
  CallbackCustom,
  ModCallbackCustom,
  getPlayerFromEntity,
  getRandom,
  onStage,
  useActiveItemTemp,
} from "isaacscript-common";
import { Baby } from "../Baby";

/** N% chance for bombs to have the D6 effect. */
export class BombBaby extends Baby {
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

    const d6chance = getRandom(bomb.InitSeed);
    const num = this.getAttribute("num");

    if (d6chance < num) {
      useActiveItemTemp(player, CollectibleType.D6);
    }
  }
}
