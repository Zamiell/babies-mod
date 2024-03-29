import { CallbackCustom, game, ModCallbackCustom } from "isaacscript-common";
import { Baby } from "../Baby";

/** Mama Mega bombs. */
export class BarbarianBaby extends Baby {
  @CallbackCustom(ModCallbackCustom.POST_BOMB_EXPLODED)
  postBombExploded(bomb: EntityBomb): void {
    const room = game.GetRoom();
    room.MamaMegaExplosion(bomb.Position);
  }
}
