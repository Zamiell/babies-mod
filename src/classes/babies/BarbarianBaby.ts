import { EntityType } from "isaac-typescript-definitions";
import { CallbackCustom, ModCallbackCustom } from "isaacscript-common";
import { g } from "../../globals";
import { Baby } from "../Baby";

/** Mama Mega bombs. */
export class BarbarianBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED)
  postBombExploded(bomb: EntityBomb): void {
    if (bomb.SpawnerType !== EntityType.PLAYER) {
      return;
    }

    g.r.MamaMegaExplossion();
  }
}
